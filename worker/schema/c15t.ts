import { relations } from "drizzle-orm"
import { blob, foreignKey, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const subject = sqliteTable("subject", {
  id: text("id", { length: 255 }).primaryKey().notNull(),
  externalId: text("externalId"),
  identityProvider: text("identityProvider"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().defaultNow(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().defaultNow(),
  tenantId: text("tenantId"),
})

export const subjectRelations = relations(subject, ({ many }) => ({
  consents: many(consent, {
    relationName: "consent_subject",
  }),
  auditLogs: many(auditLog, {
    relationName: "auditLog_subject",
  }),
}))

export const domain = sqliteTable("domain", {
  id: text("id", { length: 255 }).primaryKey().notNull(),
  name: text("name").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().defaultNow(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().defaultNow(),
  tenantId: text("tenantId"),
})

export const domainRelations = relations(domain, ({ many }) => ({
  consents: many(consent, {
    relationName: "consent_domain",
  }),
}))

export const consentPolicy = sqliteTable("consentPolicy", {
  id: text("id", { length: 255 }).primaryKey().notNull(),
  version: text("version").notNull(),
  type: text("type").notNull(),
  hash: text("hash"),
  effectiveDate: integer("effectiveDate", { mode: "timestamp" }).notNull(),
  isActive: integer("isActive", { mode: "boolean" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().defaultNow(),
  tenantId: text("tenantId"),
})

export const consentPolicyRelations = relations(consentPolicy, ({ many }) => ({
  consents: many(consent, {
    relationName: "consent_consentPolicy",
  }),
}))

export const runtimePolicyDecision = sqliteTable("runtimePolicyDecision", {
  id: text("id", { length: 255 }).primaryKey().notNull(),
  tenantId: text("tenantId"),
  policyId: text("policyId").notNull(),
  fingerprint: text("fingerprint").notNull(),
  matchedBy: text("matchedBy").notNull(),
  countryCode: text("countryCode"),
  regionCode: text("regionCode"),
  jurisdiction: text("jurisdiction").notNull(),
  language: text("language"),
  model: text("model").notNull(),
  policyI18n: blob("policyI18n", { mode: "json" }),
  uiMode: text("uiMode"),
  bannerUi: blob("bannerUi", { mode: "json" }),
  dialogUi: blob("dialogUi", { mode: "json" }),
  categories: blob("categories", { mode: "json" }),
  preselectedCategories: blob("preselectedCategories", { mode: "json" }),
  proofConfig: blob("proofConfig", { mode: "json" }),
  dedupeKey: text("dedupeKey").unique().notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().defaultNow(),
})

export const runtimePolicyDecisionRelations = relations(runtimePolicyDecision, ({ many }) => ({
  consents: many(consent, {
    relationName: "consent_runtimePolicyDecision",
  }),
}))

export const consentPurpose = sqliteTable("consentPurpose", {
  id: text("id", { length: 255 }).primaryKey().notNull(),
  code: text("code").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().defaultNow(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().defaultNow(),
  tenantId: text("tenantId"),
})

export const consent = sqliteTable(
  "consent",
  {
    id: text("id", { length: 255 }).primaryKey().notNull(),
    subjectId: text("subjectId").notNull(),
    domainId: text("domainId").notNull(),
    policyId: text("policyId"),
    purposeIds: blob("purposeIds", { mode: "json" }).notNull(),
    metadata: blob("metadata", { mode: "json" }),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    givenAt: integer("givenAt", { mode: "timestamp" }).notNull().defaultNow(),
    validUntil: integer("validUntil", { mode: "timestamp" }),
    jurisdiction: text("jurisdiction"),
    jurisdictionModel: text("jurisdictionModel"),
    tcString: text("tcString"),
    uiSource: text("uiSource"),
    consentAction: text("consentAction"),
    runtimePolicyDecisionId: text("runtimePolicyDecisionId"),
    runtimePolicySource: text("runtimePolicySource"),
    tenantId: text("tenantId"),
  },
  (table) => [
    foreignKey({
      columns: [table.subjectId],
      foreignColumns: [subject.id],
      name: "consent_subject_subject_fk",
    })
      .onUpdate("restrict")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.domainId],
      foreignColumns: [domain.id],
      name: "consent_domain_domain_fk",
    })
      .onUpdate("restrict")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.policyId],
      foreignColumns: [consentPolicy.id],
      name: "consent_consentPolicy_policy_fk",
    })
      .onUpdate("restrict")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.runtimePolicyDecisionId],
      foreignColumns: [runtimePolicyDecision.id],
      name: "consent_runtimePolicyDecision_runtimePolicyDecision_fk",
    })
      .onUpdate("restrict")
      .onDelete("restrict"),
  ],
)

export const consentRelations = relations(consent, ({ one }) => ({
  subject: one(subject, {
    relationName: "consent_subject",
    fields: [consent.subjectId],
    references: [subject.id],
  }),
  domain: one(domain, {
    relationName: "consent_domain",
    fields: [consent.domainId],
    references: [domain.id],
  }),
  policy: one(consentPolicy, {
    relationName: "consent_consentPolicy",
    fields: [consent.policyId],
    references: [consentPolicy.id],
  }),
  runtimePolicyDecision: one(runtimePolicyDecision, {
    relationName: "consent_runtimePolicyDecision",
    fields: [consent.runtimePolicyDecisionId],
    references: [runtimePolicyDecision.id],
  }),
}))

export const auditLog = sqliteTable(
  "auditLog",
  {
    id: text("id", { length: 255 }).primaryKey().notNull(),
    entityType: text("entityType").notNull(),
    entityId: text("entityId").notNull(),
    actionType: text("actionType").notNull(),
    subjectId: text("subjectId"),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    changes: blob("changes", { mode: "json" }),
    metadata: blob("metadata", { mode: "json" }),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull().defaultNow(),
    tenantId: text("tenantId"),
  },
  (table) => [
    foreignKey({
      columns: [table.subjectId],
      foreignColumns: [subject.id],
      name: "auditLog_subject_subject_fk",
    })
      .onUpdate("restrict")
      .onDelete("restrict"),
  ],
)

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  subject: one(subject, {
    relationName: "auditLog_subject",
    fields: [auditLog.subjectId],
    references: [subject.id],
  }),
}))

export const private_c15t_settings = sqliteTable("private_c15t_settings", {
  id: text("id", { length: 255 }).primaryKey().notNull(),
  version: text("version", { length: 255 }).notNull().default("2.0.0"),
})
