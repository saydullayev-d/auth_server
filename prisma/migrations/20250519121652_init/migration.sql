-- CreateTable
CREATE TABLE "Organization" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "org_name" TEXT,
    "inn" TEXT,
    "uniq_key" TEXT,
    "date" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_uniq_key_key" ON "Organization"("uniq_key");
