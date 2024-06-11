-- CreateTable
CREATE TABLE "Items" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "item_name" TEXT NOT NULL,
    "item_description" TEXT,
    "item_pic" TEXT,
    "item_status" TEXT NOT NULL,
    "item_type" TEXT,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "reported_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Items_user_id_idx" ON "Items"("user_id");

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
