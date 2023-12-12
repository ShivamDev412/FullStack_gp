import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  isTimeSlotAvailable: {
    type: Boolean,
    default: true,
  },
});
const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
