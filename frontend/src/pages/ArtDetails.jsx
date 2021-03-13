import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Center, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { UserContext } from '../app/UserContext';
import { getArtDetails, getLikes, toggleLike, isFollowing, toggleFollow } from '../services';

const ArtDetails = ({ history }) => {
  const [rerender, setRerender] = useState(0);
  const { artId } = useParams();
  const [art, setArt] = useState(null);
  const [likes, setLikes] = useState([]);
  const [isUserFollowing, setIsUserFollowing] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      const artRes = await getArtDetails(artId);
      if (!artRes.data.error) {
        setArt(artRes.data);
      }
    })();
  }, [artId]);

  useEffect(() => {
    (async () => {
      const likesRes = await getLikes(artId);

      if (!likesRes.data.error) {
        setLikes(likesRes.data);
      }

      const isFollowingRes = await isFollowing(art?.user?.id);
      if (!isFollowingRes.data.error) {
        setIsUserFollowing(isFollowingRes.data);
      }
    })();
  }, [art, artId, rerender]);

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
        <VStack spacing="0px" w="25%" h="100%" borderLeft="2px" borderColor="main.green" bgColor="main.3">
          <Center
            w="100%"
            h="130px"
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
            <HStack spacing="10px">
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
                onClick={() => art?.user?.username && history.push('/artists/' + art.user.username)}
              />
              <VStack>
                <Heading size="lg" color="main.white">
                  {art?.user?.username}
                </Heading>
                <HStack spacing="10px">
                  <Button
                    type="submit"
                    variant="solid"
                    w="170px"
                    _focus={{ outline: 'none' }}
                    onClick={async () => {
                      await toggleFollow(art?.user?.id);
                      setRerender(rerender + 1);
                    }}
                  >
                    {!isUserFollowing ? 'Follow' : 'Unfollow'}
                  </Button>
                </HStack>
              </VStack>
            </HStack>
          </Center>
          <VStack w="100%" padding="15px" spacing="5px">
            <Text fontSize="20px" color="main.white">
              {art?.title}
            </Text>
            <Text fontSize="17px" color="main.white" textAlign="justify">
              {art?.description}
            </Text>
            <HStack spacing="0px" w="100%">
              <Image
                boxSize="40px"
                filter={
                  likes?.some((like) => like.userId === user?.id) &&
                  'invert(23%) sepia(100%) saturate(2247%) hue-rotate(89deg) brightness(95%) contrast(93%)'
                }
                src="../img/heart.png"
                fit="cover"
                onClick={async () => {
                  await toggleLike(art?.id);
                  setRerender(rerender + 1);
                }}
              />
              <Text fontSize="15px" color="main.white" as="b">
                {likes?.length}
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </HStack>
    </Center>
  );
};

export default ArtDetails;
