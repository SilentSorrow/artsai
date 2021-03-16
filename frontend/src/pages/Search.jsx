import React, { useEffect, useRef, useState } from 'react';
import { Box, Center, HStack, Select, Text } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import ImgGrid from '../components/ImgGrid';
import { search, getSubjects, getTypes } from '../services';

const Search = () => {
  const dateRef = useRef();
  const subjectRef = useRef();
  const typeRef = useRef();
  const [rerender, setRerender] = useState(0);
  const [searched, setSearched] = useState([]);
  const [processed, setProcessed] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    const options = urlParams.get('options');

    (async () => {
      const searchRes = await search(q, options);
      if (!searchRes.data.error) {
        setSearched(searchRes.data);
        setProcessed(searchRes.data);
      }
    })();
  }, [rerender]);

  useEffect(() => {
    (async () => {
      const subjectRes = await getSubjects();
      if (!subjectRes.data.error) {
        setSubjects(subjectRes.data);
      }

      const typesRes = await getTypes();
      if (!typesRes.data.error) {
        setTypes(typesRes.data);
      }
    })();
  }, []);

  const onFilterChange = () => {
    const dateOrder = dateRef.current.value;
    const subjectFilter = subjectRef.current.value;
    const typeFilter = typeRef.current.value;
    const filters = {};

    if (subjectFilter === 'all') {
      delete filters.subject;
    } else {
      filters.subject = subjectFilter;
    }
    if (typeFilter === 'all') {
      delete filters.type;
    } else {
      filters.type = typeFilter;
    }

    const filtered = searched.filter((art) => {
      if (filters.type && filters.subject) {
        return art.type === filters.type && art.subjects.includes(filters.subject);
      } else if (filters.type && !filters.subject) {
        return art.type === filters.type;
      } else if (!filters.type && filters.subject) {
        return art.subjects.includes(filters.subject);
      } else {
        return true;
      }
    });

    if (dateOrder === 'asc') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setProcessed(filtered);
  };

  return (
    <>
      <Navbar refresh={{ rerender, setRerender }} />
      <Center h="50px" w="100%" bgColor="main.2" borderBottom="1px" borderColor="main.green">
        <HStack spacing="15px">
          <HStack spacing="5px">
            <Text fontSize="15px" color="main.white">
              Order by:
            </Text>
            <Select color="main.white" w="150px" h="35px" ref={dateRef} onChange={onFilterChange}>
              <option style={{ color: '#171717' }} value="asc">
                Date (ASC)
              </option>
              <option style={{ color: '#171717' }} value="desc">
                Date (DESC)
              </option>
            </Select>
          </HStack>
          <HStack spacing="5px">
            <Text fontSize="15px" color="main.white">
              Subject:
            </Text>
            <Select color="main.white" w="200px" h="35px" ref={subjectRef} onChange={onFilterChange}>
              <option style={{ color: '#171717' }} value="all">
                All
              </option>
              {subjects?.map((subject) => {
                return (
                  <option style={{ color: '#171717' }} value={subject.id} key={subject.id}>
                    {subject.value}
                  </option>
                );
              })}
            </Select>
          </HStack>
          <HStack spacing="5px">
            <Text fontSize="15px" color="main.white">
              Type:
            </Text>
            <Select color="main.white" w="200px" h="35px" ref={typeRef} onChange={onFilterChange}>
              <option style={{ color: '#171717' }} value="all">
                All
              </option>
              {types?.map((type) => {
                return (
                  <option style={{ color: '#171717' }} value={type.id} key={type.id}>
                    {type.value}
                  </option>
                );
              })}
            </Select>
          </HStack>
        </HStack>
      </Center>
      <Box w="100%" bgColor="main.3" h="calc(100vh - 105px)">
        <ImgGrid art={processed} />
      </Box>
    </>
  );
};

export default Search;
