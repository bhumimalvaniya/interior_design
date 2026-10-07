import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";

// Routers
import adminRouter from "./Router/AdminRouter.js";
import userRouter from "./Router/UserRouter.js";
import projectRouter from "./Router/ProjectRouter.js";
import gallaryRouter from "./Router/GalleryRouter.js";
import categoryRouter from "./Router/CategoryRouter.js";
import eventRouter from "./Router/EventRouter.js";
import contactRouter from "./Router/ContactRouter.js";
import serviceRouter from "./Router/ServiseRouter.js";
import consultationRouter from "./Router/ConsultationRouter.js";
import headerMenuRouter from "./Router/HeaderMenuRouter.js";
import aboutRouter from "./Router/AboutRouter.js";

const app = express();

/* =========================================================
   CORS
========================================================= */

const allowedOrigins = [
  "http://localhost:5173",
  "https://rutavinteriordesign.netlify.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without an Origin header
    // such as Postman/server-to-server requests.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("CORS blocked origin:", origin);

    return callback(
      new Error(`CORS blocked for origin: ${origin}`)
    );
  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  credentials: false,

  optionsSuccessStatus: 204,
};

/*
  Handle browser preflight requests.
*/
app.options("*", cors(corsOptions));

app.use(cors(corsOptions));

/* =========================================================
   BODY PARSERS
========================================================= */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* =========================================================
   STATIC UPLOADS
========================================================= */

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "public/uploads")
  )
);

/* =========================================================
   ROOT
========================================================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend API is running successfully 🚀",
  });
});

/* =========================================================
   API ROUTES
========================================================= */

app.use(
  "/api/v1/admin",
  adminRouter
);

app.use(
  "/api/v1/cust",
  userRouter
);

app.use(
  "/api/v1/project",
  projectRouter
);

app.use(
  "/api/v1/gallary",
  gallaryRouter
);

app.use(
  "/api/v1/category",
  categoryRouter
);

app.use(
  "/api/v1/event",
  eventRouter
);

app.use(
  "/api/v1/contact",
  contactRouter
);

app.use(
  "/api/v1/services",
  serviceRouter
);

app.use(
  "/api/v1/consultation",
  consultationRouter
);

app.use(
  "/api/v1/header-menu",
  headerMenuRouter
);

app.use(
  "/api/v1/about",
  aboutRouter
);

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message:
      err.message || "Internal server error",
  });
});

/* =========================================================
   DATABASE + SERVER
========================================================= */

const PORT = process.env.PORT || 9000;
const MONGOURL = process.env.MONGOURL;

if (!MONGOURL) {
  console.error(
    "MONGOURL is missing from environment variables."
  );

  process.exit(1);
}

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log(
      "Database connected successfully"
    );

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "Database connection error:",
      error
    );

    process.exit(1);
  });