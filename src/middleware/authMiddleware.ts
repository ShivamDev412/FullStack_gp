import { Request, Response, NextFunction, RequestHandler } from "express";
import { verifyToken } from "./jwt";
export interface IUserRequest extends Request {
  user: any;
}
const protectRoute: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.render("login", {
        statusCode: 500,
        success: false,
        data: {},
        message: "Access Restricted! Please login to book you Test",
      });
    }

    const decoded = await verifyToken(token);
    (req as IUserRequest).user = decoded;
    next();
  } catch (error) {
    return res.render("login", {
      statusCode: 500,
      success: false,
      data: {},
      message: "Invalid token",
    });
  }
};

export default protectRoute;
