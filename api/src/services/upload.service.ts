import { FastifyRequest } from "fastify";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "./cloudinary.config";

export class ImageUploader {
  static async upload(req: FastifyRequest): Promise<{ url: string }> {
    try {
      const data = await req.file();

      if (!data) {
        req.log.error("Aucun fichier envoyé");
        throw new Error("Aucun fichier envoyé");
      }

      const buffer = await data.toBuffer();

      const uploadResult: UploadApiResponse | undefined = await new Promise((resolve) => {
        cloudinary.uploader
          .upload_stream((_error, uploadResult) => {
            return resolve(uploadResult);
          })
          .end(buffer);
      });

      if (!uploadResult) {
        req.log.error("Erreur de l'upload du fichier");
        throw new Error("Erreur de l'upload du fichier");
      }

      return { url: uploadResult.secure_url };
    } catch (err) {
      req.log.error(err);
      throw new Error("Erreur de traitement du fichier");
    }
  }
}
