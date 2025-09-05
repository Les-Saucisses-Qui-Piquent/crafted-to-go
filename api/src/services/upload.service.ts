import { FastifyRequest } from "fastify";
import { MultipartFile } from "@fastify/multipart";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "./cloudinary.config";

export class ImageUploader {
  static async upload(req: FastifyRequest): Promise<{ url: string }> {
    try {
      let data = await (req ).file?.();
      if (!data) {
        for await (const part of (req ).parts?.() || []) {
          if (part.type === "file") {
            data = part as MultipartFile;
            break;
          }
        }
      }

      // Typage strict
      const fileData: MultipartFile | undefined = data as MultipartFile | undefined;

      // LOG DEBUG
      console.log('Champ reçu:', fileData?.fieldname, 'Nom:', fileData?.filename, 'Type:', fileData?.mimetype);

      if (!fileData) {
        req.log.error("Aucun fichier envoyé");
        throw new Error("Aucun fichier envoyé");
      }

      const buffer = await fileData.toBuffer();
      console.log('Buffer reçu taille:', buffer.length);

      const uploadResult: UploadApiResponse | undefined = await new Promise((resolve) => {
        cloudinary.uploader
          .upload_stream((error, uploadResult) => {
            if (error) {
              req.log.error('CLOUDINARY ERROR:', error);
              return resolve(undefined);
            }
            console.log('UPLOAD RESULT:', uploadResult);
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