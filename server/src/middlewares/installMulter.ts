import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 5 * 1024 * 1024, //5MB
  },
});

export default upload;
