import React, { useEffect } from 'react';
import {
  Center,
  Container,
  createListCollection,
  Flex,
  Heading,
  Icon,
  Input,
  Text,
} from '@chakra-ui/react';
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '../components/ui/select';
import { Button } from '../components/ui/button';
import { useForm } from 'react-hook-form';
import { FaDollarSign } from 'react-icons/fa';
import { FaEuroSign } from 'react-icons/fa';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import {
  NumberInputField,
  NumberInputRoot,
} from '../components/ui/number-input';
import axios from 'axios';

type Props = {
  onDeleteExpense?: (value: boolean) => void;
  selectedExpense: string[];
};

// The function fetches the selected recordIDs and sends the list as a DELETE request to the flask server.

const DeleteExpense = ({ onDeleteExpense, selectedExpense }: Props) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(values: any) {
    if (selectedExpense.length >= 1) {
      await axios.delete('http://127.0.0.1:5000/deletebyids', {
        data: {
          user_id: localStorage.getItem('globalUserId'),
          ids_to_delete: selectedExpense,
        },
      });
    }
    await new Promise((r) => setTimeout(r, 2000));
    onDeleteExpense?.(true);
    window.location.reload();
  }

  useEffect(() => {
    console.log('Updated List');
  }, [selectedExpense]);

  return (
    <Container>
      <Center>
        <Heading fontWeight="bold" marginBottom="10px">
          Delete Expenses
        </Heading>
      </Center>
      <Text fontSize="sm" marginBottom="10px" fontWeight="bold" color="teal">
        Select all the transactions that need to be removed.
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Button mt={4} colorPalette="red" loading={isSubmitting} type="submit">
          Delete
        </Button>
      </form>
    </Container>
  );
};

export default DeleteExpense;
