import React, { useState, useEffect } from 'react';
import {
  Container,
  Flex,
  Text,
  Link,
  Input,
  Box,
  Heading,
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
  const [friendsNames, setFriendsNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(data: any) {
    try {
      await axios.post(
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
      fetchFriends();
    } catch (err) {
      console.error('Error adding friends:', err);
      setError('User not registered with us or friend already added!');
    }
  }

  const fetchFriends = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem('globalUserId');
      const response = await axios.get(
        `http://127.0.0.1:5000/display/${userId}/friends`,
      );

      const data = response.data;
      if (Object.keys(data).length === 0) {
        setFriendsNames([]);
      } else {
        setFriendsNames(Object.values(data));
      }
    } catch (err) {
      console.error('Error fetching friends:', err);
      setError('Failed to load friends. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

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
          href="/AddFriends"
        >
          Add Friends
        </Link>
        <Link
          color="black"
          textStyle="lg"
          fontWeight="medium"
          margin="18px 35px 0 0"
          href="/SplitExpense"
        >
          Split Expenses
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
          href="https://github.com/LavanyaMiddha/DollarBot2"
        >
          About
        </Link>
        <Link
          color="black"
          textStyle="lg"
          fontWeight="medium"
          margin="18px 35px 0 0"
          href="https://github.com/LavanyaMiddha/DollarBot2"
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
      <Box mt={8}>
        {error && (
          <Text color="red.500" mb={4}>
            {error}
          </Text>
        )}
        {isLoading ? (
          <Text>Loading friends...</Text>
        ) : friendsNames.length > 0 ? (
          <>
            <Heading as="h2" size="lg" mb={4} color="teal.500">
              Friends List
            </Heading>
            <Box as="ul" pl={4} listStyle="disc">
              {friendsNames.map((friend, index) => (
                <Box as="li" key={index} fontSize="md" color="black">
                  {friend}
                </Box>
              ))}
            </Box>
          </>
        ) : (
          <Text>No friends found. Add some to get started!</Text>
        )}
      </Box>
    </Container>
  );
};

export default AddFriends;
