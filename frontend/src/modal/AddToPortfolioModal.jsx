import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Tag,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { AttachmentIcon, SmallAddIcon } from '@chakra-ui/icons';
import { getSubjects, getTypes, addToPortfolio } from '../services';

const AddToPortfolioModal = ({ addRef }) => {
  const [catalog, setCatalog] = useState();
  const [img, setImg] = useState();
  const [tags, setTags] = useState([]);
  const [error, setError] = useState();
  const imgInput = useRef();
  const { register, handleSubmit } = useForm();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    (async () => {
      const subjectRes = await getSubjects();
      const typeRes = await getTypes();

      if (!subjectRes.data.error || !typeRes.data.error) {
        setCatalog({ subjects: subjectRes.data, types: typeRes.data });
      }
    })();
  }, []);

  const chooseImg = () => {
    imgInput.current.click();
  };

  const addTag = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const tag = formData.get('tag');
    if (tags.length !== 3 && tag && tag.length <= 15) {
      setTags([...tags, tag]);
    }
  };

  const onSubmit = async (formData) => {
    formData.tags = tags;

    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    fd.append('typeId', formData.typeId);
    fd.append('subjectIds', JSON.stringify(formData.subjectIds));
    fd.append('tags', JSON.stringify(formData.tags));
    fd.append('file', img);

    if (!img) {
      setError('Choose an image to upload');
    } else {
      const res = await addToPortfolio(fd);
      if (res.data.error?.message) {
        setError(res.data.error.message);
      } else {
        setImg(null);
        setError(null);
        setTags([]);
        onClose();
      }
    }
  };

  return (
    <>
      <Button color="main.1" _focus={{ outline: 'none' }} onClick={onOpen} hidden ref={addRef}>
        Add to portfolio
      </Button>

      <Modal size="6xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="main.1">
          <ModalHeader color="main.white">
            <HStack spacing="5px">
              <Text fontSize="20px" color="main.white">
                Add to portfolio
              </Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="main.white" _focus={{ outline: 'none' }} />
          <ModalBody>
            <HStack spacing="70px">
              <VStack spacing="20px">
                <Box
                  w="700px"
                  h="400px"
                  bgColor={!img && 'main.2'}
                  style={{
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                  }}
                  bgImage={img ? 'url(' + URL.createObjectURL(img) + ')' : 'url(../img/image.png)'}
                >
                  <input type="file" hidden ref={imgInput} onChange={() => setImg(imgInput.current.files[0])} />
                  <IconButton onClick={chooseImg} icon={<AttachmentIcon />} _focus={{ outline: 'none' }} />
                </Box>
                <HStack spacing="5px">
                  {tags &&
                    tags.map((tag) => {
                      return (
                        <HStack spacing="0px" key={tag.id}>
                          <Tag>{tag}</Tag>
                          {/* <IconButton type="submit" size="xs" icon={<SmallCloseIcon />} _focus={{ outline: 'none' }} /> */}
                        </HStack>
                      );
                    })}
                  <form onSubmit={addTag}>
                    <InputGroup>
                      <Input type="text" name="tag" textColor="main.white" w="200px" h="20px" />
                      <InputRightElement h="20px">
                        <IconButton
                          type="submit"
                          variant="outlined"
                          color="main.white"
                          size="xs"
                          icon={<SmallAddIcon />}
                          _focus={{ outline: 'none' }}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </form>
                </HStack>
              </VStack>
              <VStack spacing="10px" w="300px">
                <form>
                  <Box>
                    <Text fontSize="15px" color="main.white">
                      Enter title:
                    </Text>
                    <Input
                      type="text"
                      name="title"
                      textColor="main.white"
                      w="320px"
                      h="35px"
                      ref={register({ required: true })}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="15px" color="main.white">
                      Enter description:
                    </Text>
                    <Textarea
                      name="description"
                      textColor="main.white"
                      w="320px"
                      size="sm"
                      resize="none"
                      ref={register({ required: true })}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="15px" color="main.white">
                      Select art type
                    </Text>
                    <Select color="main.white" w="320px" h="35px" name="typeId" ref={register({ required: true })}>
                      {catalog?.types.map((type) => {
                        return (
                          <option style={{ color: '#171717' }} value={type.id} key={type.id}>
                            {type.value}
                          </option>
                        );
                      })}
                    </Select>
                  </Box>
                  <Box w="320px">
                    <Text fontSize="15px" color="main.white">
                      Choose art subjects:
                    </Text>
                    <CheckboxGroup>
                      <SimpleGrid columns={2} spacing={2.5}>
                        {catalog?.subjects.map((subject) => {
                          return (
                            <Checkbox
                              colorScheme="white"
                              color="main.white"
                              name="subjectIds"
                              value={subject.id}
                              ref={register({ required: true })}
                              key={subject.id}
                            >
                              {subject.value}
                            </Checkbox>
                          );
                        })}
                      </SimpleGrid>
                    </CheckboxGroup>
                  </Box>
                </form>
              </VStack>
            </HStack>
          </ModalBody>
          <ModalFooter h="50px">
            <HStack spacing="15px">
              {error && (
                <Text fontSize="15px" color="main.red">
                  {error}
                </Text>
              )}
              <Button onClick={handleSubmit(onSubmit)} variant="solid" _focus={{ outline: 'none' }}>
                Save
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddToPortfolioModal;
