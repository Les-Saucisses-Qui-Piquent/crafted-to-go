import jwt from "jsonwebtoken";

export const useToken = () => {
  const generateToken = (userId: string) => {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "24h" });
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
