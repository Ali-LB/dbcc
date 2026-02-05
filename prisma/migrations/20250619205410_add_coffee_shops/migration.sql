-- CreateTable
CREATE TABLE "CoffeeShop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "imageUrl" TEXT,
    "website" TEXT,
    "phoneNumber" TEXT,
    "hours" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

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
    "updatedAt" DATETIME NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "address" TEXT,
    "coffeeShopId" TEXT,
    CONSTRAINT "Post_coffeeShopId_fkey" FOREIGN KEY ("coffeeShopId") REFERENCES "CoffeeShop" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("address", "category", "content", "createdAt", "description", "finalThoughts", "id", "imageUrl", "isHero", "keywords", "latitude", "longitude", "published", "score", "title", "updatedAt") SELECT "address", "category", "content", "createdAt", "description", "finalThoughts", "id", "imageUrl", "isHero", "keywords", "latitude", "longitude", "published", "score", "title", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
