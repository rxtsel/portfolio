CREATE TABLE `auditLog` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`entityType` text NOT NULL,
	`entityId` text NOT NULL,
	`actionType` text NOT NULL,
	`subjectId` text,
	`ipAddress` text,
	`userAgent` text,
	`changes` blob,
	`metadata` blob,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`tenantId` text,
	FOREIGN KEY (`subjectId`) REFERENCES `subject`(`id`) ON UPDATE restrict ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `consent` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`subjectId` text NOT NULL,
	`domainId` text NOT NULL,
	`policyId` text,
	`purposeIds` blob NOT NULL,
	`metadata` blob,
	`ipAddress` text,
	`userAgent` text,
	`givenAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`validUntil` integer,
	`jurisdiction` text,
	`jurisdictionModel` text,
	`tcString` text,
	`uiSource` text,
	`consentAction` text,
	`runtimePolicyDecisionId` text,
	`runtimePolicySource` text,
	`tenantId` text,
	FOREIGN KEY (`subjectId`) REFERENCES `subject`(`id`) ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY (`domainId`) REFERENCES `domain`(`id`) ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY (`policyId`) REFERENCES `consentPolicy`(`id`) ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY (`runtimePolicyDecisionId`) REFERENCES `runtimePolicyDecision`(`id`) ON UPDATE restrict ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `consentPolicy` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`version` text NOT NULL,
	`type` text NOT NULL,
	`hash` text,
	`effectiveDate` integer NOT NULL,
	`isActive` integer NOT NULL,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`tenantId` text
);
--> statement-breakpoint
CREATE TABLE `consentPurpose` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`tenantId` text
);
--> statement-breakpoint
CREATE TABLE `domain` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`tenantId` text
);
--> statement-breakpoint
CREATE TABLE `private_c15t_settings` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`version` text(255) DEFAULT '2.0.0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `runtimePolicyDecision` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`tenantId` text,
	`policyId` text NOT NULL,
	`fingerprint` text NOT NULL,
	`matchedBy` text NOT NULL,
	`countryCode` text,
	`regionCode` text,
	`jurisdiction` text NOT NULL,
	`language` text,
	`model` text NOT NULL,
	`policyI18n` blob,
	`uiMode` text,
	`bannerUi` blob,
	`dialogUi` blob,
	`categories` blob,
	`preselectedCategories` blob,
	`proofConfig` blob,
	`dedupeKey` text NOT NULL,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `runtimePolicyDecision_dedupeKey_unique` ON `runtimePolicyDecision` (`dedupeKey`);--> statement-breakpoint
CREATE TABLE `subject` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`externalId` text,
	`identityProvider` text,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`tenantId` text
);
