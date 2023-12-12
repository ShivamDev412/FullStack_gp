import { Response, Request } from "express";
import User from "../database/schema/userSchema";
import { IUserRequest } from "../middleware/authMiddleware";
import Appointment from "../database/schema/appointmentSchema";
export const getUserData = async (req: IUserRequest) => {
  const user = await User.findById(req.user.userId);
  return user;
};
const getUserDriverNavigation = async (req: Request, res: Response) => {
  try {
    const user = await getUserData(req as IUserRequest);
    if (user) {
      res.render("driverNavigation", {
        success: true,
        data: {
          username: user.username,
        },
        message: "",
        statusCode: 200,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
const getG2Test = async (req: Request, res: Response) => {
  try {
    const user = await getUserData(req as IUserRequest);
    console.log(user);
    if (user && user.appointmentId) {
      // Assuming there is a relationship between User and Appointment models
      const appointment = await Appointment.findById(user.appointmentId);
    
      if (appointment) {
        const data: any = {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          licenseNumber: user.licenseNumber,
          age: user.age,
          carDetails: {
            make: user.carDetails.make,
            model: user.carDetails.model,
            year: user.carDetails.year,
            plateNumber: user.carDetails.plateNumber,
          },
          message: "G2 Page Fetched Successfully",
          statusCode: 200,
        };

        // Include appointmentDate and appointmentTime
        data.appointmentDate = appointment.date;
        data.appointmentTime = appointment.time;

        res.render("g2Test", {
          success: true,
          data,
        });
      } else {
        res.status(404).send({ message: "Appointment not found." });
      }
    } else {
      // User doesn't have an appointment
      const data: any = {
        username: user?.username,
        firstName: user?.firstName,
        lastName: user?.lastName,
        licenseNumber: user?.licenseNumber,
        age: user?.age,
        carDetails: {
          make: user?.carDetails.make,
          model: user?.carDetails.model,
          year: user?.carDetails.year,
          plateNumber: user?.carDetails.plateNumber,
        },
        message: "G2 Page Fetched Successfully",
        statusCode: 200,
      };

      res.render("g2Test", {
        success: true,
        data,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const postG2Test = async (req: Request, res: Response) => {
  const user = await getUserData(req as IUserRequest);
  const {
    firstName,
    lastName,
    licenseNumber,
    age,
    make,
    model,
    year,
    plateNumber,
  } = req.body;
  const dataToSend = {
    firstName,
    lastName,
    licenseNumber,
    age: +age,
    carDetails: {
      make,
      model,
      year: +year,
      plateNumber,
    },
  };

  // Validation: Check if required fields are empty
  const userWithExistingLicenseNumber = await User.find({ licenseNumber });

  const validationErrors: any = {};
  if (!firstName) {
    validationErrors.firstName = "First name is required";
  }
  if (!lastName) {
    validationErrors.lastName = "Last name is required";
  }
  if (!licenseNumber) {
    validationErrors.licenseNumber = "License number is required";
  } else if (userWithExistingLicenseNumber.length) {
    validationErrors.licenseNumber = "License number already exists";
  }
  if (age === "") {
    validationErrors.age = "Age is required";
  } else if (age < 18) {
    validationErrors.age = "Age must be greater than 18";
  } else if (age > 50) {
    validationErrors.age = "Age must be less than 50";
  }
  if (!make) {
    validationErrors.make = "Car make is required";
  }
  if (!model) {
    validationErrors.model = "Car model is required";
  }
  if (!year) {
    validationErrors.year = "Car year is required";
  }
  if (!plateNumber) {
    validationErrors.plateNumber = "Car plate number is required";
  }
  if (Object.keys(validationErrors).length > 0) {
    return res.render("g2Test", {
      statusCode: 400,
      data: {
        ...dataToSend,
        username: user?.username,
      },
      success: false,
      errors: validationErrors,
    });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      user?._id,
      {
        $set: dataToSend,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Updated user data
    // const updatedUserData = {
    //   username: updatedUser.username,
    //   userType: updatedUser.userType,
    //   ...dataToSend,
    // };
    return res.redirect("/appointmentSlot");
    // return res.render("appointmentSlot", {
    //   statusCode: 200,
    //   success: true,
    //   data: { username: user?.username },
    //   message: "User data updated successfully",
    // });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const getGTest = async (req: Request, res: Response) => {
  try {
    const user = await getUserData(req as IUserRequest);
    if (user) {
      res.render("gTest", {
        statusCode: 200,
        success: true,
        message: "Page Fetched Successfully",
        data: {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          licenseNumber: user.licenseNumber,
          age: user.age,
          carDetails: {
            make: user.carDetails.make,
            model: user.carDetails.model,
            year: user.carDetails.year,
            plateNumber: user.carDetails.plateNumber,
          },
        },
      });
    } else {
      res.status(404).send({ message: "Something went wrong" });
    }
  } catch (error) {
    res.status(500).send({ message: "Something went wrong" });
  }
};
const updateCardDetails = async (req: Request, res: Response) => {
  const user = await getUserData(req as IUserRequest);

  const { make, model, year, plateNumber } = req.body;
  if (user) {
    const dataToSend = {
      firstName: user?.firstName,
      lastName: user?.lastName,
      licenseNumber: user?.licenseNumber,
      age: user?.age,
      carDetails: {
        make,
        model,
        year,
        plateNumber,
      },
    };
    const validationErrors: any = {};
    if (!make) {
      validationErrors.make = "Car make is required";
    }
    if (!model) {
      validationErrors.model = "Car model is required";
    }
    if (!year) {
      validationErrors.year = "Car year is required";
    }
    if (!plateNumber) {
      validationErrors.plateNumber = "Car plate number is required";
    }
    if (Object.keys(validationErrors).length > 0) {
      return res.render("gTest", {
        statusCode: 400,
        data: {
          ...dataToSend,
          username: user?.username,
        },
        success: false,
        errors: validationErrors,
      });
    }
  } else {
    res.status(404).send({ message: "User not found" });
  }
  try {
    const updatedUser = await User.findOneAndUpdate(
      user?._id,
      {
        $set: {
          "carDetails.make": make,
          "carDetails.model": model,
          "carDetails.year": year,
          "carDetails.plateNumber": plateNumber,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.render("gTest", {
      statusCode: 201,
      success: true,
      data: updatedUser,
      message: "User data updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};
const getAppointmentSlot = async (req: Request, res: Response) => {
  const user = await getUserData(req as IUserRequest);
  if (user) {
    res.render("appointmentSlot", {
      success: true,
      data: {
        username: user?.username,
      },
      message: "Appointment Slot Page Fetched Successfully",
      statusCode: 200,
    });
  } else {
    res.status(404).send({ message: "Something went wrong" });
  }
};
const findAppointmentSlot = async (req: Request, res: Response) => {
  const user = await getUserData(req as IUserRequest);
  const { appointmentDate } = req.body;
  console.log(appointmentDate);
  try {
    const appointmentsSlots = await Appointment.find({ date: appointmentDate });
    if (appointmentsSlots.length) {
      res.render("appointmentSlot", {
        statusCode: 200,
        success: true,
        message: "",
        data: {
          date: appointmentDate,
          username: user?.username,
          appointmentsSlots,
        },
      });
    } else {
      res.render("appointmentSlot", {
        statusCode: 500,
        success: false,
        message: "No slots found for that date",
        data: {
          date: appointmentDate,
          username: user?.username,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};
const bookAppointment = async (req: Request, res: Response) => {
  try {
    const { appointmentTimeSlot } = req.body;
    const { date } = req.query;
    const user = await getUserData(req as IUserRequest);
    const appointment = await Appointment.findOne({
      date,
      time: appointmentTimeSlot,
    });
    if (!appointment || !appointment.isTimeSlotAvailable) {
      return res.status(400).json({ error: "Invalid appointment time slot." });
    }
    appointment.isTimeSlotAvailable = false;
    await appointment.save();
    if (user) {
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { appointmentId: appointment._id },
        { new: true }
      );

      if (updatedUser) {
        res.redirect("/g2Test");
        // The user was found and updated
        // Proceed with any additional logic if needed
      } else {
        // The user was not found
        return res.status(500).json({ error: "User not found." });
      }
    } else {
      // User not found
      return res.status(500).json({ error: "User not found." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while booking the appointment." });
  }
};

export default {
  getG2Test,
  getGTest,
  postG2Test,
  updateCardDetails,
  getUserDriverNavigation,
  findAppointmentSlot,
  getAppointmentSlot,
  bookAppointment,
};
