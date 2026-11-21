import {sanitizeEvent} from '../services/realtime/events.js';
import {operationalSummary} from '../services/verification/operationalSummary.js';
import contentWorkbenchRouter from './contentWorkbench.js';
import {attachedEvidence} from '../services/verification/attachedEvidence.js';
import express from "express";
import { randomUUID } from "node:crypto";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { z } from "zod";
import { models } from "../models/index.js";
import {AdminAudit,AdapterConfig,CollectionJob,CollectionSchedule,WorkerHeartbeat,} from "../models/admin.js";
import { env } from "../config/env.js";
import {cookieName,cookieOptions,credentialsMatch,adminConfigured,authenticate,tokenFrom,createSession,revokeSession,audit} from '../services/admin/auth.js';
import {fixtures,fail,sourceFor,enqueue,
  cancelJob,
  saveSchedule,
  scheduleDefinition,
} from "../services/admin/jobs.js";
import { authorize } from "../services/ingestion/access.js";
import { resolvePublic } from "../services/ingestion/access.js";
import { approval, identifier } from "../validators/contracts.js";
import { hash } from "../utils/hash.js";
import { MongoStore, scopedStore } from "../services/ingestion/store.js";
import { review } from "../services/verification/review.js";
import contentAdmin from "./contentAdmin.js";
import formsAdmin from './formsAdmin.js';
import reviewEvidence from './reviewEvidence.js';
import adminContentCatalog from './adminContentCatalog.js';
import { AIArtifact, AIJob, ContentApproval } from "../models/content.js";
import {verifyIdentityMapping} from '../services/ingestion/schemeIdentity.js';
import {sourceCoverage} from '../services/admin/sourceCoverage.js';
import {recentEvents} from '../services/realtime/events.js';
import {discoverOfficialSources} from '../services/ingestion/discovery.js';

const router = express.Router();
const loginLimit = rateLimit({
  windowMs: 15 * 60000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Too many sign-in attempts. Try again later.",
    },
  },
});
const apiLimit = rateLimit({
  windowMs: 60000,
  limit: 180,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
const asyncRoute = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res)).catch(next);
const loginInput=z.object({username:z.string().min(1).max(254),password:z.string().min(1).max(200)}).strict();
router.use(apiLimit,(_req,res,next)=>{res.set('Cache-Control','no-store');next();});
router.post('/auth/login',loginLimit,asyncRoute(async(req,res)=>{
  if(!adminConfigured())return res.status(503).json({error:{code:'ADMIN_SETUP_REQUIRED',message:'Set ADMIN_USERNAME and ADMIN_PASSWORD in backend/.env.'}});
  const value=loginInput.parse(req.body);
  if(!credentialsMatch(value.username,value.password))fail('Invalid username or password',401);
  revokeSession(tokenFrom(req));const token=createSession();
  res.cookie(cookieName,token,cookieOptions);res.json({user:{username:env.ADMIN_USERNAME}});
}));
router.use(authenticate);
router.get('/auth/session',(req,res)=>res.json({user:{username:req.admin.username}}));
router.post('/auth/logout',(req,res)=>{revokeSession(req.adminToken);res.clearCookie(cookieName,{...cookieOptions,maxAge:undefined});res.json({ok:true});});
// Authentication is independent of MongoDB; dashboard data still needs MongoDB.
router.use((_req,res,next)=>mongoose.connection.readyState===1?next():res.status(503).json({error:{code:'DATABASE_UNAVAILABLE',message:'Database unavailable'}}));
router.get('/source-coverage',asyncRoute(async(req,res)=>res.json(await sourceCoverage(req.query))));
router.post('/source-discovery',asyncRoute(async(req,res)=>{const value=z.object({schemeId:z.string().min(1).max(180),sourceGroup:z.enum(['JAN_SURAKSHA','PIB','NDMA','I4C'])}).strict().parse(req.body);res.json(await discoverOfficialSources(value.schemeId,value.sourceGroup));}));
router.use('/content',contentAdmin);
router.use('/forms',formsAdmin);
router.use('/review-evidence',reviewEvidence);
router.use('/content-catalog',adminContentCatalog);
router.use('/content-workbench',contentWorkbenchRouter);
router.get('/scheme-collection',asyncRoute(async(req,res)=>{
 const value=z.object({page:z.coerce.number().int().min(1).max(10000).default(1),limit:z.coerce.number().int().min(1).max(100).default(25),sourceId:z.string().max(180).optional(),classification:z.enum(['NEW','UNCHANGED','UPDATED']).optional()}).strict().parse(req.query);
 const filter={};if(value.sourceId)filter.$or=[{lastCollectionSourceId:value.sourceId},{sourceIds:value.sourceId}];if(value.classification)filter.lastCollectionStatus=value.classification;
 const [schemes,total,sources]=await Promise.all([models.Scheme.find(filter).sort({lastCheckedAt:-1,_id:1}).skip((value.page-1)*value.limit).limit(value.limit).lean(),models.Scheme.countDocuments(filter),models.Source.find().select('id title url original.synthetic authorizationStatus').lean()]);
 const items=schemes.map(s=>({id:s.id,canonicalId:s.canonicalId||s.id,title:s.title,sourceIds:s.sourceIds,sourceId:s.lastCollectionSourceId||s.sourceIds[0],sourceUrl:s.sourceUrl,lastCheckedAt:s.lastCheckedAt||null,lastChangedAt:s.lastChangedAt||null,classification:s.lastCollectionStatus||'NO_COLLECTED_OBSERVATION',reviewStatus:s.status,publicationStatus:s.publicationStatus}));
 res.json({items,total,page:value.page,limit:value.limit,sources:sources.map(s=>({id:s.id,title:s.title,url:s.url,synthetic:s.original?.synthetic===true,authorizationStatus:s.authorizationStatus}))});
}));
router.get('/scheme-collection/:id/history',asyncRoute(async(req,res)=>{
 const scheme=await models.Scheme.findById(req.params.id).select('id title currentVersionId publicationStatus status').lean();if(!scheme)fail('Scheme not found',404);
 const page=z.coerce.number().int().min(1).max(10000).default(1).parse(req.query.page),limit=20;
 const [items,total,changes]=await Promise.all([models.CollectionObservation.find({schemeId:scheme.id}).sort({checkedAt:-1,_id:1}).skip((page-1)*limit).limit(limit).lean(),models.CollectionObservation.countDocuments({schemeId:scheme.id}),models.ChangeEvent.find({entityType:'Scheme',entityId:scheme.id}).sort({createdAt:-1}).limit(20).lean()]);res.json({scheme,items,total,page,limit,changes});
}));
router.get('/scheme-identities/pending',asyncRoute(async(req,res)=>{
 const page=z.coerce.number().int().min(1).max(10000).default(1).parse(req.query.page),limit=20,filter={queueStatus:'PENDING'};
 const [items,total]=await Promise.all([models.IdentityReviewCandidate.find(filter).sort({lastCheckedAt:-1,_id:1}).skip((page-1)*limit).limit(limit).lean(),models.IdentityReviewCandidate.countDocuments(filter)]);res.json({items,total,page,limit});
}));
router.post('/scheme-identities/:id/verify',asyncRoute(async(req,res)=>{
 const body=z.object({schemeId:z.string().min(1).max(180),observationId:z.string().min(1).max(180),evidence:z.string().trim().min(10).max(2000),confirmed:z.literal(true)}).strict().parse(req.body);
 try{const result=await verifyIdentityMapping(new MongoStore(),req.params.id,body,req.admin.username);res.json(result);}catch(error){fail(error.name==='Error'&&/identity|canonical|Pending identity|evidence changed/i.test(error.message)?error.message:'Identity mapping stopped safely; inspect current evidence and history.',409);}
}));
router.get(
  "/stats",
  asyncRoute(async (_req, res) => {
    const names = [
      "Scheme",
      "FormTemplate",
      "Notice",
      "ScamAlert",
      "Source",
      "ChangeEvent",
      "ImportRejection",
    ];
    const counts = Object.fromEntries(
      await Promise.all(
        names.map(async (n) => [n, await models[n].countDocuments()]),
      ),
    );
    counts.approvedSources = await models.Source.countDocuments({
      authorizationStatus: "APPROVED",
    });
    counts.restrictedSources = counts.Source - counts.approvedSources;
    counts.researchOnly = (
      await Promise.all(
        ["Scheme", "FormTemplate", "Notice", "ScamAlert"].map((n) =>
          models[n].countDocuments({ status: "RESEARCH_ONLY" }),
        ),
      )
    ).reduce((a, b) => a + b, 0);
    const totals = await models.IngestionRun.aggregate([
      {
        $group: {
          _id: null,
          created: { $sum: "$counters.created" },
          updated: { $sum: "$counters.updated" },
          unchanged: { $sum: "$counters.unchanged" },
          rejected: { $sum: "$counters.rejected" },
        },
      },
    ]);
    const outcomes = await CollectionJob.aggregate([
      {
        $group: {
          _id: { mode: "$mode", trigger: "$trigger", state: "$state" },
          count: { $sum: 1 },
        },
      },
    ]);
    const recent = await models.IngestionRun.find()
      .sort({ startedAt: -1 })
      .limit(20)
      .lean();
    const latestCollection = await models.IngestionRun.findOne({
      mode: { $in: ["FIXTURES", "ONLINE"] },
    })
      .sort({ startedAt: -1 })
      .lean();
    const completed = await models.IngestionRun.aggregate([
      { $match: { mode: { $in: ["FIXTURES", "ONLINE"] } } },
      {
        $group: {
          _id: "$mode",
          successful: { $sum: "$counters.successful" },
          failed: { $sum: "$counters.failed" },
          skipped: { $sum: "$counters.skipped" },
        },
      },
    ]);
    res.json({
      operational: await operationalSummary(),
      counts,
      totals: totals[0] || {},
      outcomes,
      recent,
      latestCollection,
      completed,
    });
  }),
);
router.get(
  "/sources",
  asyncRoute(async (_req, res) => {
    const [sources, configs, latestJobs] = await Promise.all([
      models.Source.find().sort({ title: 1 }).lean(),
      AdapterConfig.find().lean(),
      CollectionJob.aggregate([
        { $sort: { createdAt: -1 } },
        { $group: { _id: "$sourceId", job: { $first: "$$ROOT" } } },
      ]),
    ]);
    const all = [...sources];
    for (const f of fixtures)
      if (!all.some((s) => s.id === f.sourceId))
        all.push({
          id: f.sourceId,
          title: f.title,
          url: f.url,
          sourceType: "SYNTHETIC_FIXTURE",
          collectionMethod: f.method,
          authorizationStatus: "NOT_AUTHORIZED_FOR_AUTOMATION",
        });
    res.json({
      items: all.map((s) => ({
        ...s,
        config: configs.find((c) => c._id === s.id),
        fixtureAvailable: fixtures.some((f) => f.sourceId === s.id),
        latestJob:
          latestJobs.find((j) => j._id === s.id)?.job &&
          (({ leaseToken, ...job }) => job)(
            latestJobs.find((j) => j._id === s.id).job,
          ),
      })),
    });
  }),
);
router.put(
  "/sources/:id/config",
  asyncRoute(async (req, res) => {
    identifier.parse(req.params.id);
    const value = approval.parse(req.body);
    if (value.sourceId !== req.params.id) fail("Source identity mismatch");
    const source = await models.Source.findById(req.params.id).lean();
    if (!source) fail("Registered source required", 404);
    if (
      new URL(source.url).hostname !== value.host ||
      new URL(value.url).hostname !== value.host
    )
      fail("Adapter host must match registered source");
    authorize({ ...value, enabled: true }, value.url, value.method);
    const configHash = hash(value);
    const result = await AdapterConfig.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: { approval: value, configHash, enabled: false },
        $unset: { validatedHash: "", validatedAt: "" },
      },
      { upsert: true, new: true },
    );
    await models.Source.updateOne(
      { _id: req.params.id },
      { $set: { authorizationStatus: "NOT_AUTHORIZED_FOR_AUTOMATION" } },
    );
    await audit(
      req.admin._id,
      "SOURCE_CONFIG_SAVED_REQUIRES_VALIDATION",
      req.params.id,
      { configHash },
    );
    res.json(result);
  }),
);
router.post(
  "/sources/:id/validate",
  asyncRoute(async (req, res) => {
    const config = await AdapterConfig.findById(req.params.id).lean();
    if (!config) fail("Save evidence before validation", 409);
    const source = await models.Source.findById(req.params.id).lean();
    if (!source || new URL(source.url).hostname !== config.approval.host)
      fail("Registry identity mismatch", 409);
    authorize(
      { ...config.approval, enabled: true },
      config.approval.url,
      config.approval.method,
    );
    await resolvePublic(config.approval.host);
    // This validates operator-supplied evidence and destination safety, not a legal opinion.
    const result = await AdapterConfig.findOneAndUpdate(
      { _id: req.params.id, configHash: config.configHash },
      { $set: { validatedHash: config.configHash, validatedAt: new Date() } },
      { new: true },
    );
    await audit(req.admin._id, "SOURCE_EVIDENCE_VALIDATED", req.params.id, {
      configHash: config.configHash,
    });
    res.json(result);
  }),
);
router.post(
  "/sources/:id/activation",
  asyncRoute(async (req, res) => {
    const { enabled } = z
      .object({ enabled: z.boolean() })
      .strict()
      .parse(req.body);
    await new MongoStore().transaction(async (session) => {
      const config = await AdapterConfig.findById(req.params.id)
        .session(session)
        .lean();
      if (!config) fail("Adapter configuration required", 409);
      if (
        enabled &&
        (!config.validatedHash || config.configHash !== config.validatedHash)
      )
        fail(
          "Validate authorization evidence separately before activation",
          409,
        );
      const a = { ...config.approval, enabled: true };
      if (enabled) authorize(a, a.url, a.method);
      // Activation binds the exact validated approval snapshot; sourceFor rechecks on every execution.
      await AdapterConfig.updateOne(
        { _id: req.params.id },
        { $set: { enabled } },
        { session },
      );
      await models.Source.updateOne(
        { _id: req.params.id },
        {
          $set: {
            authorizationStatus: enabled ? "APPROVED" : "REVOKED",
            approval: config.approval,
            collectionMethod: config.approval.method,
          },
        },
        { session },
      );
      await audit(
        req.admin._id,
        enabled ? "SOURCE_ACTIVATED" : "SOURCE_DISABLED",
        req.params.id,
        {},
        session,
      );
    });
    res.json({ enabled });
  }),
);
function page(req) {
  return z
    .object({
      page: z.coerce.number().int().min(1).max(100000).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(20),
    })
    .parse(req.query);
}
async function paged(
  Model,
  filter,
  req,
  res,
  sort = { createdAt: -1 },
  select,
) {
  const { page: p, limit } = page(req);
  const [items, total] = await Promise.all([
    Model.find(filter)
      .sort(sort)
      .skip((p - 1) * limit)
      .limit(limit)
      .select(select || "")
      .lean(),
    Model.countDocuments(filter),
  ]);
  res.json({ items, total, page: p, limit });
}
router.get(
  "/jobs",
  asyncRoute(async (req, res) => {
    const filter = {};
    if (req.query.mode)
      filter.mode = z.enum(["FIXTURE", "LIVE"]).parse(req.query.mode);
    if (req.query.state)
      filter.state = z
        .enum([
          "QUEUED",
          "RUNNING",
          "SUCCEEDED",
          "FAILED",
          "BLOCKED",
          "CANCELLED",
          "INTERRUPTED",
        ])
        .parse(req.query.state);
    if (req.query.trigger)
      filter.trigger = z.enum(["MANUAL", "SCHEDULED"]).parse(req.query.trigger);
    await paged(
      CollectionJob,
      filter,
      req,
      res,
      { createdAt: -1 },
      "-leaseToken",
    );
  }),
);
router.get(
  "/jobs/:id",
  asyncRoute(async (req, res) => {
    const job = await CollectionJob.findById(req.params.id)
      .select("-leaseToken")
      .lean();
    if (!job) fail("Job not found", 404);
    const run = job.runId
      ? await models.IngestionRun.findById(job.runId).lean()
      : null;
    res.json({ job, run });
  }),
);
router.post(
  "/jobs/:id/cancel",
  asyncRoute(async (req, res) => {
    const job = await cancelJob(req.params.id);
    if (!job) fail("Job is already finished or missing", 409);
    await audit(req.admin._id, "JOB_CANCEL_REQUESTED", req.params.id);
    res.json({ ok: true });
  }),
);
router.get(
  "/schedules",
  asyncRoute(async (_req, res) =>
    res.json({
      items: await CollectionSchedule.find().sort({ createdAt: -1 }).lean(),
    }),
  ),
);
router.post(
  "/schedules/validate",
  asyncRoute(async (req, res) => {
    try {
      res.json(scheduleDefinition(req.body));
    } catch (error) {
      if (error.name === "ZodError") throw error;
      fail(error.safe ? error.message : "Invalid cron expression or timezone");
    }
  }),
);
router.post(
  "/jobs",
  asyncRoute(async (req, res) => {
    const value = z
      .object({ sourceId: identifier, mode: z.enum(["FIXTURE", "LIVE"]),maxRecords:z.number().int().min(1).max(10000).optional() })
      .strict()
      .parse(req.body);
    const job = await enqueue({ ...value, actor: req.admin._id });
    await audit(req.admin._id, "COLLECTION_ENQUEUED", job._id, value);
    res.status(202).json(job);
  }),
);
router.get('/jobs/:id/summary',asyncRoute(async(req,res)=>{const job=await CollectionJob.findById(req.params.id).select('-leaseToken -activeKey').lean();if(!job)fail('Execution not found',404);const run=job.runId?await models.IngestionRun.findById(job.runId).lean():null;const source=await models.Source.findById(job.sourceId).select('id title url authorizationStatus approval.approvalExpiry').lean();const events=await recentEvents({runId:job._id,afterSequence:0,limit:100});const versions=run?await models.SourceVersion.find({'original.collectionProvenance.runId':run.id}).select('id entityId entityType contentHash').limit(3).lean():[];res.set('Content-Disposition','attachment; filename=collection-'+job._id.replace(/[^a-z0-9-]/gi,'')+'.json').json(sanitizeEvent({exportedAt:new Date().toISOString(),job,source,run,sourceVersions:versions,events,interpretation:'Persisted execution summary; not a new live fetch. Staged records are not automatically approved or published.'}));}));
router.get(
  "/runs",
  asyncRoute(async (req, res) =>
    paged(models.IngestionRun, {}, req, res, { startedAt: -1 }),
  ),
);
router.post(
  "/schedules",
  asyncRoute(async (req, res) => {
    const item = await saveSchedule(req.body, req.admin._id);
    await audit(req.admin._id, "SCHEDULE_SAVED", item._id);
    res.status(201).json(item);
  }),
);
router.put(
  "/schedules/:id",
  asyncRoute(async (req, res) => {
    if (!(await CollectionSchedule.exists({ _id: req.params.id })))
      fail("Schedule not found", 404);
    const item = await saveSchedule(req.body, req.admin._id, req.params.id);
    await audit(req.admin._id, "SCHEDULE_SAVED", item._id);
    res.json(item);
  }),
);
router.post(
  "/schedules/:id/activation",
  asyncRoute(async (req, res) => {
    const { enabled } = z
      .object({ enabled: z.boolean() })
      .strict()
      .parse(req.body);
    const old = await CollectionSchedule.findById(req.params.id).lean();
    if (!old) fail("Schedule not found", 404);
    const { name, kind, cron, time, weekday, timezone, sourceIds, mode } = old;
    const item = await saveSchedule(
      { name, kind, cron, time, weekday, timezone, sourceIds, mode, enabled },
      req.admin._id,
      old._id,
    );
    await audit(
      req.admin._id,
      enabled ? "SCHEDULE_ENABLED" : "SCHEDULE_DISABLED",
      old._id,
    );
    res.json(item);
  }),
);
const explorerTypes = ["Scheme", "FormTemplate", "Notice", "ScamAlert"];
router.get(
  "/data/:type",
  asyncRoute(async (req, res) => {
    const type = z.enum(explorerTypes).parse(req.params.type);
    const filter = {};
    if (req.query.q) {
      const q = z
        .string()
        .max(120)
        .parse(req.query.q)
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { id: { $regex: q, $options: "i" } },
      ];
    }
    if (req.query.status)
      filter.status = z
        .enum([
          "RESEARCH_ONLY",
          "REVIEW_REQUIRED",
          "REJECTED",
          "SOURCE_VERIFIED_FACT",
          "SUPERSEDED",
        ])
        .parse(req.query.status);
    await paged(models[type], filter, req, res);
  }),
);
router.get(
  "/data/:type/:id",
  asyncRoute(async (req, res) => {
    const type = z
      .enum([...explorerTypes, "SchemeFact", "EligibilityRuleSet"])
      .parse(req.params.type);
    const record = await models[type].findById(req.params.id).lean();
    if (!record) fail("Record not found", 404);
    const versions = await models.SourceVersion.find({
      entityType: type,
      entityId: req.params.id,
    })
      .sort({ revision: -1 })
      .lean();
    const derived =
      type === "Scheme"
        ? {
            approvals: await ContentApproval.find({
              schemeId: record.id,
            }).lean(),
            artifacts: await AIArtifact.find({ schemeId: record.id })
              .sort({ createdAt: -1 })
              .lean(),
            jobs: await AIJob.find({ schemeId: record.id })
              .sort({ createdAt: -1 })
              .lean(),
          }
        : null;
    res.json({ record, versions, derived });
  }),
);
router.get(
  "/changes",
  asyncRoute(async (req, res) =>
    paged(
      models.ChangeEvent,
      req.query.status
        ? {
            reviewStatus: z
              .enum(["PENDING", "APPROVED", "REJECTED"])
              .parse(req.query.status),
          }
        : {},
      req,
      res,
    ),
  ),
);
router.get(
  "/changes/:id",
  asyncRoute(async (req, res) => {
    const change = await models.ChangeEvent.findById(req.params.id).lean();
    if (!change) fail("Change not found", 404);
    const [oldVersion, newVersion] = await Promise.all([
      models.SourceVersion.findById(change.oldVersionId).lean(),
      models.SourceVersion.findById(change.newVersionId).lean(),
    ]);
    const derivedImpact =
      change.entityType === "Scheme"
        ? {
            artifacts: await AIArtifact.find({ schemeId: change.entityId })
              .select("language state stale sourceVersionId provider model")
              .lean(),
            regenerationJobs: await AIJob.find({ schemeId: change.entityId })
              .select("language state sourceVersionId errorCode")
              .lean(),
          }
        : null;
    res.json({ change, oldVersion, newVersion, derivedImpact });
  }),
);
router.get(
  "/reviews",
  asyncRoute(async (req, res) =>
    paged(
      models.ReviewItem,
      {
        queueStatus: z
          .enum(["PENDING", "RESOLVED"])
          .parse(req.query.status || "PENDING"),
      },
      req,
      res,
    ),
  ),
);
router.post(
  "/reviews/:id",
  asyncRoute(async (req, res) => {
    const value = z
      .object({
        status: z.enum(["REVIEW_REQUIRED", "REJECTED"]),
        evidence: z.string().trim().max(4000).default(''),
        notes: z.string().max(4000).optional(),
      })
      .strict()
      .parse(req.body);
    const item = await models.ReviewItem.findById(req.params.id).lean();
    if (!item || item.queueStatus !== "PENDING")
      fail("Pending review item required", 409);
    if (
      ![...explorerTypes, "SchemeFact", "EligibilityRuleSet"].includes(
        item.entityType,
      )
    )
      fail("This record requires CLI review", 409);
    const store = new MongoStore();
    await store.transaction(async (session) => {
      const current = await store.get(item.entityType, item.entityId, session);
      if (
        !current ||
        (current.currentVersionId &&
          current.currentVersionId !== item.versionId) ||
        (current.sourceVersionId && current.sourceVersionId !== item.versionId)
      )
        fail(
          "Review the current version; this queue item refers to older evidence",
          409,
        );
      value.evidence=attachedEvidence({entityType:item.entityType,entityId:item.entityId,versionId:item.versionId,sourceUrl:current.sourceUrl},value.evidence);
      const decision = {
        ...value,
        reviewer: req.admin.username,
        versionId: item.versionId,
      };
      // A second further-review request is a note, never a promotion or an approval.
      if (
        current.status === "REVIEW_REQUIRED" &&
        value.status === "REVIEW_REQUIRED"
      ) {
        await store.put(
          "ReviewEvent",
          {
            id: `review-note-${randomUUID()}`,
            original: decision,
            entityType: item.entityType,
            entityId: item.entityId,
            previousStatus: current.status,
            nextStatus: current.status,
            reviewer: req.admin.username,
            evidence: value.evidence,
            versionId: item.versionId,
          },
          session,
        );
      } else
        await review(
          scopedStore(store, session),
          item.entityType,
          item.entityId,
          decision,
        );
      if (value.status === "REVIEW_REQUIRED")
        await models.ReviewItem.updateOne(
          { _id: item.id },
          { $set: { queueStatus: "PENDING" } },
          { session },
        );
      if (item.versionId)
        await models.ChangeEvent.updateMany(
          {
            entityId: item.entityId,
            entityType: item.entityType,
            newVersionId: item.versionId,
          },
          {
            $set: {
              reviewStatus:
                value.status === "REJECTED" ? "REJECTED" : "PENDING",
            },
          },
          { session },
        );
      await audit(
        req.admin._id,
        "REVIEW_DECISION",
        item.entityId,
        { ...value, itemId: item.id },
        session,
      );
    });
    res.json({ ok: true });
  }),
);
router.get(
  "/system",
  asyncRoute(async (_req, res) => {
    const hello = await mongoose.connection.db.admin().command({ hello: 1 });
    res.json({
      database: mongoose.connection.name,
      connected: true,
      transactions: Boolean(hello.setName || hello.msg === "isdbgrid"),
      liveEnabled: env.ENABLE_LIVE_COLLECTION === "true",
      workers: await WorkerHeartbeat.find({
        lastSeen: { $gt: new Date(Date.now() - 120000) },
      }).lean(),
      adminAccounts: adminConfigured() ? 1 : 0,
      sourcePolicy: "Deny by default; myScheme excluded",
      phase: "3.5",
    });
  }),
);
router.get(
  "/events",
  asyncRoute(async (req, res) => {
    const value = z.object({
      after: z.string().max(40).optional(),
      runId:z.string().max(180).optional(),afterSequence:z.coerce.number().int().min(0).optional(),
      limit: z.coerce.number().int().min(1).max(100).default(50),
    }).strict().parse(req.query);
    res.json({ items: await recentEvents(value) });
  }),
);
router.get(
  "/audit",
  asyncRoute(async (req, res) => paged(AdminAudit, {}, req, res)),
);
router.use((err, _req, res, _next) => {
  const status =
    err.name === "ZodError"
      ? 400
      : err.code === 11000
        ? 409
        : err.status || 500;
  res
    .status(status)
    .json({
      error: {
        code:
          status === 401
            ? "UNAUTHORIZED"
            : status === 409
              ? "CONFLICT"
              : status === 400
                ? "INVALID_INPUT"
                : "ADMIN_REQUEST_FAILED",
        message: err.safe
          ? err.message
          : err.name === "ZodError"
            ? "Input validation failed. Check required fields and bounds."
            : "Request failed safely. Check configuration and current record state.",
      },
    });
});
export default router;
