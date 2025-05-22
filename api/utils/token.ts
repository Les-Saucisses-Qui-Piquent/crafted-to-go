import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

type TokenPayload = Prisma.userGetPayload<{
  select: {
    id: true;
    email: true;
    role: true;
  };
}>;

export const useToken = () => {
  const generateToken = (payload: TokenPayload) => {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    // Here extends the base token with the authUser object
    return jwt.sign({ authUser: payload }, process.env.JWT_SECRET, { expiresIn: "24h" });
  };

  const verifyToken = (token: string) => {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    return jwt.verify(token, process.env.JWT_SECRET);
  };

  return {
    generateToken,
    verifyToken,
  };
};
