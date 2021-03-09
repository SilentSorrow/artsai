import React, { useContext, useState, useRef } from 'react';
import { Box, Button, Center, Heading, HStack, Image, Input, Text, Textarea, VStack } from '@chakra-ui/react';
import { UserContext } from '../app/UserContext';
import { useForm } from 'react-hook-form';
import { sendCode, changeProfileImage, changeBackgroundImage, deleteAccount, update } from '../services';

const AccountSettings = ({ history }) => {
  const [error, setError] = useState();
  const fileProfileForm = useRef();
  const fileProfileInput = useRef();
  const fileBackgroundForm = useRef();
  const fileBackgroundInput = useRef();
  const { user } = useContext(UserContext);
  const { register, handleSubmit } = useForm();

  const chooseProfileFile = () => {
    fileProfileInput.current.click();
  };

  const chooseBackgroundFile = () => {
    fileBackgroundInput.current.click();
  };

  const handleProfileUpload = async () => {
    const formData = new FormData();
    formData.append('file', fileProfileInput.current.files[0]);

    await changeProfileImage(formData);
  };

  const handleBackgroundUpload = async () => {
    const formData = new FormData();
    formData.append('file', fileBackgroundInput.current.files[0]);

    await changeBackgroundImage(formData);
  };

  const handleDelete = async () => {
    const res = await deleteAccount();

    if (!res.data.error) {
      localStorage.removeItem('app-auth');
      history.push('/');
    }
  };

  const handleUpdate = async (formData) => {
    const res = await update(formData);
    if (res.data.error) {
      setError(res.data.error.message);
    } else {
    }
  };

  return (
    <Center h="100vh" bg="main.2">
      <Box w="700px" h="500px" bg="main.1" rounded="md" boxShadow="dark-lg" padding="10px">
        <Center h="100%" w="100%">
          <VStack spacing="10px" w="100%">
            <HStack spacing="10px" w="100%" h="150px">
              <Center
                w="100%"
                h="100%"
                border="2px"
                borderColor="main.green"
                rounded="md"
                bgImage={
                  user?.backgroundImage
                    ? 'url(http://localhost:3000/api/images/' + user?.backgroundImage + ')'
                    : 'url(../img/default-profile-background.jpg)'
                }
                bgPosition="bottom"
              >
                <HStack spacing="10px">
                  <Image
                    border="2px"
                    borderRadius="full"
                    borderColor="main.green"
                    boxSize="130px"
                    filter={
                      !user?.profileImage &&
                      'invert(23%) sepia(100%) saturate(2247%) hue-rotate(89deg) brightness(95%) contrast(93%)'
                    }
                    src={
                      user?.profileImage
                        ? 'http://localhost:3000/api/images/' + user.profileImage
                        : '../img/default-profile-image.png'
                    }
                    fit="cover"
                  />
                  <VStack spacing="10px">
                    <HStack spacing="10px">
                      <form ref={fileProfileForm}>
                        <input type="file" hidden ref={fileProfileInput} onChange={handleProfileUpload} />
                        <Button onClick={chooseProfileFile} w="230px">
                          Change profile image
                        </Button>
                      </form>
                      <form ref={fileBackgroundForm}>
                        <input
                          type="file"
                          name="file"
                          hidden
                          ref={fileBackgroundInput}
                          onChange={handleBackgroundUpload}
                        />
                        <Button onClick={chooseBackgroundFile} w="230px">
                          Change background image
                        </Button>
                      </form>
                    </HStack>
                    <Text color="main.white">Must be JPEG, PNG, or GIF and cannot exceed 10MB.</Text>
                  </VStack>
                </HStack>
              </Center>
            </HStack>
            <HStack spacing="10px" w="100%" h="150px">
              <Center w="100%" h="100%" border="2px" borderColor="main.green" rounded="md">
                <form onSubmit={handleSubmit(handleUpdate)}>
                  <HStack spacing="10px">
                    <Box>
                      <Text fontSize="15px" color="main.white">
                        About:
                      </Text>
                      <Textarea
                        name="about"
                        placeholder={user?.about}
                        textColor="main.white"
                        w="300px"
                        h="100px"
                        size="sm"
                        resize="none"
                        ref={register()}
                      />
                    </Box>
                    <VStack spacing="20px">
                      <Box>
                        <Text fontSize="15px" color="main.white">
                          Username:
                        </Text>
                        <Input
                          type="text"
                          name="username"
                          placeholder={user?.username}
                          textColor="main.white"
                          w="280px"
                          h="35px"
                          ref={register({ required: true })}
                        />
                      </Box>
                      <HStack spacing="10px">
                        {error && (
                          <Center w="170px">
                            <Text fontSize="15px" color="main.red">
                              {error}
                            </Text>
                          </Center>
                        )}
                        <Button
                          type="submit"
                          variant="solid"
                          w={error ? '100px' : '280px'}
                          _focus={{ outline: 'none' }}
                        >
                          Save
                        </Button>
                      </HStack>
                    </VStack>
                  </HStack>
                </form>
              </Center>
            </HStack>
            <HStack spacing="10px" w="100%" h="150px">
              <Center w="50%" h="100%" border="2px" borderColor="main.green" rounded="md">
                <VStack spacing="10px">
                  <Heading size="md" color="main.white">
                    {user?.email}
                  </Heading>
                  {user?.isVerified ? (
                    <>
                      <Text color="main.white" align="center">
                        Verified. Thank you for verifying your email. This email is linked to your account.
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text color="main.white" align="center" margin="5px">
                        Not verified. Verify your emil to gain full access to the service.
                      </Text>
                      <Button
                        w="230px"
                        onClick={async () => {
                          await sendCode();
                          history.push('verify-account');
                        }}
                      >
                        Send me an email
                      </Button>
                    </>
                  )}
                </VStack>
              </Center>
              <Center w="50%" h="100%" border="2px" borderColor="main.green" rounded="md">
                <VStack spacing="10px">
                  <Text color="main.white" align="center">
                    If you delete your account, please keep in mind that all related data will be deleted too.
                  </Text>
                  <Button w="150px" bgColor="main.red" color="main.white" onClick={handleDelete}>
                    Delete account
                  </Button>
                </VStack>
              </Center>
            </HStack>
          </VStack>
        </Center>
      </Box>
    </Center>
  );
};

export default AccountSettings;
