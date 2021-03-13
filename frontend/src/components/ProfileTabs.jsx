import React, { useState, useEffect } from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import ImgGrid from './ImgGrid';
import UserGrid from './UserGrid';
import { getAllUserArt, getLiked, getFollowers, getFollowing } from '../services';

const ProfileTabs = ({ userId }) => {
  const [portfolio, setPortfolio] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [liked, setLiked] = useState([]);

  useEffect(() => {
    (async () => {
      const portfRes = await getAllUserArt(userId);
      if (portfRes.data.error) {
        //whatever
      } else {
        setPortfolio(portfRes.data);
      }

      const likedRes = await getLiked(userId);
      if (likedRes.data.error) {
        //whatever
      } else {
        setLiked(likedRes.data);
      }

      const followersRes = await getFollowers(userId);
      if (followersRes.data.error) {
        //whatever
      } else {
        setFollowers(followersRes.data);
      }

      const followingRes = await getFollowing(userId);
      if (followingRes.data.error) {
        //whatever
      } else {
        setFollowing(followingRes.data);
      }
    })();
  }, [userId]);

  return (
    <Tabs h="100%" variant="unstyled" align="center" _focus={{ outline: 'none' }}>
      <TabList color="main.white">
        <Tab _selected={{ color: 'main.green' }} _focus={{ outline: 'none' }}>
          ({portfolio.length}) Portfolio
        </Tab>
        <Tab _selected={{ color: 'main.green' }} _focus={{ outline: 'none' }}>
          ({following.length}) Following
        </Tab>
        <Tab _selected={{ color: 'main.green' }} _focus={{ outline: 'none' }}>
          ({followers.length}) Followers
        </Tab>
        <Tab _selected={{ color: 'main.green' }} _focus={{ outline: 'none' }}>
          ({liked.length}) Likes
        </Tab>
      </TabList>
      <TabPanels bg="main.3">
        <TabPanel padding="0px">
          <ImgGrid art={portfolio} />
        </TabPanel>
        <TabPanel padding="0px">
          <UserGrid users={following} />
        </TabPanel>
        <TabPanel padding="0px">
          <UserGrid users={followers} />
        </TabPanel>
        <TabPanel padding="0px">
          <ImgGrid art={liked} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default ProfileTabs;
