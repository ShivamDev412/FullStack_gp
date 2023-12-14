import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

interface UserType extends Document {
  username: string;
  password: string;
  confirmPassword: string;
  userType: "Driver" | "Examiner" | "Admin";
  firstName: string;
  lastName: string;
  age: number;
  licenseNumber: string;
  appointmentId: string;
  testType:string,
  isG2TestPassed:boolean | null;
  isGTestPassed:boolean | null;
  comments: Array<any>
  carDetails: {
    make: string;
    model: string;
    year: number;
    plateNumber: string;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const User = new mongoose.Schema<UserType>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: [5, "Minimum 5 characters required"],
    maxLength: [20, "Maximum 20 characters allowed"],
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: [8, "Minimum 8 characters required"],
    maxLength: [20, "Maximum 20 characters allowed"],
  },
  confirmPassword: String,
  userType: {
    type: String,
    required: true,
    enum: ["Driver", "Examiner", "Admin"],
  },
  firstName: {
    type: String,
    default: "",
  },
  testType: {
    type: String,
    default: "G2",
  },
  isG2TestPassed: {
    type: Boolean,
    default: null,
  },
  isGTestPassed: {
    type: Boolean,
    default: null,
  },
  lastName: {
    type: String,
    default: "",
  },
  licenseNumber: {
    type: String,
    default: "",
  },
  age: {
    type: Number,
    default: 0,
  },
  appointmentId: {
    type: String,
    default: "",
  },
  comments: [],
  carDetails: {
    make: {
      type: String,
      default: "",
    },
    model: {
      type: String,
      default: "",
    },
    year: {
      type: Number,
      default: 2000,
    },
    plateNumber: {
      type: String,
      default: "",
    },
  },
});

User.methods.comparePassword = async function (candidatePassword: string) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

// Hashing password before saving it to the database
User.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    return next();
  } catch (error: any) {
    return next(error);
  }
});

// Custom validation function to check confirmPassword
const validateConfirmPassword = function (this: UserType, value: string) {
  return value === this.password;
};

User.path("confirmPassword").validate(
  validateConfirmPassword,
  "Password confirmation does not match the password."
);

export default mongoose.model("User", User);
