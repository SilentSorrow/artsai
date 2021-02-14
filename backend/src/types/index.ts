import { Request } from 'express';
import { User } from '../db/entities';

type LoginData = {
  user: OmitedUser;
  token: string;
};

type OmitedUser = {
  id: string;
  username: string;
  email: string;
  about: string;
  profileImage?: string;
  isVerified: boolean;
  createdAt: Date;
};

type ArtData = {
  id: string;
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

export { LoginData, OmitedUser, ArtData, AppRequest };
