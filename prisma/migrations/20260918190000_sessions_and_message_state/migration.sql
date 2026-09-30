ALTER TABLE "User" ADD COLUMN "timeZone" TEXT;
ALTER TABLE "User" ADD COLUMN "birthTimeKnown" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN "securityVersion" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "ChatMessage" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'complete';
ALTER TABLE "ChatMessage" ADD COLUMN "requestId" TEXT;
ALTER TABLE "ChatMessage" ADD COLUMN "errorCode" TEXT;

CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "securityVersion" INTEGER NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" DATETIME NOT NULL,
    "revokedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "RateLimit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");
CREATE INDEX "RateLimit_period_idx" ON "RateLimit"("period");
CREATE UNIQUE INDEX "RateLimit_key_action_period_key" ON "RateLimit"("key", "action", "period");
CREATE UNIQUE INDEX "ChatMessage_userId_requestId_role_key" ON "ChatMessage"("userId", "requestId", "role");
