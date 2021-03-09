import React from 'react';
import { useHistory } from 'react-router-dom';
import { SimpleGrid, Image, Heading } from '@chakra-ui/react';

const ImgGrid = ({ art }) => {
  const history = useHistory();

  return (
    <SimpleGrid columns={art?.length ? 7 : 1} minHeight="526px">
      {art?.length ? (
        art.map((a) => (
          <Image
            boxSize="300px"
            src={'http://localhost:3000/api/images/' + a.mainImage}
            fit="cover"
            key={a.id}
            onClick={() => history.replace('/details/' + a.id)}
          />
        ))
      ) : (
        <Heading size="sm" color="main.white" paddingTop="20px">
          This seem empty...
        </Heading>
      )}
    </SimpleGrid>
  );
};

export default ImgGrid;
