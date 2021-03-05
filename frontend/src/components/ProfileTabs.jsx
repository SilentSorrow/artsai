import React, { useState, useEffect } from 'react';
import { Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import ImgGrid from './ImgGrid';
import { getAllUserArt } from '../services';

const ProfileTabs = ({ userId }) => {
  const [portfolio, setPortfolio] = useState();

  useEffect(() => {
    (async () => {
      const res = await getAllUserArt(userId);
      if (res.data.error) {
        //whatever
      } else {
        setPortfolio(res.data);
      }
    })();
  }, [userId]);

  return (
    <Tabs h="100%" variant="unstyled" align="center" _focus={{ outline: 'none' }}>
      <TabList color="main.white">
        <Tab _selected={{ color: 'main.green' }} _focus={{ outline: 'none' }}>
          Portfolio
        </Tab>
        <Tab _selected={{ color: 'main.green' }} _focus={{ outline: 'none' }}>
          Following
        </Tab>
        <Tab _selected={{ color: 'main.green' }} _focus={{ outline: 'none' }}>
          Followers
        </Tab>
        <Tab _selected={{ color: 'main.green' }} _focus={{ outline: 'none' }}>
          Likes
        </Tab>
      </TabList>
      <TabPanels bg="main.3">
        <TabPanel padding="0px">
          {portfolio?.length ? (
            <ImgGrid userId={userId} art={portfolio} />
          ) : (
            <Heading size="sm" color="main.white">
              No art yet...
            </Heading>
          )}
        </TabPanel>
        <TabPanel>Following</TabPanel>
        <TabPanel>Followers</TabPanel>
        <TabPanel>Likes</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default ProfileTabs;
