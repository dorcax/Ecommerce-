import { Injectable } from '@nestjs/common';
import { cloudinaryResponse } from './clooudinary-response';
import{v2 as cloudinary} from "cloudinary"
import * as streamifier from "streamifier"
import { Express } from 'express';



export class CloudinaryService {
uploadFile(file:Express.Multer.File):Promise<cloudinaryResponse>{
    return new Promise<cloudinaryResponse>((resolve,reject)=>{
        const upload  =cloudinary.uploader.upload_stream((error,result)=>{
            if(error){
                return reject(error) 
            }
            return resolve(result)
        })
        streamifier.createReadStream(file.buffer).pipe(upload)
    })
}
}
