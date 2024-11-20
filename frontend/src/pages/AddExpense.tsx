import React, { useState } from 'react';
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
import type { DatePickerProps } from 'antd';
import { DatePicker, Space } from 'antd';
import {
  NumberInputField,
  NumberInputRoot,
} from '../components/ui/number-input';
import axios from 'axios';

type Props = {
  onAddExpense?: (value: boolean) => void;
};

// This function fetches the date, category and expense value from the text inputs and sends a POST request to the Flask server.

const AddExpense = ({ onAddExpense }: Props) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const [expDate, setExpDate] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('dollar');

  async function onSubmit(data: any) {
    if (expDate != '') {
      axios.post(
        'http://127.0.0.1:5000/add/add_single',
        {
          // Global User ID is set during SignUp/SignIn
          user_id: localStorage.getItem('globalUserId'),
          amount: data.expenseValue,
          date: expDate,
          category: data.expense_category,
          currency: selectedCurrency,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
    await new Promise((r) => setTimeout(r, 2000));
    onAddExpense?.(true);
    window.location.reload();
  }

  return (
    <Container>
      <Center>
        <Heading fontWeight="bold" marginBottom="8px">
          Add Expenses
        </Heading>
      </Center>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Text fontSize="sm" fontWeight="medium" marginBottom="2px">
          Date
        </Text>
        <DatePicker
          size="large"
          style={{ width: '100%', marginBottom: '10px' }}
          onChange={(dateStrings) => {
            setExpDate(String(dateStrings.format('YYYY-MM-DD')));
          }}
        />
        <Text fontSize="sm" fontWeight="medium" marginBottom="2px">
          Category
        </Text>
        <Input
          id="category"
          colorPalette="whiteAlpha"
          marginBottom="10px"
          placeholder="Enter Category"
          {...register('expense_category', {
            required: 'This is required',
            minLength: { value: 3, message: 'Minimum length should be 3' },
          })}
        />
        <Text fontSize="sm" fontWeight="medium" marginBottom="2px">
          Expense Value
        </Text>
        <Flex flexDir="row">
          <SelectRoot
            collection={currencies}
            size="md"
            width="65px"
            variant="subtle"
            margin="0 5px 0px 0"
            defaultValue={['dollar']}
            onValueChange={(value) => {
              setSelectedCurrency(value.value[0]);
            }}
          >
            <SelectTrigger>
              <SelectValueText color="teal" placeholder="Select Action" />
            </SelectTrigger>
            <SelectContent>
              {currencies.items.map((currency) => (
                <SelectItem color="teal" item={currency} key={currency.value}>
                  {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
          <NumberInputRoot
            size="md"
            defaultValue="0"
            marginBottom="10px"
            min={0}
            height="100%"
          >
            <NumberInputField
              {...register('expenseValue', {
                required: 'This is required',
              })}
            />
          </NumberInputRoot>
        </Flex>
        <Button mt={4} colorScheme="teal" loading={isSubmitting} type="submit">
          Add
        </Button>
      </form>
    </Container>
  );
};

const currencies = createListCollection({
  items: [
    {
      label: (
        <Icon>
          <FaDollarSign />
        </Icon>
      ),
      value: 'dollar',
    },
    {
      label: (
        <Icon>
          <FaEuroSign />
        </Icon>
      ),
      value: 'euro',
    },
    {
      label: (
        <Icon>
          <FaIndianRupeeSign />
        </Icon>
      ),
      value: 'rupee',
    },
  ],
});

export default AddExpense;
