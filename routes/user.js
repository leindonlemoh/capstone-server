const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, callback) => {
    const fileName =
      Date.now() + "_" + file.fieldname + path.extname(file.originalname);

    callback(null, fileName);
  },
});

const upload = multer({
  storage: storage,
});

const imageUpload = upload.fields([{ name: "product_image" }]);

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/addproducts", imageUpload, userController.addproducts);
router.get("/productlist", userController.fetch);

module.exports = router;
