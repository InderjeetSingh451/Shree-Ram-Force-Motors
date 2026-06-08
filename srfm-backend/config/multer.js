import multer from "multer";

// Temporary storage
const storage = multer.diskStorage({});

// limit the file size
const imgMaxSize = 5 * 1024 * 1024;
// Create multer instance
const upload = multer({
  storage,
  limits: {
    fileSize: imgMaxSize,
  },
});

export default upload;
