import React, { useEffect, useState } from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import ImgGrid from './ImgGrid';
import { getTop } from '../services';

const MainTabs = () => {
  const [top, setTop] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getTop();
      if (res.data.error) {
        //whatever
      } else {
        setTop(res.data);
      }
    })();
  }, []);

  return (
    <Tabs h="100%" variant="unstyled" align="center" _focus={{ outline: 'none' }}>
      <TabList color="main.white">
        <Tab _selected={{ color: 'main.green' }} _focus={{ outline: 'none' }}>
          ({top.length}) All
        </Tab>
        <Tab _selected={{ color: 'main.green' }} _focus={{ outline: 'none' }}>
          ({top.filter((t) => t.type === '2D').length}) 2D
        </Tab>
        <Tab _selected={{ color: 'main.green' }} _focus={{ outline: 'none' }}>
          ({top.filter((t) => t.type === '3D').length}) 3D
        </Tab>
        <Tab _selected={{ color: 'main.green' }} _focus={{ outline: 'none' }}>
          ({top.filter((t) => t.type === 'Live Action CG/VFX').length}) Live Action CG/VFX
        </Tab>
        <Tab _selected={{ color: 'main.green' }} _focus={{ outline: 'none' }}>
          ({top.filter((t) => t.type === 'Traditional').length}) Traditional
        </Tab>
      </TabList>
      <TabPanels bg="main.3">
        <TabPanel padding="0px">
          <ImgGrid art={top} />
        </TabPanel>
        <TabPanel padding="0px">
          <ImgGrid art={top.filter((t) => t.type === '2D')} />
        </TabPanel>
        <TabPanel padding="0px">
          <ImgGrid art={top.filter((t) => t.type === '3D')} />
        </TabPanel>
        <TabPanel padding="0px">
          <ImgGrid art={top.filter((t) => t.type === 'Live Action CG/VFX')} />
        </TabPanel>
        <TabPanel padding="0px">
          <ImgGrid art={top.filter((t) => t.type === 'Traditional')} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default MainTabs;
