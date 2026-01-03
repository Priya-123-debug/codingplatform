const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cookieparser = require("cookie-parser");
const authRouter = require("./routes/userauth");
const problemrouter = require("./routes/problemcreate");
const submitrouter = require("./routes/submit");
const cors = require("cors");
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
const allowedOrigins = [
  "http://localhost:5173",
  "https://coderhoister-kvmr.vercel.app",
  "https://coderhoister-kvmr-iey5ajiut-supriya-kumaris-projects.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS policy violation"), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieparser());
app.use("/user", authRouter);
app.use("/problem", problemrouter);
app.use("/submission", submitrouter);
const main = require("./utilis/db");

/// cookie come in json format
const port = process.env.PORT || 5000;
main()
  .then(() => {
    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
