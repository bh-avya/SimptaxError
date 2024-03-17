import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, "uploads/");
    },
    filename : (req, file, cb)=>{
        const extname = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${extname}`);
    }
})

const filter = (req,res, cb) =>{
    const fileType = /jpe?g|png|webp/;
    const mimeTypes = /image\/jpe?g|image\/png|image\/webp/;
  
    const extname = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;

    if (fileType.test(extname) && mimeTypes.test(mimeType)) {
        cb(null, true);
    } 
    else {
        cb(new Error("Upload images only"), false);
    }
}

const upload = multer({storage, filter});
const uploadSingle = upload.single('image');

router.post("/", (req,res)=>{
    uploadSingle(req,res, (err)=>{
        if(err){
            res.status(400).send({message : err.message});
        }
        else if(req.file){
            res.status(200).send({
                message : "Image Uploaded ", 
                image : `/${req.file.path}`
            })
        }
        else{
            res.status(400).send({message : "No image provided"});
        }
    })
})

export default router;