import { preHandlerHookHandler } from "fastify";
import { useToken } from "../../utils/token";

export const authMiddleware: preHandlerHookHandler = async (request, reply) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return reply.status(401).send({ message: "Unauthorized", error: "No token provided" });
    }

    // Here split's the "Bearer <token>"
    const token = authHeader.split(" ")[1];

    const { verifyToken } = useToken();
    const decodedToken = verifyToken(token);

    // Decorate the request with token infos (userId, token)
    request.authUser = decodedToken;
  } catch (error) {
    return reply.status(401).send({ message: "Unauthorized", error: "Invalid token", info: error });
  }
};
