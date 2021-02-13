import { Request } from 'express';
import { User } from '../db/entities';

type LoginData = {
  user: User;
  token: string;
};

type OmmitedUser = {
  username: string;
  email: string;
  about: string;
  profileImage: string;
  isVerified: boolean;
};

type ArtData = {
  title: string;
  description: string;
  mainImage: string;
  typeId: string;
  subjectIds: string[];
  tags: string[];
};

type AppRequest = Request & {
  user: User;
};

export { LoginData, OmmitedUser, ArtData, AppRequest };
