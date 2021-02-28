import React from 'react';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
} from '@chakra-ui/react';
import LoginModal from '../modal/LoginModal';
import { HamburgerIcon, SearchIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const renderAuthButtons = () => {
    return (
      <>
        <LoginModal />
      </>
    );
  };

  const renderAccoutMenu = () => {
    return (
      <Menu>
        <MenuButton as={IconButton} icon={<HamburgerIcon />} h="35px" w="55px" />
        <MenuList w="50px">
          <MenuItem>Something</MenuItem>
          <MenuItem>Something</MenuItem>
        </MenuList>
      </Menu>
    );
  };

  return (
    <Box w="100wh" h="55px" bg="main.1" borderBottom="1px" borderBottomColor="main.green" padding="10px 35px 10px 35px">
      <Flex>
        <Box>
          <Heading size="lg" color="main.green">
            ArtSai
          </Heading>
        </Box>
        <Spacer />
        <Box>
          <InputGroup>
            <Input type="text" placeholder="Search..." textColor="main.white" w="700px" h="35px" />
            <InputRightElement h="35px">
              <IconButton
                variant="outlined"
                color="main.white"
                h="100%"
                icon={<SearchIcon />}
                _focus={{ outline: 'none' }}
              />
            </InputRightElement>
          </InputGroup>
        </Box>
        <Spacer />
        {localStorage.getItem('app-auth') ? renderAccoutMenu() : renderAuthButtons()}
      </Flex>
    </Box>
  );
};

export default Navbar;
