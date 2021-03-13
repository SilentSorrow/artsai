import React, { useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
} from '@chakra-ui/react';
import LoginModal from '../modal/LoginModal';
import AddToPortfolioModal from '../modal/AddToPortfolioModal';
import { CloseIcon, HamburgerIcon, PlusSquareIcon, SearchIcon, SettingsIcon, StarIcon } from '@chakra-ui/icons';
import { UserContext } from '../app/UserContext';
import { logout } from '../services';

const Navbar = () => {
  const addRef = useRef();
  const { user } = useContext(UserContext);
  const history = useHistory();

  const logoutUser = async () => {
    await logout();
    localStorage.removeItem('app-auth');
  };

  const renderAuthButtons = () => {
    return (
      <HStack spacing="20px">
        <LoginModal />
        <Button
          type="submit"
          variant="solid"
          w="100px"
          _focus={{ outline: 'none' }}
          onClick={() => history.push('/signup')}
        >
          Sign Up
        </Button>
      </HStack>
    );
  };

  const renderAccoutMenu = () => {
    return (
      <>
        <AddToPortfolioModal addRef={addRef} />

        <Menu>
          <MenuButton as={IconButton} icon={<HamburgerIcon />} h="35px" w="55px" />
          <MenuList>
            <MenuItem icon={<StarIcon />} onClick={() => history.push(user.username)}>
              My proflile
            </MenuItem>
            <MenuItem icon={<PlusSquareIcon />} onClick={() => addRef.current.click()}>
              Add to portfolio
            </MenuItem>
            <MenuItem icon={<SettingsIcon />} onClick={() => history.push('/account-settings')}>
              Account settings
            </MenuItem>
            <MenuDivider />
            <MenuItem icon={<CloseIcon />} onClick={logoutUser}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </>
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
        {user ? renderAccoutMenu() : renderAuthButtons()}
      </Flex>
    </Box>
  );
};

export default Navbar;
