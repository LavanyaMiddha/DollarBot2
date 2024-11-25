import React, { useState } from 'react';
import {
  Container,
  AbsoluteCenter,
  Flex,
  Text,
  Link,
  Table,
  createListCollection,
  Kbd,
  Box,
  ListCollection,
  Heading,
  AspectRatio,
  Input
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

  async function onSubmit(data: any) {
    axios.post(
      'http://127.0.0.1:5000/friends/add_friends',
      {
        user_id: localStorage.getItem('globalUserId'),
        friends: data.friends,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    onAddFriend?.(true);
    setFriends(friends);
  }

  
  return (
    <Container maxW="container.xl" py={10}>
       <Flex justifyContent="flex-start" color="black">
          <Text
            color="teal"
            textStyle="3xl"
            fontWeight="bold"
            margin="12px 90px 0 0"
          >
            Dollar Bot
          </Text>
          <Link
            color="black"
            textStyle="lg"
            href="/"
            fontWeight="medium"
            margin="18px 35px 0 0"
            onClick={() => {
              localStorage.clear();
            }}
          >
            Log Out
          </Link>
          <Link
            color="black"
            textStyle="lg"
            fontWeight="medium"
            margin="18px 35px 0 0"
            href="/Home"
          >
            Home
          </Link>
          <Link
            color="black"
            textStyle="lg"
            fontWeight="medium"
            margin="18px 35px 0 0"
            href="/BudgetGoals"
          >
            Budget Goals
          </Link>
          <Link
            color="Red"
            textStyle="lg"
            fontWeight="medium"
            margin="18px 35px 0 0"
            href="/Alerts"
          >
            Alerts
          </Link>
          <Link
            color="black"
            textStyle="lg"
            fontWeight="medium"
            margin="18px 35px 0 0"
            href="https://github.com/SoftwareEngNoobs/DollarBot"
          >
            About
          </Link>
          <Link
            color="black"
            textStyle="lg"
            fontWeight="medium"
            margin="18px 35px 0 0"
            href="https://github.com/SoftwareEngNoobs/DollarBot"
          >
            Help
          </Link>
        </Flex>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column" gap={4}>
          <Text
            fontSize="20px"
            fontWeight="medium"
            marginBottom="5px"
            color="Black"
            marginTop="15px"
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
