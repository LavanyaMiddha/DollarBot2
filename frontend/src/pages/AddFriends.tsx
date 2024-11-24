import React, { useState } from 'react';
import {
  Container,
  Flex,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react';
import { Button } from '../components/ui/button';
import { useForm } from 'react-hook-form';
import axios from 'axios';

type Props = {
  onAddFriend?: (value: boolean) => void;
};

const AddFriends = ({ onAddFriend }: Props) => {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm();
  const [friends, setFriends] = useState<string>();


  async function onSubmit(data:any) {
    const friendData = {
      user_id: localStorage.getItem('globalUserId'),
      friends: data.friends,
    };

    try {
      await axios.post(
        'http://127.0.0.1:5000/split/add_single',
        friendData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      
      onAddFriend?.(true);
      setFriends(friends);
    } catch (error) {
      console.error('Error adding friends:', error);
    }
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Heading as="h2" size="xl" mb={6}>
        Add Friends
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column" gap={4}>
        <Text
          fontSize="sm"
          fontWeight="medium"
          marginBottom="15px"
          color="White"
        >
          Add Friends
        </Text>
        <Input
          id="friends"
          background={'white'}
          colorPalette="Black"
          marginBottom="10px"
          placeholder="Enter UserId of Friends"
          {...register('friends', {
            required: 'This is required',
            minLength: { value: 3, message: 'Minimum length should be 3' },
          })}
          />
          <Button type="submit" loading={isSubmitting}>
            Save Friends
          </Button>
        </Flex>
      </form>
    </Container>
  );
};

export default AddFriends;