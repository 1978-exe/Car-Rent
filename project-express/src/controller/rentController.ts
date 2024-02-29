import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createRent = async (req: Request, res: Response) => {
  try {
    const car_id = req.body.car_id;
    const nama_penyewa = req.body.merk_mobil;
    const lama_sewa = req.body.lama_sewa;

    const car = await prisma.car.findUnique({
      where: {
        id: car_id,
      },
    });

    const total_harga = Number(car?.harga_perhari) * lama_sewa;

    const hasil = await prisma.rent.create({
      data: {
        car_id,
        nama_penyewa,
        lama_sewa,
        total_bayar: total_harga,
      },
    });

    return res.status(200).json({
      status: true,
      message: `Rent has been created`,
      hasil,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error,
    });
  }
};

export const showRent = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;
    const keyword = req.query.keyword?.toString() || "";

    const hasil = await prisma.rent.findMany({
      skip,
      take: pageSize,
      where: {
        OR: [
          {
            nama_penyewa: {
              contains: keyword,
            },
          },
        ],
      },
    });

    if (hasil.length === 0) {
      return res.status(500).json({
        status: true,
        hasil,
        pageInfo: {
          currentPage: page,
          pageSize,
        },
      });
    } else {
      return res.status(200).json({
        status: true,
        hasil,
        pageInfo: {
          currentPage: page,
          pageSize,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error,
    });
  }
};

export const updateRent = async (req: Request, res: Response) => {
  try {
    const { car_id, nama_penyewa, lama_sewa } = req.body;
    const rentID = Number(req.params.rentID);

    const findRent = await prisma.rent.findFirst({
      where: {
        id: rentID,
      },
    });

    if (!findRent) {
      return res.status(400).json({
        status: false,
        message: `Not Found`,
      });
    }

    const car = await prisma.car.findUnique({
      where: {
        id: car_id,
      },
    });

    if (!car) {
      return res.status(404).json({
        status: false,
        message: "Car not found",
      });
    }

    const total_bayar = Number(car.harga_perhari) * Number(lama_sewa);

    const hasil = await prisma.rent.update({
      where: {
        id: rentID,
      },
      data: {
        car_id: car_id || findRent.car_id,
        nama_penyewa: nama_penyewa || findRent.nama_penyewa,
        lama_sewa: lama_sewa || findRent.lama_sewa,
        total_bayar: total_bayar || findRent.total_bayar,
      },
    });

    return res.status(200).json({
      status: true,
      message: "Updated",
      hasil,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error || "Internal Server Error",
    });
  }
};

export const deleteRent = async (req: Request, res: Response) => {
  try {
    const rentID = req.params.rentID;

    const findRent = await prisma.rent.findFirst({
      where: {
        id: Number(rentID),
      },
    });

    if (!findRent) {
      return res.status(400).json({
        status: false,
        message: `Not Found`,
      });
    } else {
      await prisma.rent.delete({
        where: {
          id: Number(rentID),
        },
      });
    }

    return res.status(200).json({
      status: true,
      message: "Deleted",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error,
    });
  }
};
