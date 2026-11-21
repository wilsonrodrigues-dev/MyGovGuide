import eligibility from "./routes/eligibility.js";
import scams from './routes/scams.js';
import noticeAssistant from "./routes/noticeAssistant.js";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import { models } from "./models/index.js";
import cors from "cors";
import citizenRoutes from "./routes/citizen.js";
import adminRoutes from "./routes/admin.js";
import contentPublic from "./routes/contentPublic.js";
import forms from "./routes/forms.js";
import { allowedOrigins } from "./middleware/citizenSecurity.js";

export const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      callback(null, !origin || allowedOrigins.has(origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Notice-Token"],
  }),
);
app.use(express.json({ limit: "32kb" }));
app.use((req,res,next)=>{if(mongoose.connection.readOnly&&!['GET','HEAD','OPTIONS'].includes(req.method)&&!req.path.startsWith("/api/admin/auth/"))return res.status(409).json({error:{code:"READ_ONLY_DATABASE",message:"Rollback database is read-only. Switch to the demo database to make changes."}});next();});
app.use("/api/admin", adminRoutes);
app.use("/api/content", contentPublic);
app.use("/api/forms", forms);
app.use("/api/notices", noticeAssistant);
app.use("/api/eligibility", eligibility);
app.use('/api/scams',scams);
app.get("/api/health", (_req, res) =>
  res.json({
    status: "ok",
    phase: 2,
    readOnly:Boolean(mongoose.connection.readOnly),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "unavailable",
    databaseName:
      mongoose.connection.readyState === 1 ? mongoose.connection.name : null,
  }),
);
app.get("/api/data/status", async (_req, res) => {
  if (mongoose.connection.readyState !== 1)
    return res
      .status(503)
      .json({
        error: {
          code: "DATABASE_UNAVAILABLE",
          message: "Database is unavailable",
        },
      });
  const counts = Object.fromEntries(
    await Promise.all(
      [
        "Source",
        "Scheme",
        "FormTemplate",
        "Notice",
        "ScamAlert",
        "SourceVersion",
        "ChangeEvent",
      ].map(async (name) => [name, await models[name].countDocuments()]),
    ),
  );
  const pendingReviews = await models.ReviewItem.countDocuments({
    queueStatus: "PENDING",
  });
  res.json({
    counts,
    pendingReviews,
    publicReleaseEnabled: false,
    eligibilityEngineEnabled: true,
    eligibilityRuleApprovalRequired: true,
  });
});
app.use("/api", citizenRoutes);
app.use((_req, res) =>
  res
    .status(404)
    .json({ error: { code: "NOT_FOUND", message: "Route not found" } }),
);
app.use((error, _req, res, _next) => {
  const badInput = error instanceof SyntaxError && "body" in error;
  res
    .status(badInput ? 400 : 500)
    .json({
      error: {
        code: badInput ? "INVALID_JSON" : "INTERNAL_ERROR",
        message: badInput
          ? "Invalid JSON request"
          : "Request could not be completed",
      },
    });
});
