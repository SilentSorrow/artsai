import { Art } from '../db/entities';
import { OmitedArt } from '../types';

export default (art: Art): OmitedArt => {
  // eslint-disable-next-line
  const { id, mainImage, createdAt, ...rest } = art;

  return { id, mainImage, createdAt };
};
