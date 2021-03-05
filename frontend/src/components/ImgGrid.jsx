import React from 'react';
import { SimpleGrid, Image } from '@chakra-ui/react';

const ImgGrid = ({ art }) => {
  return (
    <SimpleGrid columns={7} minHeight="526px">
      {art?.length &&
        art.map((a) => (
          <Image boxSize="300px" src={'http://localhost:3000/api/images/' + a.mainImage} fit="cover" key={a.id} />
        ))}
    </SimpleGrid>
  );
};

export default ImgGrid;
