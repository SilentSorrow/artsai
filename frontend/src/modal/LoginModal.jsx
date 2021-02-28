import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { LockIcon, StarIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { login } from '../services';
import { useState } from 'react';

const LoginModal = () => {
  const [error, setError] = useState();
  const { register, handleSubmit } = useForm();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onLogin = async (formData) => {
    const res = await login(formData);

    if (res.data.error?.message) {
      setError(res.data.error.message);
    } else {
      localStorage.setItem('app-auth', res.data.token);
      onClose();
    }
  };

  return (
    <>
      <Button h="35px" onClick={onOpen} variant="solid">
        Login
      </Button>

      <Modal size="xs" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="main.1">
          <ModalHeader color="main.white">
            <HStack spacing="5px">
              <Text fontSize="15px" color="main.white">
                Login to
              </Text>
              <Text fontSize="20px" color="main.green">
                ArtSai
              </Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="main.white" _focus={{ outline: 'none' }} />
          <form onSubmit={handleSubmit(onLogin)}>
            <ModalBody>
              <Box>
                <Text fontSize="15px" color="main.white">
                  Enter username:
                </Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" children={<StarIcon color="main.white" />} h="35px" />
                  <Input
                    type="text"
                    name="username"
                    placeholder="Username"
                    textColor="main.white"
                    w="280px"
                    h="35px"
                    autoComplete="off"
                    ref={register({ required: true })}
                  />
                </InputGroup>
              </Box>
              <Box>
                <Text fontSize="15px" color="main.white">
                  Enter password:
                </Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" children={<LockIcon color="main.white" />} h="35px" />
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    textColor="main.white"
                    w="280px"
                    h="35px"
                    autoComplete="off"
                    ref={register({ required: true })}
                  />
                </InputGroup>
              </Box>
            </ModalBody>
            <ModalFooter h="50px">
              <HStack spacing="15px">
                {error && (
                  <Text fontSize="15px" color="main.red">
                    {error}
                  </Text>
                )}
                <Button type="submit" variant="solid" _focus={{ outline: 'none' }}>
                  Login
                </Button>
              </HStack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginModal;
