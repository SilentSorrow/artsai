import React from 'react';
import { Image, VStack, Text, Box, Center } from '@chakra-ui/react';

const ProfilePreview = ({ user, history }) => {
  return (
    <Box
      w="150px"
      h="150px"
      bg="main.1"
      rounded="md"
      boxShadow="dark-lg"
      onClick={() => history.push('/artists/' + user.username)}
    >
      <Center w="100%" h="100%">
        <VStack>
          <Image
            border="2px"
            borderRadius="full"
            borderColor="main.green"
            boxSize="100px"
            filter={
              !user?.profileImage &&
              'invert(23%) sepia(100%) saturate(2247%) hue-rotate(89deg) brightness(95%) contrast(93%)'
            }
            src={
              user?.profileImage
                ? 'http://localhost/api/images/' + user?.profileImage
                : '../img/default-profile-image.png'
            }
            fit="cover"
          />
          {user?.username && (
            <Text fontSize="20px" color="main.white">
              {user.username}
            </Text>
          )}
        </VStack>
      </Center>
    </Box>
  );
};

export default ProfilePreview;
