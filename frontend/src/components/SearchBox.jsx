import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react';
import { SearchIcon, SettingsIcon } from '@chakra-ui/icons';

const SearchBox = ({ refresh }) => {
  const searchRef = useRef();
  const [searchOptions, setSearchOptions] = useState(['title', 'description', 'tags']);
  const history = useHistory();

  const search = () => {
    if (searchRef.current.value) {
      history.push('/search?q=' + searchRef.current.value + '&options=' + searchOptions.join());
      if (history.location.pathname === '/search') {
        refresh?.setRerender(refresh?.rerender + 1);
      }
    } else {
      searchRef.current.focus();
    }
  };

  return (
    <HStack spacing="10px">
      <Menu closeOnSelect={false}>
        <MenuButton
          variant="unstylized"
          color="main.white"
          h="35px"
          w="55px"
          as={IconButton}
          icon={<SettingsIcon />}
          _focus={{ outline: 'none' }}
        />
        <MenuList>
          <MenuOptionGroup
            title="Search by..."
            type="checkbox"
            onChange={(value) => {
              if (value.length) {
                setSearchOptions(value);
              } else {
                setSearchOptions(['title', 'description', 'tags']);
              }
            }}
          >
            <MenuItemOption value="title">Title</MenuItemOption>
            <MenuItemOption value="description">Description</MenuItemOption>
            <MenuItemOption value="tags">Tags</MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Menu>
      <Box>
        <InputGroup>
          <Input type="text" placeholder="Search..." ref={searchRef} textColor="main.white" w="700px" h="35px" />
          <InputRightElement h="35px">
            <IconButton
              variant="outlined"
              color="main.white"
              h="100%"
              icon={<SearchIcon />}
              _focus={{ outline: 'none' }}
              onClick={search}
            />
          </InputRightElement>
        </InputGroup>
      </Box>
    </HStack>
  );
};

export default SearchBox;
