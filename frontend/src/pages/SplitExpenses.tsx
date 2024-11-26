import {
  Container,
  Flex,
  Text,
  Link,
  createListCollection,
  Heading,
  Input,
  Icon, 
  Center
} from '@chakra-ui/react';
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '../components/ui/select';
import { FaDollarSign } from 'react-icons/fa';
import { FaEuroSign } from 'react-icons/fa';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import {
  NumberInputField,
  NumberInputRoot,
} from '../components/ui/number-input';
import { Button } from '../components/ui/button';
import { DatePicker, Space } from 'antd';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

type Props = {
  onSplitExpense?: (value: boolean) => void;
};

const SplitExpenses = ({ onSplitExpense }: Props) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const [expDate, setExpDate] = useState('');
  const [category, setCategory] = useState<string>('Food');
  const [selectedCurrency, setSelectedCurrency] = useState('dollar');

  async function onSubmit(data: any) {
    if (expDate != '') {
      axios.post(
        'http://127.0.0.1:5000/split_expense/add_expense',
        {
          // Global User ID is set during SignUp/SignIn
          user_id: localStorage.getItem('globalUserId'),
          amount: data.expenseValue,
          date: expDate,
          category: category,
          currency: selectedCurrency,
          friends: data.friends,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
    await new Promise((r) => setTimeout(r, 2000));
    onSplitExpense?.(true);
    window.location.reload();
  }
  return (
    <Container>
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
        <Container background={'Black'} marginTop={'50px'}>
      <Center>
        <Heading fontWeight="bold" marginBottom="8px" color="White">
          Add Expenses
        </Heading>
      </Center>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Text
          fontSize="sm"
          fontWeight="medium"
          marginBottom="2px"
          color="White"
        >
          Date
        </Text>
        <DatePicker
          size="large"
          style={{ width: '100%', marginBottom: '15px' }}
          onChange={(dateStrings) => {
            setExpDate(String(dateStrings.format('YYYY-MM-DD')));
          }}
        />
        <Text
          fontSize="sm"
          fontWeight="medium"
          marginBottom="15px"
          color="White"
        >
          Category
        </Text>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            marginTop: '5px',
            marginBottom: '5px',
            height: '40px',
            width: '130px',
          }}
        >
          <option value="Food">Food</option>
          <option value="Groceries">Groceries</option>
          <option value="Utilities">Utilities</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Miscellaneous">Miscellaneous</option>
          <option value="Entertainment">Entertainment</option>
        </select>
        <Text
          fontSize="sm"
          fontWeight="medium"
          marginBottom="15px"
          color="White"
          marginTop={'10px'}
        >
          {' '}
          Friends
        </Text>
        <Input
          id="friends"
          background={'white'}
          colorPalette="Black"
          marginBottom="10px"
          placeholder="Enter Comma Separated list of friends"
          {...register('friends', {
            required: 'This is required',
          })}
        />
        <Text
          fontSize="sm"
          fontWeight="medium"
          marginBottom="15px"
          color="White"
        >
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
            background={'white'}
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
export default SplitExpenses;
