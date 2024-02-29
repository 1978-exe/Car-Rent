-- CreateTable
CREATE TABLE "Car" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nopol" TEXT NOT NULL,
    "merk_mobil" TEXT NOT NULL DEFAULT '',
    "harga_perhari" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Rent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "car_id" INTEGER NOT NULL DEFAULT 0,
    "nama_penyewa" TEXT NOT NULL DEFAULT '',
    "tgl" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lama_sewa" INTEGER NOT NULL,
    "total_bayar" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    CONSTRAINT "Rent_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama_admin" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Car_nopol_key" ON "Car"("nopol");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
