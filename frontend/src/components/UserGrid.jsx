import React from 'react';
import { useHistory } from 'react-router-dom';
import { SimpleGrid, Heading } from '@chakra-ui/react';
import ProfilePreview from '../components/ProfilePreview';

const UserGrid = ({ users }) => {
  const history = useHistory();

  return (
    <SimpleGrid
      columns={users?.length ? 10 : 1}
      spacing={10}
      minHeight="calc(100vh - 395px)"
      padding={users?.length && '10px'}
    >
      {users?.length ? (
        users.map((u) => <ProfilePreview user={u} history={history} key={u.id} />)
      ) : (
        <Heading size="sm" color="main.white" paddingTop="20px">
          This seem empty...
        </Heading>
      )}
    </SimpleGrid>
  );
};

export default UserGrid;
