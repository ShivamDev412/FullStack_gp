import { Request, Response, NextFunction } from "express";
import { getUserData } from "../controllers/testController";
import { IUserRequest } from "./authMiddleware";

const checkUserTypeMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await getUserData(req as IUserRequest);
  if (user) {
    if (
      (user.userType === "Driver" && req.path.startsWith("/driver")) ||
      req.path.startsWith("/gTest") ||
      req.path.startsWith("/g2Test") ||
      req.path.startsWith("/g2Status")
    )
      next();
    else if (
      (user.userType === "Examiner" && req.path.startsWith("/examiner")) ||
      req.path.startsWith("/updateTestResult")
    )
      next();
    else if (user.userType === "Admin" && req.path.startsWith("/appointment"))
      next();
    else {
      res.status(401).send("<h1>Access Denial</h1>");
    }
  } else res.status(403).send("User data not found");
};

export default checkUserTypeMiddleware;
