import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Center, Heading, HStack, IconButton, Image, Tag, Text, Textarea, VStack } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { UserContext } from '../app/UserContext';
import Comment from '../components/Comment';
import {
  getArtDetails,
  getLikes,
  deleteArt,
  toggleLike,
  isFollowing,
  toggleFollow,
  postComment,
  getComments,
  sendCode,
} from '../services';

const ArtDetails = ({ history }) => {
  const { user } = useContext(UserContext);
  const { artId } = useParams();
  const commentRef = useRef();
  const [rerender, setRerender] = useState(0);
  const [art, setArt] = useState(null);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [isUserFollowing, setIsUserFollowing] = useState(false);

  useEffect(() => {
    (async () => {
      const artRes = await getArtDetails(artId);
      if (!artRes.data.error) {
        setArt(artRes.data);
      }
    })();
  }, [artId, user]);

  useEffect(() => {
    (async () => {
      const likesRes = await getLikes(artId);
      if (!likesRes.data.error) {
        setLikes(likesRes.data);
      }

      if (art?.user?.id) {
        const isFollowingRes = await isFollowing(art?.user?.id);
        if (!isFollowingRes.data.error) {
          setIsUserFollowing(isFollowingRes.data);
        }
      }

      const commentsRes = await getComments(artId);
      if (!commentsRes.data.error) {
        setComments(commentsRes.data);
      }
    })();
  }, [art, artId, rerender]);

  const deleteA = async () => {
    const res = await deleteArt(artId);
    if (!res.data.error) {
      history.push('/');
    }
  };

  const comment = async () => {
    if (commentRef.current.value) {
      const res = await postComment(artId, commentRef.current.value);
      if (res.data.error?.name === 'UnauthorizedError') {
        await sendCode();
        history.push('/verify-account');
      } else {
        commentRef.current.value = '';
        setRerender(rerender + 1);
      }
    }
  };

  return (
    <Center h="100vh" w="100vw" bg="main.3">
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
        {art?.user?.id === user?.id && (
          <IconButton
            variant="unstyled"
            alignSelf="flex-start"
            onClick={deleteA}
            icon={<DeleteIcon />}
            _focus={{ outline: 'none' }}
            color="main.red"
          />
        )}

        <VStack
          spacing="0px"
          w="25%"
          h="100vh"
          overflowX="hidden"
          overflowY="scroll"
          borderLeft="2px"
          borderColor="main.green"
          bgColor="main.2"
        >
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
                    disabled={!!!user || art?.user?.id === user?.id}
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
            <VStack spacing="5px" w="100%" alignItems="flex-start">
              <Text fontSize="15px" color="main.white">
                Tags:
              </Text>
              {art?.tags.map((tag) => (
                <Tag onClick={() => history.push(`/search?q=${tag.value}&options=tags`)}>{tag.value}</Tag>
              ))}
            </VStack>
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
                  if (user) {
                    await toggleLike(art?.id);
                    setRerender(rerender + 1);
                  }
                }}
              />
              <Text fontSize="15px" color="main.white" as="b">
                {likes?.length}
              </Text>
            </HStack>
            <VStack spacing="5px" w="100%" alignItems="flex-end">
              <Textarea
                name="comment"
                textColor="main.white"
                w="100%"
                h="100px"
                size="sm"
                resize="none"
                ref={commentRef}
              />
              <Button
                type="submit"
                variant="solid"
                w="100px"
                _focus={{ outline: 'none' }}
                disabled={!!!user}
                onClick={comment}
              >
                Comment
              </Button>
            </VStack>
            <VStack spacing="5px" w="100%">
              {comments &&
                comments.map((comment) => (
                  <Comment comment={comment} user={user} refresh={{ rerender, setRerender }} />
                ))}
            </VStack>
          </VStack>
        </VStack>
      </HStack>
    </Center>
  );
};

export default ArtDetails;
