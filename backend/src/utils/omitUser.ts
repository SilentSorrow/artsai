import { User } from '../db/entities';
import { OmitedUser } from '../types';

export default (user: User): OmitedUser => {
  // eslint-disable-next-line
  const { password, salt, ...omitedUser } = user;

  return omitedUser;
};
