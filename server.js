const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* =========================
   ADMIN LOGIN
   ========================= */

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH ||
  bcrypt.hashSync("LumeaAdmin#2026", 10);

const JWT_SECRET =
  process.env.JWT_SECRET || "change-this-secret-before-hosting";

app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required."
      });
    }

    if (username !== ADMIN_USERNAME) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials."
      });
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      ADMIN_PASSWORD_HASH
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials."
      });
    }

    const token = jwt.sign(
      {
        username: ADMIN_USERNAME,
        role: "admin"
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      success: true,
      token
    });

  } catch (error) {
    console.error("Admin login error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error."
    });
  }
});


/* =========================
   ADMIN AUTH MIDDLEWARE
   ========================= */

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Admin authentication required."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only."
      });
    }

    req.admin = decoded;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token."
    });
  }
}


/* =========================
   PRODUCT ROUTES
   ========================= */

const productRoutes = require("./routes/productRoutes");

app.use("/api/products", productRoutes);


/* =========================
   ORDER ROUTES
   ========================= */

const orderRoutes = require("./routes/orderRoutes");

app.use("/api/orders", orderRoutes);


/* =========================
   HOME ROUTE
   ========================= */

app.get("/", (req, res) => {
  res.json({
    message: "LUMÉA Backend + MongoDB is running! 💄✨"
  });
});


/* =========================
   MONGODB CONNECTION
   ========================= */

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    console.log("MongoDB connected successfully! ✅");

    app.listen(PORT, () => {
      console.log(
        `LUMÉA Backend running at http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });