import { FastifyRequest, FastifyReply } from "fastify";
import cloudinary from "../../libs/__mocks__/cloudinary";

export const uploadImageHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const data = await req.file();

  if (!data) {
    return reply.status(400).send({ error: "Aucun fichier envoyé" });
  }

  try {
    const buffer = await data.toBuffer();

    const upload = await cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      async (error, result) => {
        if (error || !result) {
          req.log.error(error);
          return reply.status(500).send({ error: "Erreur Cloudinary" });
        }

        // Prisma dispo via fastify.prisma
        const image = await req.server.prisma.image.create({
          data: {
            url: result.secure_url,
          },
        });

        reply.send({ url: result.secure_url, image });
      },
    );

    // Stream le buffer vers Cloudinary
    const stream = upload;
    stream.end(buffer);
  } catch (err) {
    req.log.error(err);
    reply.status(500).send({ error: "Erreur de traitement du fichier" });
  }
};
