/*
  Warnings:

  - You are about to drop the `Reviewer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `reviewerId` on the `PostReview` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `PostReview` table. All the data in the column will be lost.
  - You are about to drop the column `thoughts` on the `PostReview` table. All the data in the column will be lost.
  - Added the required column `name` to the `PostReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `review` to the `PostReview` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Reviewer";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PostReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "photoUrl" TEXT,
    "review" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PostReview_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PostReview" ("createdAt", "id", "postId", "updatedAt") SELECT "createdAt", "id", "postId", "updatedAt" FROM "PostReview";
DROP TABLE "PostReview";
ALTER TABLE "new_PostReview" RENAME TO "PostReview";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
