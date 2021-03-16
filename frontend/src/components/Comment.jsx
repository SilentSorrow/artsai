import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, HStack, IconButton, Image, Text, VStack } from '@chakra-ui/react';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { deleteComment } from '../services';

const Comment = ({ comment, user, refresh }) => {
  const history = useHistory();

  const deleteC = async () => {
    const res = await deleteComment(comment?.id);
    if (!res.data.error) {
      refresh.setRerender(refresh.rerender + 1);
    }
  };

  return (
    <Box w="100%" h="auto" padding="5px" borderTop="2px" borderColor="main.green">
      <HStack spacing="5px" alignItems="flex-start">
        <Image
          border="2px"
          borderRadius="full"
          borderColor="main.green"
          boxSize="60px"
          filter={
            !comment?.user?.profileImage &&
            'invert(23%) sepia(100%) saturate(2247%) hue-rotate(89deg) brightness(95%) contrast(93%)'
          }
          src={
            comment?.user?.profileImage
              ? 'http://localhost:3000/api/images/' + comment?.user?.profileImage
              : '../img/default-profile-image.png'
          }
          fit="cover"
          onClick={() => history.push('/artists/' + comment?.user?.username)}
        />
        <VStack w="100%" alignItems="flex-start">
          <HStack w="100%" justifyContent="space-between">
            {comment?.user?.username && (
              <Text
                fontSize="20px"
                color="main.white"
                onClick={() => history.push('/artists/' + comment?.user?.username)}
              >
                {comment?.user?.username}
              </Text>
            )}
            {comment?.user?.id === user?.id && (
              <IconButton
                variant="unstyled"
                color="main.white"
                onClick={deleteC}
                icon={<SmallCloseIcon />}
                display="block"
                _focus={{ outline: 'none' }}
                h="30px"
                w="30px"
              />
            )}
          </HStack>
          {comment?.value && (
            <Text fontSize="15px" w="100%" color="main.white" wordBreak="break-all" textAlign="justify">
              {comment?.value}
            </Text>
          )}
        </VStack>
      </HStack>
    </Box>
  );
};

export default Comment;
