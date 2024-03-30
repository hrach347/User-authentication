import express from "express";
import { changeForgotenPass, forgotPass, login, register, verifyEmail } from "../controllers/userController.js";

const Router = express.Router()

Router.post("/register",register)
Router.post("/login",login)
Router.get("/verifyEmail",verifyEmail)
Router.post("/forgotPass",forgotPass)
Router.get("/changePass",changeForgotenPass)
// Router.get("/mail",verifyMail)


export default Router