import jwt from "jsonwebtoken";

export const useToken = () => {
  const generate = (userId: string) => {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "24h" });
  };

  const verify = (token: string) => {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    return jwt.verify(token, process.env.JWT_SECRET);
  };

  return {
    generate,
    verify,
  };
};
