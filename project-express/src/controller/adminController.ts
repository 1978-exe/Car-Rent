import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { Request,Response } from "express";
import { date, number } from "joi";
import md5 from "md5";
import dotenv from 'dotenv'

const prisma = new PrismaClient()

const createAdmin = async (req: Request,res: Response) => {
    try {
        const nama_admin = req.body.nama_admin
        const email = req.body.email
        const password = md5(req.body.password)

        const newData = await prisma.admin.create({
            data : {
                nama_admin,
                email,
                password
            }
        })

        return res
        .status(200)
        .json({
            status: true,
            message: `user has been created`,
            newData
        })
    } catch (error) {
        return res
        .status(500)
        .json({
            status: false,
            message: error
        })
    }
}

const showAdmin = async (req:Request,res:Response) => {
    try {
        const dataAdmin = await prisma.admin.findMany()

        return res
        .status(200)
        .json({
            status: true,
            message: `user has been created`,
            dataAdmin
        })
    } catch (error) {
        return res
        .status(500)
        .json({
            status: false,
            message: error
        })
    }
}

const updateAdmin = async (req:Request,res:Response) => {
    try {
        const id = req.body.id
        const nama_admin = req.body.namaAdmin
        const email = req.body.email
        const password = md5(req.body.password)

        const findAdmin = await prisma.admin.findFirst({
            where: {id:Number(id)}
        })

        if (!findAdmin) {
            return res.status(400)
            .json({
                status:false,
                message: `Not Found`
            })
        }

        const dataAdmin = await prisma.admin.update({
            where: {id:Number(id)},
            data: {
                nama_admin:nama_admin||findAdmin.nama_admin,
                email:email||findAdmin.email,
                password:password||findAdmin.password
            }
        })

        return res.status(200)
        .json({
            status:true,
            message: `user sudah diupdate`,
            dataAdmin
        })
    } catch (error) {
        return res
        .status(500)
        .json({
            status: false,
            message: error,
            
        })
    }
}

const deleteAdmin = async (req:Request,res:Response) => {
    try {
        const id = req.params.id
        const findAdmin = await prisma.admin.findFirst({
            where: {id: Number(id)}
        })

        if (!findAdmin) {
            return res.status(400)
            .json({
                status:false,
                message:`Not found`
            })
        }

        const dataAdmin = await prisma.admin.delete({
            where: {id: Number(id)}
        })

        return res.status(200)
        .json({
            status:true,
            message:`Data User telah dihapus`
        }
    )} catch(error) {
        return res
        .status(500)
        .json({
            status: false,
            message: error,
        }
    )}
}

const loginAdmin = async (req:Request,res:Response) => {
    try {
        const email = req.body.email
        const password = md5(req.body.password)
        const admin = await prisma.admin.findFirst({
            where:{email:email,password:password}
        })

        if (admin) {
            const payLoad = admin
            const secretKey = 'ambatron'
            const token = sign(payLoad,secretKey)
            return res.status(200).json({
                status : true,
                message : "login masuk",
                token : token
            })
        }
        else{
            return res.status(500).json({
                status:false,
                message:"gagal"
        })
    }
    } catch (error) {
        return res
        .status(500)
        .json({
            status: false,
            message: error,
        }
    )}
}

export {createAdmin,showAdmin,updateAdmin,deleteAdmin,loginAdmin}