import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Center,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Button,
  HStack,
  Heading,
} from '@chakra-ui/react';
import { EmailIcon, LockIcon, StarIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { UserContext } from '../app/UserContext';
import { signUp, sendCode } from '../services';

const SignUp = ({ history }) => {
  const { user } = useContext(UserContext);
  const [error, setError] = useState();
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    if (user) {
      history.push('/');
    }
  }, [user, history]);

  const onSignUp = async (formData) => {
    if (formData.password !== formData.confirmPassword) {
      setError('The password confirmation failed');
    } else {
      const res = await signUp(formData);

      if (res.data.error?.message) {
        setError(res.data.error.message);
      } else {
        localStorage.setItem('app-auth', res.data.token);
        await sendCode();
        history.push('verify-account');
      }
    }
  };

  return (
    <Center h="100vh" bg="main.2">
      <Box w="350px" h="500px" bg="main.1" rounded="md" boxShadow="dark-lg">
        <Center h="100%" w="100%">
          <VStack spacing="10px">
            <VStack>
              <Heading size="xl" color="main.green">
                ArtSai
              </Heading>
              <Text fontSize="20px" color="main.white">
                Sign Up
              </Text>
            </VStack>
            <form onSubmit={handleSubmit(onSignUp)}>
              <VStack spacing="10px">
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
                      ref={register({ required: true })}
                    />
                  </InputGroup>
                </Box>
                <Box>
                  <Text fontSize="15px" color="main.white">
                    Enter email:
                  </Text>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" children={<EmailIcon color="main.white" />} h="35px" />
                    <Input
                      type="text"
                      name="email"
                      placeholder="Email"
                      textColor="main.white"
                      w="280px"
                      h="35px"
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
                      ref={register({ required: true })}
                    />
                  </InputGroup>
                </Box>
                <Box>
                  <Text fontSize="15px" color="main.white">
                    Confirm password:
                  </Text>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" children={<LockIcon color="main.white" />} h="35px" />
                    <Input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm password"
                      textColor="main.white"
                      w="280px"
                      h="35px"
                      ref={register({ required: true })}
                    />
                  </InputGroup>
                </Box>
                {error && (
                  <Text fontSize="15px" color="main.red">
                    {error}
                  </Text>
                )}
                <HStack spacing="30px" paddingTop="10px">
                  <Button type="submit" variant="solid" w="190px" _focus={{ outline: 'none' }}>
                    Sign Up
                  </Button>
                  <Button variant="unstyled" color="main.white" bg="main.1" _focus={{ outline: 'none' }}>
                    Go back
                  </Button>
                </HStack>
              </VStack>
            </form>
          </VStack>
        </Center>
      </Box>
    </Center>
  );
};

export default SignUp;
