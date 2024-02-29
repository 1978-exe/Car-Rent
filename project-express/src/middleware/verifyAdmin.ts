import { error } from "console";
import { NextFunction,Request,Response } from "express";
import { verify } from "jsonwebtoken";

const verifyAdmin = async(req:Request,res:Response,next:NextFunction) => {
    try {
        const header = req.headers.authorization
        const token = header?.split(" ")[1]||''
        const secretKey = 'ambatron'

        verify(token,secretKey,error => {
            if (verify(token,secretKey)) {
                next()
            }
        })
    } catch (error) {
        return res
        .status(401)
        .json({
            status: false,
            message: error
        }
    )}
}

export {verifyAdmin}