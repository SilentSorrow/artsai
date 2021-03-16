import React, { useEffect, useState, useContext } from 'react';
import { Box, Button, Center, Heading, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { verifyCode, sendCode } from '../services';
import { UserContext } from '../app/UserContext';

const VerifyAccount = ({ history }) => {
  const { user } = useContext(UserContext);
  const [code, setCode] = useState('');
  const [error, setError] = useState();

  useEffect(() => {
    if (user?.isVerified) {
      history.push('/');
    }
  }, [user, history]);

  const handleChange = (event) => {
    const inputCode = event.target.value;
    if (!isNaN(inputCode) && inputCode.length < 7) {
      setCode(inputCode);
    }
  };

  const handleVerification = async () => {
    const res = await verifyCode(code);

    if (res.data.error?.message) {
      setError(res.data.error.message);
    } else {
      history.push('');
    }
  };

  const handleResend = async () => {
    await sendCode();
  };

  return (
    <Center h="100vh" bg="main.2">
      <Box w="350px" h="275px" bg="main.1" rounded="md" boxShadow="dark-lg">
        <Center h="100%" w="100%">
          <VStack spacing="10px">
            <VStack spacing="10px">
              <Heading size="xl" color="main.green">
                ArtSai
              </Heading>
              <Text color="main.white" align="center" padding="0px 15px">
                We want to make sure it's really you. In order to further veify your email, we sent you an email with
                verification code.
              </Text>
              <HStack spacing="10px">
                <Text color="main.white">Verification code:</Text>
                <Input type="code" textColor="main.white" w="90px" h="35px" value={code} onChange={handleChange} />
              </HStack>
            </VStack>
            {error && (
              <Text fontSize="15px" color="main.red">
                {error}
              </Text>
            )}
            <HStack spacing="30px" paddingTop="10px">
              <Button variant="solid" w="230px" _focus={{ outline: 'none' }} onClick={handleVerification}>
                Submit
              </Button>
              <Button
                variant="unstyled"
                color="main.white"
                bg="main.1"
                _focus={{ outline: 'none' }}
                onClick={handleResend}
              >
                Resend
              </Button>
            </HStack>
          </VStack>
        </Center>
      </Box>
    </Center>
  );
};

export default VerifyAccount;
