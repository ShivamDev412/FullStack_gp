import { Request, Response } from "express";
import { getUserData } from "./testController";
import { IUserRequest } from "../middleware/authMiddleware";

const getExaminer = async (req: Request, res: Response) => {
  try {
    const user = await getUserData(req as IUserRequest);
    if (user) {
      return res.render("examiner", {
        statusCode: 500,
        success: false,
        data: {
          username: user.username,
        },
        errors: {
          username: "No user with that username exists",
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
export default {
  getExaminer,
}