const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cookieparser = require("cookie-parser");
const authRouter = require("./routes/userauth");
const problemrouter = require("./routes/problemcreate");
const submitrouter = require("./routes/submit");
const cors = require("cors");
app.use(
  cors({
    origin: "https://codingplatformservice-2lb7-hiubn40tr-supriya-kumaris-projects.vercel.app",
    credentials: true,
  })
);
// const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");


// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // allow requests with no origin (like curl or Postman)
//       if (!origin) return callback(null, true);

//       // check if the origin is allowed
//       if (!allowedOrigins.includes(origin)) {
//         return callback(new Error("CORS policy violation"), false);
//       }

//       return callback(null, true);
//     },
//     credentials: true,
//   })
// );


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
