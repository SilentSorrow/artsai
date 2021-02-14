import { User } from '../db/entities';
import { OmitedUser } from '../types';

export default (user: User): OmitedUser => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    about: user.about,
    isVerified: user.isVerified,
    profileImage: user.profileImage,
    createdAt: user.createdAt,
  };
};
