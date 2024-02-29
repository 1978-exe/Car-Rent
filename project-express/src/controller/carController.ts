import { PrismaClient } from "@prisma/client";
import { Request,Response } from "express";

const prisma = new PrismaClient()

export const createCar = async (req:Request,res:Response) => {
    try {
        const nopol = req.body.nopol
        const merk_mobil = req.body.merk_mobil
        const harga_perhari = req.body.harga_perhari

        if (!nopol||!merk_mobil||!harga_perhari) {
            return res.status(500).json({
                status: false,
                message: "Fill the blank field"
            });
        } else {
            const hasil = await prisma.car.create({
                data: {
                    nopol,merk_mobil,harga_perhari
                }
            })
        
        return res.status(200).json({
            status: true,
            message: `Created`,
            hasil
        });
    }
    } catch (error) {
        return res.status(500).json({
            status:false,
            message:error
        })
    }
}

export const showCar = async (req:Request,res:Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1; // Default ke 1 jika tidak ada
        const pageSize = parseInt(req.query.pageSize as string) || 10; // Default ke 10 jika tidak ada
        const skip = (page - 1) * pageSize;
        const keyword = req.query.keyword?.toString() || "";

        const hasil = await prisma.car.findMany({
            skip,
            take: pageSize,
            where: {
                OR: [
                    {
                        nopol: {
                            contains: keyword
                        },
                        merk_mobil: {
                            contains: keyword
                        },
                    }
                ]
            },
            include: {
                Rent: true
            },
            orderBy: {
                id: "asc"
            }
        });

        if (hasil.length == 0) {
            return res.status(500).json({
                status: false,
                message: "Not Found"
            });
        } else {
            return res.status(200).json({
                status: true,
                hasil,
                pageInfo: {
                    currentPage: page,
                    pageSize
                }
            });
        }
    } catch (error) {
        return res.status(500).json({
            status:false,
            message:error
        })
    }
}

export const updateCar = async (req:Request,res:Response) => {
    try {
        const {nopol,merk_mobil,harga_perhari} = req.body
        const carID = Number(req.params.carID)
        const findCar = await prisma.car.findFirst({
            where:{
                id:carID
            }
        })

        if (!findCar) {
            return res.status(400).json({
                status:false,
                message:'Not Found'
            })
        } else {
            const hasil = await prisma.car.update({
                where:{
                    id:carID
                },
                data:{
                    nopol:nopol || findCar.nopol,
                    merk_mobil:merk_mobil||findCar.merk_mobil,
                    harga_perhari:harga_perhari||findCar.harga_perhari
                }
            })
            return res.status(200).json({
                status:true,
                message:"Updated",
                hasil
            })
        }
    } catch (error) {
        return res.status(500).json({
            status:false,
            message:error
        })
    }
}

export const deleteCar = async (req:Request,res:Response) => {
    try {
        const carID = req.params.carID

        const findCar = await prisma.car.findFirst({
            where: {id:Number(carID)}
        })

        if (!findCar) {
            return res.status(400).json({
                status:false,
                message:"not found"
            })
        } else {
            await prisma.admin.delete({
                where:{
                    id:Number(carID)
                }
            })
            return res.status(200).json({
                status:true,
                message: `${carID} dihapus`
            })
        }
    } catch (error) {
        return res.status(500).json({
            status:false,
            message:error
        })
    }
}