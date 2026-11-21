import { z } from "zod";
export const statuses = [
  "RESEARCH_ONLY",
  "SOURCE_VERIFIED_FACT",
  "RULES_APPROVED_CURRENT",
  "RULES_VALIDATED_CURRENT",
  "REVIEW_REQUIRED",
  "REJECTED",
  "SUPERSEDED",
];
export const methods = ["api", "rss", "html", "pdf", "offline"];
export const identifier = z
  .string()
  .min(1)
  .max(180)
  .regex(/^[\p{L}\p{N}_.:-]+$/u);
export const webUrl = z
  .string()
  .url()
  .refine((value) => {
    const u = new URL(value);
    return (
      ["https:", "http:"].includes(u.protocol) && !u.username && !u.password
    );
  }, "Expected a public HTTP(S) URL without credentials");
export const rule = z.lazy(() =>
  z.union([
    z
      .object({
        id: identifier,
        logic: z.literal("IF"),
        condition: rule,
        then: rule,
        otherwise: rule,
        clauseRefs: z.array(z.string()).min(1),
      })
      .strict(),
    z
      .object({
        id: identifier,
        logic: z.enum(["AND", "OR", "NOT"]),
        children: z.array(rule).min(1),
        clauseRefs: z.array(z.string()).min(1),
      })
      .strict()
      .refine(
        (v) => v.logic !== "NOT" || v.children.length === 1,
        "NOT requires exactly one child",
      ),
    z
      .object({
        id: identifier,
        field: z.string().min(1),
        dataType: z.enum(["number", "string", "boolean", "date", "array"]),
        operator: z.enum([
          "eq",
          "ne",
          "lt",
          "lte",
          "gt",
          "gte",
          "in",
          "between",
        ]),
        value: z.unknown(),
        inclusiveMin: z.boolean().default(true),
        inclusiveMax: z.boolean().default(true),
        clauseRefs: z.array(z.string()).min(1),
        unit: z.string().optional(),
        currency: z.string().optional(),
      })
      .strict()
      .superRefine((r, ctx) => {
        const typeOk = (value) =>
          r.dataType === "number"
            ? typeof value === "number" && Number.isFinite(value)
            : r.dataType === "date"
              ? typeof value === "string" &&
                /^\d{4}-\d{2}-\d{2}$/.test(value) &&
                !Number.isNaN(new Date(value).valueOf()) &&
                new Date(value).toISOString().startsWith(value)
              : r.dataType === "array"
                ? Array.isArray(value)
                : typeof value === r.dataType;
        const operands = ["between", "in"].includes(r.operator)
          ? r.value
          : [r.value];
        if (
          !Array.isArray(operands) ||
          !operands.length ||
          !operands.every(typeOk) ||
          (r.operator === "between" &&
            (operands.length !== 2 || operands[0] > operands[1])) ||
          (["lt", "lte", "gt", "gte", "between"].includes(r.operator) &&
            !["number", "date"].includes(r.dataType))
        ) {
          ctx.addIssue({
            code: "custom",
            message: "Rule operand types or bounds are invalid",
          });
        }
        if (r.dataType === 'number' && /income|amount|premium/i.test(r.field) && (!r.unit || !r.currency))
          ctx.addIssue({
            code: "custom",
            message: "Money rules require explicit period/unit and currency",
          });
      }),
  ]),
);
export const record = z
  .object({
    id: identifier,
    title: z.string().trim().min(1).max(1000),
    sourceIds: z.array(identifier).min(1),
    sourceUrl: webUrl,
    original: z.record(z.string(), z.unknown()),
    normalized: z.record(z.string(), z.unknown()),
    status: z.enum(statuses).default("RESEARCH_ONLY"),
  })
  .strict();
export const approval = z
  .object({
    sourceId: identifier,
    enabled: z.boolean(),
    host: z.string().min(1),
    entityType: z
      .enum(["Scheme", "Notice", "FormTemplate", "ScamAlert"])
      .optional(),
    approvedPaths: z.array(z.string().startsWith("/")).min(1),
    method: z.enum(["api", "rss", "html", "pdf"]),
    sourceTermsUrl: webUrl,
    rightsBasis: z.string().min(1),
    robotsUrl: webUrl,
    robotsObservedAt: z.iso.datetime(),
    robotsAllowed: z.literal(true),
    rateLimit: z
      .object({
        minIntervalMs: z.number().int().min(1000).max(60000),
        maxRequests: z.number().int().min(1).max(1000),
      })
      .strict(),
    reviewedBy: z.string().min(1),
    approvalEvidence: z.string().min(1),
    approvalExpiry: z.iso.datetime(),
    testPlan: z.string().min(1),
    apiAgreement: z.string().optional(),
    url: webUrl,
    adapterOptions: z.record(z.string(), z.unknown()).default({}),
  })
  .strict()
  .superRefine((a, ctx) => {
    if (a.method === "api" && !a.apiAgreement)
      ctx.addIssue({ code: "custom", message: "API agreement required" });
    if (
      new Date(a.robotsObservedAt) > new Date() ||
      new Date(a.approvalExpiry) <= new Date(a.robotsObservedAt)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid approval evidence dates",
      });
    }
  });
export const sourceInput = z
  .object({
    id: identifier,
    title: z.string().min(1),
    url: webUrl,
    organization: z.string().optional(),
    type: z.string().optional(),
  })
  .passthrough();
// Internal mapped contracts. Original field names are mapped in the research importer.
// Raw fields are retained separately; unseen/missing datasets are not synthesized.
export const researchInput = z
  .object({
    id: identifier,
    title: z.string().min(1),
    sourceIds: z.array(identifier).min(1),
    sourceUrl: webUrl,
  })
  .passthrough();
export const inputFiles = {
  "SOURCE_REGISTRY.json": ["sources"],
  "VERIFIED_SCHEMES.json": ["schemes"],
  "FORMS_REGISTRY.json": ["forms"],
  "NOTICES_AND_ALERTS.json": ["notices", "scamAwareness"],
};
export function validateRoot(file, value) {
  const fields = Object.fromEntries(
    inputFiles[file].map((key) => [key, z.array(z.unknown())]),
  );
  if (file === "FORMS_REGISTRY.json")
    fields.brokenLinkDoNotUse = z.array(z.unknown()).optional();
  return z
    .object({ metadata: z.record(z.string(), z.unknown()), ...fields })
    .passthrough()
    .parse(value);
}
