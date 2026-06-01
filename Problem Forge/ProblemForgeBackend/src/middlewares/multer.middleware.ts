import multer from "multer"
import path from "path"
import apiError from "../utils/apiError"

const storage = multer.diskStorage({
    destination: (
        _req,
        _file,
        cb
    ) => {
        cb(null, "public/temp")
    },

    filename: (
        _req,
        file,
        cb
    ) => {
        cb(
            null,
            `${Date.now()}-${file.originalname}`
        )
    }
})

const fileFilter = (
    _req: any,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {

    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ]

    if(
        !allowedTypes.includes(
            file.mimetype
        )
    ){
        return cb(
            new apiError(
                400,
                "Only JPG, PNG and WEBP images are allowed"
            ) as any
        )
    }

    cb(null,true)
}

const upload = multer({
    storage,
    fileFilter,
    limits:{
        fileSize:
            20 * 1024 * 1024
    }
})

export default upload