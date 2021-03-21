import React from 'react';
import { useHistory } from 'react-router-dom';
import { SimpleGrid, Image, Heading } from '@chakra-ui/react';

const ImgGrid = ({ art }) => {
  const history = useHistory();

  return (
    <SimpleGrid columns={art?.length ? 7 : 1} minHeight="calc(100vh - 395px)">
      {art?.length ? (
        art.map((a) => (
          <Image
            boxSize="300px"
            src={`${process.env.REACT_APP_API_URL}/images/` + a.mainImage}
            fit="cover"
            key={a.id}
            onClick={() => history.replace('/details/' + a.id)}
          />
        ))
      ) : (
        <Heading size="sm" color="main.white" paddingTop="20px" textAlign="center">
          This seem empty...
        </Heading>
      )}
    </SimpleGrid>
  );
};

export default ImgGrid;
