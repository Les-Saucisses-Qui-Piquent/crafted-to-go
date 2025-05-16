import { preHandlerHookHandler } from "fastify";
import { useToken } from "../../utils/token";

export const authMiddleware: preHandlerHookHandler = async (request, reply) => {
  try {
    const token = request.headers.authorization;
    if (!token) {
      return reply.status(401).send({ message: "Unauthorized", error: "No token provided" });
    }

    const { verifyToken } = useToken();
    const decodedToken = verifyToken(token);
    request.authUser = decodedToken;
  } catch (error) {
    return reply.status(401).send({ message: "Unauthorized", error: "Invalid token" });
  }
};
