import cookie from "cookie";
import { Request, Response } from "express";
import endpoints from "../utils/endpoints";
import User from "../database/schema/userSchema";
import { generateToken } from "../middleware/jwt";

const getLogin = (req: Request, res: Response) => {
  return res.render("login", {
    statusCode: 200,
    success: true,
    data: {},
    message: "",
  });
};
const postLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.render("login", {
        statusCode: 500,
        success: false,
        data: { username },
        errors: { username: "No user with that username exists" },
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (isPasswordValid) {
      const token = generateToken({ userId: user._id });

      // Set the JWT token in a cookie
      const cookieOptions = {
        httpOnly: false,
        maxAge: 3600000 * 24 * 7, // Set the cookie expiration time (7 days in milliseconds)
      };
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token, cookieOptions)
      );
      // Redirect based on user userType
      if (user.userType === "Driver") {
        if (
          user.appointmentId === "" &&
          user.licenseNumber !== "" &&
          user.isG2TestPassed === null
        ) {
          res.redirect("/appointmentSlot");
        } else if (
          user.isG2TestPassed &&
          user.isGTestPassed === null &&
          user.testType === "G"
        ) {
          res.redirect("/gTest");
        } else if (user.isG2TestPassed === null && user.licenseNumber === "") {
          res.redirect("/g2Test");
        } else if (
          user.isG2TestPassed !== null &&
          user.licenseNumber !== "" &&
          user.isGTestPassed === null
        ) {
          res.redirect("/g2Status");
        } else if (user.isG2TestPassed && user.isGTestPassed) {
          res.redirect("/gStatus");
        } else if (user.isG2TestPassed && user.isGTestPassed === false) {
          res.redirect("/gStatus");
        }
        res.redirect("/driverNavigation");
      } else if (user.userType === "Examiner") {
        res.redirect("/examiner");
      } else if (user.userType === "Admin") {
        res.redirect("/appointment");
      }
    } else {
      // Handle invalid password
      return res.render("login", {
        statusCode: 401, // Use 401 status for unauthorized
        success: false,
        data: {},
        errors: { password: "Invalid password" },
      });
    }
  } catch (error) {
    console.error(error);
    // Handle other errors
    return res.status(500).render("login", {
      statusCode: 500,
      success: false,
      data: {},
      errors: { message: "An error occurred" },
    });
  }
};

const getSignup = (req: Request, res: Response) => {
  return res.render("signup", {
    statusCode: 200,
    data: {},
    success: true,
    message: "",
  });
};
const postSignup = async (req: Request, res: Response) => {
  const { username, password, confirmPassword, userType } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render("signup", {
        data: {
          username,
          password,
        },
        errors: {
          statusCode: 500,
          success: false,
          username: "Username already exists",
        },
      });
    }

    if (password !== confirmPassword) {
      return res.render("signup", {
        data: {
          username,
          password,
          confirmPassword,
        },
        errors: {
          statusCode: 500,
          success: false,
          confirmPassword: "Password confirmation does not match the password",
        },
      });
    }
    const newUser = new User({
      username,
      password,
      userType,
    });
    if (newUser) {
      await newUser.save();
      res.redirect("/login");
    }
  } catch (error: any) {
    console.log(error);
    if (error.name === "ValidationError") {
      const validationErrors: any = {};
      for (const key in error.errors) {
        validationErrors[key] = error.errors[key].message;
      }
      return res.render("signup", {
        statusCode: 500,
        success: false,
        data: { username, password, confirmPassword },
        errors: validationErrors,
      });
    }
    res.status(500).send({ message: error.message });
  }
};

const getLogout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.redirect(endpoints.LOGIN);
};

export default {
  getLogin,
  getSignup,
  postLogin,
  postSignup,
  getLogout,
};
