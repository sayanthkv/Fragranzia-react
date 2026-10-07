// -----App.jsx-------

// import { useState } from "react";
// import axios from "axios";

// function App() {
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [image, setImage] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("price", price);
//     formData.append("image", image);

//     await axios.post("http://localhost:5000/api/products/create", formData);

//     alert("Product Uploaded");
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Upload Product</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
//         <br /><br />
//         <input type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
//         <br /><br />
//         <input type="file" onChange={(e) => setImage(e.target.files[0])} />
//         <br /><br />
//         <button type="submit">Upload</button>
//       </form>
//     </div>
//   );
// }

// export default App;


// ------server js -----

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const productRoutes = require("./routes/productRoutes");

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use("/uploads", express.static("uploads"));

// mongoose.connect("mongodb://127.0.0.1:27017/mernUpload")
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));

// app.use("/api/products", productRoutes);

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });



// -----router-----

// const express = require("express");
// const router = express.Router();
// const upload = require("../middleware/upload");
// const { createProduct } = require("../controllers/productController");

// router.post("/create", upload.single("image"), createProduct);

// module.exports = router;


// --------upload js in middleware folder-------

// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// module.exports = multer({ storage })


// -----controller-----

// const Product = require("../models/Product");

// exports.createProduct = async (req, res) => {
//   try {
//     const { name, price } = req.body;

//     const product = new Product({
//       name,
//       price,
//       image: req.file.filename
//     });

//     await product.save();

//     res.status(201).json({ success: true, product });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// }


// ----------model-------

// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   image: { type: String, required: true }
// }, { timestamps: true });

// module.exports = mongoose.model("Product", productSchema);