import { Request, Response } from "express";
import { getUserData } from "./testController";
import { IUserRequest } from "../middleware/authMiddleware";
const getHome = (req: Request, res: Response) => {
  res.render("index", {
    statusCode: 200,
    success: true,
    data: {},
  });
};
export default getHome;
