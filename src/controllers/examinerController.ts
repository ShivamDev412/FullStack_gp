import { Request, Response } from "express";
import User from "../database/schema/userSchema";
import { getUserData } from "./testController";
import { IUserRequest } from "../middleware/authMiddleware";
import Appointment from "../database/schema/appointmentSchema";

const getExaminer = async (req: Request, res: Response) => {
  try {
    const usersWithAppointments = await User.find({
      appointmentId: { $ne: "" },
    });
    const userData = await Promise.all(
      usersWithAppointments.map(async (user) => {
        // Retrieve appointment details for each user
        const appointment = await Appointment.findOne({
          _id: user.appointmentId,
        });
        return {
          _id: user._id,
          carDetails: user.carDetails,
          name: `${user.firstName} ${user.lastName}`,
          testType: user.testType,
          appointmentDate: appointment?.date,
          appointmentTime: appointment?.time,
        };
      })
    );
    const user = await getUserData(req as IUserRequest);
    if (user) {
      return res.render("examiner", {
        statusCode: 500,
        success: false,
        data: {
          username: user.username,
          usersWithAppointments: userData,
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
const postExaminer = async (req: Request, res: Response) => {
  try {
    const { testType } = req.body;
    const filter = testType
      ? { appointmentId: { $ne: "" }, testType }
      : { appointmentId: { $ne: "" } };
    const usersWithAppointments = await User.find(filter);
    const userData:any = await Promise.all(
      usersWithAppointments.map(async (user) => {
        const appointment = await Appointment.findOne({
          _id: user.appointmentId,
        });
        return {
          _id: user._id,
          carDetails: user.carDetails,
          name: `${user.firstName} ${user.lastName}`,
          testType: user.testType,
          appointmentDate: appointment?.date,
          appointmentTime: appointment?.time,
        };
      })
    );
    const user = await getUserData(req as IUserRequest);

    if (user) {
      return res.render("examiner", {
        statusCode: 200,
        success: true,
        data: {
          username: user.username,
          usersWithAppointments: userData,
          testType
        },
        errors: null,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};

const updateTestResults = async (req: Request, res: Response) => {
  try {
    const { userId, testType } = req.query;
    const { comments, passFail } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    let isG2TestPassed = user.isG2TestPassed;
    let isGTestPassed = user.isGTestPassed;
    if (testType === "G2") {
      isG2TestPassed = passFail === "pass";
    } else if (testType === "G") {
      isGTestPassed = passFail === "pass";
    }
    await User.findByIdAndUpdate(
      userId,
      {
        $push: { comments: { text: comments, passFail } },
        $set: {
          appointmentId: "",
          isG2TestPassed: isG2TestPassed,
          isGTestPassed: isGTestPassed,
        },
      },
      { new: true }
    );

    res.redirect("/examiner");
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export default {
  postExaminer,
  getExaminer,
  updateTestResults,
};
