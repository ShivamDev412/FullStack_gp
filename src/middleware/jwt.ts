import { sign, verify } from "jsonwebtoken";

const secretKey = "dfdfhieiesodnfjieni399j93jf93f93j9fj3f";

export const generateToken = (payload: { userId: string }) => {
  return sign(payload, secretKey, { expiresIn: "1w" });
};

export const verifyToken = async (token: string) => {
  if (!token) {
    throw new Error("Access denied, login or signup to book a test!");
  }

  try {
    const decoded = await verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
