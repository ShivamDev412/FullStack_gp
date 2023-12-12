import express from "express";
import cors from "cors";
import path from "path";
import session from 'express-session';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import homeRoute from "./routes/route";
import authRoute from "./routes/authRoute";
import testRoute from "./routes/protectedRoute";
import connectDB from "./database/index";
const app = express();

require("dotenv").config();

const PORT = process.env.PORT;

connectDB();

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(session({
  secret:'flashblog',
  saveUninitialized: true,
  resave: true
}));

app.use(flash());
app.use(function(req, res, next){
  res.locals.message = req.flash();
  next();
});
// Template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

// Routes
app.use("", homeRoute);
app.use("", authRoute);
app.use("", testRoute);

// Server
app.listen(PORT, () => {
  console.log("Server listening on port " + PORT + "!");
});
