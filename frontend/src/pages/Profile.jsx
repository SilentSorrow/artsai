import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Center, Image, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import ImgGrid from '../components/ImgGrid';
import { getUser } from '../services';

const Profile = () => {
  const [userProfile, setUserProfile] = useState();
  const { username } = useParams();

  useEffect(() => {
    (async () => {
      const res = await getUser(username);
      if (res.data.error) {

      } else {
        setUserProfile(res.data);
      }
    })();
  }, [username]);

  return (
    <>
      <Navbar />
      <VStack spacing="0px">
        <Center h="300px" w="100%" bgImage="url(./img/default-profile-background.jpg)" bgPosition="bottom">
          <VStack>
          <Image
            border="2px"
            borderRadius="full"
            boxSize="170px"
            filter="invert(23%) sepia(100%) saturate(2247%) hue-rotate(89deg) brightness(95%) contrast(93%)"
            src="./img/default-profile-image.png"
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
        <Box h="40px" w="100%" bg="main.1">
          <Tabs h="100%" variant="unstyled" align="center" _focus={{ outline: 'none' }}>
            <TabList color="main.white">
              <Tab
                _selected={{ color: 'main.green' }}
                _focus={{ outline: 'none' }}
              >
                Portfolio
              </Tab>
              <Tab
                _selected={{ color: 'main.green' }}
                _focus={{ outline: 'none' }}
              >
                Following
              </Tab>
              <Tab
                _selected={{ color: 'main.green' }}
                _focus={{ outline: 'none' }}
              >
                Followers
              </Tab>
              <Tab
                _selected={{ color: 'main.green' }}
                _focus={{ outline: 'none' }}
              >
                Likes
              </Tab>
            </TabList>
            <TabPanels bg="main.3">
              <TabPanel padding="0px"><ImgGrid /></TabPanel>
              <TabPanel>Following</TabPanel>
              <TabPanel>Followers</TabPanel>
              <TabPanel>Likes</TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>
    </>
  );
};

export default Profile;
