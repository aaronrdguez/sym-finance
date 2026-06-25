/*
  Warnings:

  - You are about to drop the column `coin` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `coin` on the `Operation` table. All the data in the column will be lost.
  - You are about to drop the column `coin` on the `Reserve` table. All the data in the column will be lost.
  - You are about to drop the column `coin` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `currency` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Operation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Reserve` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "coin",
ADD COLUMN     "currency" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Operation" DROP COLUMN "coin",
ADD COLUMN     "currency" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reserve" DROP COLUMN "coin",
ADD COLUMN     "currency" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "coin",
ADD COLUMN     "currency" TEXT NOT NULL;
