import { Router } from "express";
import endpoints from "../utils/endpoints";
import testController from "../controllers/testController";
import protectRoute from "../middleware/authMiddleware";
import examinerController from "../controllers/examinerController";
import {
  getAdmin,
  getAvailableTimeSlots,
  addAppointment,
  successAppointment,
} from "../controllers/adminController";
import checkUserTypeMiddleware from "../middleware/driverMiddleware";

const routes = Router();
const {
  G2TEST,
  GTEST,
  UPDATE_CAR_DETAILS,
  EXAMINER,
  DRIVER_NAVIGATION,
  ADMIN,
  AVAILABLE_TIME_SLOTS,
  BOOK_APPOINTMENT,
  SUCCESS_APPOINTMENT,
  FIND_APPOINTMENT_SLOTS,
  APPOINTMENT_SLOT,
  BOOK_APPOINTMENT_SLOT,
} = endpoints;
const {
  getG2Test,
  postG2Test,
  getGTest,
  updateCardDetails,
  getUserDriverNavigation,
  findAppointmentSlot,
  getAppointmentSlot,
  bookAppointment,
} = testController;
const { getExaminer } = examinerController;

routes.get(G2TEST, protectRoute, checkUserTypeMiddleware, getG2Test);
routes.post(G2TEST, protectRoute, checkUserTypeMiddleware, postG2Test);
routes.get(GTEST, protectRoute, checkUserTypeMiddleware, getGTest);
routes.post(
  UPDATE_CAR_DETAILS,
  protectRoute,
  checkUserTypeMiddleware,
  updateCardDetails
);
routes.get(EXAMINER, protectRoute, checkUserTypeMiddleware, getExaminer);
routes.get(
  DRIVER_NAVIGATION,
  protectRoute,
  checkUserTypeMiddleware,
  getUserDriverNavigation
);
routes.get(ADMIN, protectRoute, checkUserTypeMiddleware, getAdmin);
routes.post(AVAILABLE_TIME_SLOTS, protectRoute, getAvailableTimeSlots);
routes.post(BOOK_APPOINTMENT, protectRoute, addAppointment);
routes.get(SUCCESS_APPOINTMENT, protectRoute, successAppointment);
routes.get(APPOINTMENT_SLOT, protectRoute, getAppointmentSlot);
routes.post(FIND_APPOINTMENT_SLOTS, protectRoute, findAppointmentSlot);
routes.post(BOOK_APPOINTMENT_SLOT, protectRoute, bookAppointment);
export default routes;
