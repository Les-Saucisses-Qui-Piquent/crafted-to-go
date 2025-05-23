import { FastifyReply, FastifyRequest, preHandlerHookHandler } from "fastify";
import { useToken } from "../../utils/token";
import { CustomJwtPayload } from "../../types";

export const authMiddleware: preHandlerHookHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return reply.status(401).send({ message: "Unauthorized", error: "No token provided" });
    }

    // Here split's the "Bearer <token>"
    const token = authHeader.split(" ")[1];
    const { verifyToken } = useToken();
    const decodedToken = verifyToken(token);

    // Decorate the request with token infos
    const { authUser } = decodedToken as CustomJwtPayload;

    request.token = token;
    request.authUser = authUser;
  } catch (error) {
    return reply.status(401).send({ message: "Unauthorized", error: "Invalid token", info: error });
  }
};
