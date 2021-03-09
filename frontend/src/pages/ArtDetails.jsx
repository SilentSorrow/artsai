import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Center, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { UserContext } from '../app/UserContext';
import { getArtDetails, getLikes, toggleLike } from '../services';

const ArtDetails = () => {
  const [rerender, setRerender] = useState(0);
  const { artId } = useParams();
  const [art, setArt] = useState(null);
  const [likes, setLikes] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      const artRes = await getArtDetails(artId);
      const likesRes = await getLikes(artId);

      console.log(123);

      if (!artRes.data.error) {
        setArt(artRes.data);
      }
      if (!likesRes.data.error) {
        setLikes(likesRes.data);
      }
    })();
  }, [artId, rerender]);

  return (
    <Center h="100vh" w="100vw" bg="main.2">
      <HStack spacing="0px" w="100%" h="100%">
        <Center w="100%" h="100%">
          <Box
            w="90%"
            h="100%"
            bgColor={!art && 'main.2'}
            style={{
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
            }}
            bgImage={art && 'url(http://localhost:3000/api/images/' + art.mainImage + ')'}
          />
        </Center>
        <VStack w="25%" h="100%" borderLeft="2px" borderColor="main.green" bgColor="main.3">
          <Center
            w="100%"
            h="210px"
            borderBottom="2px"
            borderColor="main.green"
            bgColor="main.3"
            bgImage={
              art?.user?.backgroundImage
                ? 'url(http://localhost:3000/api/images/' + art?.user?.backgroundImage + ')'
                : 'url(../img/default-profile-background.jpg)'
            }
            bgPosition="bottom"
          >
            <VStack spacing="5px">
              <Image
                border="2px"
                borderRadius="full"
                borderColor="main.green"
                boxSize="100px"
                filter={
                  !art?.user?.profileImage &&
                  'invert(23%) sepia(100%) saturate(2247%) hue-rotate(89deg) brightness(95%) contrast(93%)'
                }
                src={
                  art?.user?.profileImage
                    ? 'http://localhost:3000/api/images/' + art?.user?.profileImage
                    : '../img/default-profile-image.png'
                }
                fit="cover"
              />
              <Heading size="lg" color="main.white">
                {art?.user?.username}
              </Heading>
              <HStack spacing="10px">
                <Button
                  type="submit"
                  variant="solid"
                  w="100px"
                  _focus={{ outline: 'none' }}
                  onClick={async () => {
                    await toggleLike(art?.id);
                    setRerender(rerender + 1);
                  }}
                >
                  {likes?.some((like) => like.userId === user?.id) ? 'Unlike' : 'Like'}
                </Button>
                <Button type="submit" variant="solid" w="100px" _focus={{ outline: 'none' }}>
                  Follow
                </Button>
              </HStack>
            </VStack>
          </Center>
          <VStack w="100%" padding="15px">
            <Text fontSize="20px" color="main.white" align="left">
              {art?.title}
            </Text>
            <Text fontSize="17px" color="main.white" textAlign="justify">
              {art?.description}
            </Text>
            <HStack spacing="10px" w="100%">
              <Text fontSize="15px" color="main.green" textAlign="left" as="b">
                Likes: {likes?.length}
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </HStack>
    </Center>
  );
};

export default ArtDetails;
