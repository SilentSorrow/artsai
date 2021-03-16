import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Center, Image, Text, VStack } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import ProfileTabs from '../components/ProfileTabs';
import { getUser } from '../services';

const Profile = () => {
  const [userProfile, setUserProfile] = useState();
  const { username } = useParams();

  useEffect(() => {
    (async () => {
      const res = await getUser(username);
      if (res.data.error) {
        //404 page
      } else {
        setUserProfile(res.data);
      }
    })();
  }, [username]);

  return (
    <>
      <Navbar />
      <VStack spacing="0px">
        <Center
          h="300px"
          w="100%"
          bgImage={
            userProfile?.backgroundImage
              ? 'url(http://localhost:3000/api/images/' + userProfile?.backgroundImage + ')'
              : 'url(../img/default-profile-background.jpg)'
          }
          bgPosition="bottom"
          borderBottom="1px"
          borderColor="main.green"
        >
          <VStack>
            <Image
              border="2px"
              borderRadius="full"
              borderColor="main.green"
              boxSize="170px"
              filter={
                !userProfile?.profileImage &&
                'invert(23%) sepia(100%) saturate(2247%) hue-rotate(89deg) brightness(95%) contrast(93%)'
              }
              src={
                userProfile?.profileImage
                  ? 'http://localhost:3000/api/images/' + userProfile?.profileImage
                  : '../img/default-profile-image.png'
              }
              fit="cover"
            />
            {userProfile?.username && (
              <Text fontSize="25px" color="main.white">
                {userProfile.username}
              </Text>
            )}
            {userProfile?.about && (
              <Text w="700px" fontSize="15px" color="main.white" align="center">
                {userProfile.about}
              </Text>
            )}
          </VStack>
        </Center>
        <Box h="40px" w="100%" bg="main.1" borderBottom="1px" borderColor="main.green">
          {userProfile?.id && <ProfileTabs userId={userProfile.id} />}
        </Box>
      </VStack>
    </>
  );
};

export default Profile;
