import React from 'react';
import { SimpleGrid, Image } from '@chakra-ui/react';

const ImgGrid = () => {
  return (
    <SimpleGrid columns={7}>
      <Image
        boxSize="300px"
        src="https://cdnb.artstation.com/p/assets/images/images/033/455/487/large/wlop-20se.jpg?1609677333"
        fit="cover"
      />
      <Image
        boxSize="300px"
        src="https://cdnb.artstation.com/p/assets/images/images/033/094/069/4k/marcin-blaszczak-maelstrom-engine3k.jpg?1608387081"
        fit="cover"
      />
      <Image
        boxSize="300px"
        src="https://cdnb.artstation.com/p/assets/images/images/034/177/427/large/jens-claessens-anatomy1.jpg?1611607737"
        fit="cover"
      />
      <Image
        boxSize="300px"
        src="http://localhost:3000/api/images/test.jpg"
        fit="cover"
      />
      <Image
        boxSize="300px"
        src="http://localhost:3000/api/images/test.jpg"
        fit="cover"
      />
      <Image
        boxSize="300px"
        src="https://cdnb.artstation.com/p/assets/images/images/034/763/659/large/andrew-sunarko-saneux-bathroom-main1.jpg?1613148547"
        fit="cover"
      />
      <Image
        boxSize="300px"
        src="https://cdna.artstation.com/p/assets/images/images/035/320/362/large/rick-buurman-t11.jpg?1614675740"
        fit="cover"
      />
      <Image
        boxSize="300px"
        src="http://localhost:3000/api/images/test.jpg"
        fit="cover"
      />
      <Image
        boxSize="300px"
        src="http://localhost:3000/api/images/test.jpg"
        fit="cover"
      />
    </SimpleGrid>
  )
};

export default ImgGrid;