-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "finalThoughts" TEXT NOT NULL,
    "keywords" TEXT,
    "category" TEXT NOT NULL DEFAULT 'Uncategorized',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "isHero" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Post" ("content", "createdAt", "description", "finalThoughts", "id", "imageUrl", "isHero", "keywords", "published", "score", "title", "updatedAt") SELECT "content", "createdAt", "description", "finalThoughts", "id", "imageUrl", "isHero", "keywords", "published", "score", "title", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
