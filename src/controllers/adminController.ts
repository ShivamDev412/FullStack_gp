import { Request, Response } from "express";
import { getUserData } from "./testController";
import { IUserRequest } from "../middleware/authMiddleware";
import { generateTimeSlots } from "../utils/constant";
import Appointment from "../database/schema/appointmentSchema";
export const getAvailableTimeSlots = async (req: Request, res: Response) => {
  try {
    const { date } = req.body;
    const availableTimeSlots = await fetchAvailableTimeSlotsFromDB(date);
    const user = await getUserData(req as IUserRequest);
    if (user) {
      return res.render("appointment", {
        statusCode: 200,
        success: true,
        data: {
          username: user.username,
          availableTimeSlots,
          date,
        },
        message: "",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
const fetchAvailableTimeSlotsFromDB = async (date: string) => {
  try {
    const allTimeSlots = generateTimeSlots();
    const bookedAppointments = await Appointment.find({ date });
    const bookedTimeSlots = bookedAppointments.map(
      (appointment) => appointment.time
    );
    const availableTimeSlots = allTimeSlots.filter(
      (time) => !bookedTimeSlots.includes(time)
    );

    return availableTimeSlots;
  } catch (error) {
    console.error("Error fetching available time slots:", error);
    throw error;
  }
};
const checkAppointmentExists = async (date: Date, time: string) => {
  return await Appointment.findOne({ date, time });
};

const createAppointment = async (date: Date, time: string) => {
  return await Appointment.create({ date, time });
};
export const getAdmin = async (req: Request, res: Response) => {
  try {
    const user = await getUserData(req as IUserRequest);
    if (user) {
      return res.render("appointment", {
        statusCode: 200,
        success: true,
        data: {
          username: user.username,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
export const addAppointment = async (req: Request, res: Response) => {
  const { date, time } = req.body;
  const existingAppointment = await checkAppointmentExists(date, time);

  if (existingAppointment) {
    res
      .status(400)
      .json({ success: false, message: "Appointment slot already exists" });
  } else {
    try {
      await createAppointment(date, time);
      res
        .status(200)
        .json({ success: true, message: "Appointment slot created" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to create appointment" });
    }
  }
};
export const successAppointment = async (request: Request, res: Response) => {
  try {
    const user = await getUserData(request as IUserRequest);
    if (user) {
      return res.render("successAppointment", {
        statusCode: 200,
        success: true,
        data: {
          username: user.username,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
