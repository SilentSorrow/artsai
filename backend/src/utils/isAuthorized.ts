import * as typeorm from 'typeorm';
import Container from 'typedi';
import { UnauthorizedError } from 'routing-controllers';
import { DEFAULT_PG_CONN_NAME } from '../app/constants';
import { User } from '../db/entities';
import { OmitedUser } from '../types';

interface ITarget {
  id: string;
  user: User | OmitedUser;
}

const getPgConnection = (): typeorm.Connection => {
  return Container.get(DEFAULT_PG_CONN_NAME);
};

export default async <TargetType extends ITarget>(
  targetType: typeorm.ObjectType<TargetType>,
  targetId: string,
  user: User
): Promise<void> => {
  const pgConn = getPgConnection();
  const target = await pgConn.getRepository(targetType).findOne(targetId, { relations: ['user'] });

  if (target?.user.id !== user.id) {
    throw new UnauthorizedError(`You are not authorized make this action`);
  }
};
