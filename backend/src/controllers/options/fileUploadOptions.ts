import multer from 'multer';
import mime from 'mime';
import fs from 'fs';
import { IMG_DIRECTORY_PATH } from '../../app/constants';
import { Crypto } from '../../utils';
import { AppRequest } from '../../types';
import { Request } from 'express';

export const getFileUploadOptions = (): multer.Options => {
  const fileLimit = 1; //

  fs.mkdirSync(IMG_DIRECTORY_PATH, { recursive: true });

  return {
    storage: multer.diskStorage({
      destination: (req: AppRequest | Request, file: Express.Multer.File, cb: Function): void => {
        cb(null, IMG_DIRECTORY_PATH);
      },
      filename: (req: AppRequest | Request, file: Express.Multer.File, cb: Function): void => {
        const ext = mime.extension(file.mimetype);
        const filename = Crypto.createRandomString(27) + '.' + ext;
        cb(null, filename);
      },
    }),
    fileFilter: (req: AppRequest | Request, file: Express.Multer.File, cb: Function): void => {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff'];
      cb(null, allowedMimeTypes.includes(file.mimetype));
    },
    limits: {
      files: fileLimit,
      fieldNameSize: 255,
      fileSize: 1024 * 1024 * 2,
    },
  };
};
