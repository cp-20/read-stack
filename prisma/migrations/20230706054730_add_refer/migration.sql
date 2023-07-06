-- AlterTable
ALTER TABLE "article" ADD COLUMN     "articleId" INTEGER,
ADD COLUMN     "ogImageUrl" TEXT;

-- CreateTable
CREATE TABLE "articleRef" (
    "referFromId" INTEGER NOT NULL,
    "referToId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articleRef_pkey" PRIMARY KEY ("referFromId","referToId")
);

-- AddForeignKey
ALTER TABLE "articleRef" ADD CONSTRAINT "articleRef_referFromId_fkey" FOREIGN KEY ("referFromId") REFERENCES "article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articleRef" ADD CONSTRAINT "articleRef_referToId_fkey" FOREIGN KEY ("referToId") REFERENCES "article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
