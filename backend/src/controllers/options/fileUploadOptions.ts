import multer from 'multer';
import mime from 'mime';
import { PROFILE_IMG_DIRECTORY, ART_IMG_DIRECTORY } from '../../app/constants';
import { Crypto } from '../../utils';
import { AppRequest } from '../../types';
import { Request } from 'express';

export enum FileUploadOptionType {
  Profile = 'profile',
  Art = 'art',
}

export const getFileUploadOptions = (type: FileUploadOptionType): multer.Options => {
  let path = '';
  let fileLimit = 0;

  switch (type) {
    case FileUploadOptionType.Profile:
      (path = PROFILE_IMG_DIRECTORY), (fileLimit = 1);
      break;
    case FileUploadOptionType.Art:
      (path = ART_IMG_DIRECTORY), (fileLimit = 5);
      break;
  }

  return {
    storage: multer.diskStorage({
      destination: (req: AppRequest | Request, file: Express.Multer.File, cb: Function): void => {
        cb(null, path);
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
