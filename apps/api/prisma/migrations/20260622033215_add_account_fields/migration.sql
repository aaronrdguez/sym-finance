/*
  Warnings:

  - You are about to drop the column `type` on the `Operation` table. All the data in the column will be lost.
  - Added the required column `coin` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coin` to the `Operation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coin` to the `Reserve` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "coin" TEXT NOT NULL,
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Operation" DROP COLUMN "type",
ADD COLUMN     "coin" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reserve" ADD COLUMN     "coin" TEXT NOT NULL;
