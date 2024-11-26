import React, { useEffect, useState } from 'react';
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
import type { DatePickerProps } from 'antd';
import { DatePicker, Space } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

type Props = {
  onEditExpense?: (value: boolean) => void;
  selectedExpense: string[];
};

type expenseProps = {
  expense_date: string;
  expense_category: string;
  expense_amount: string;
  expense_currency: string;
};

// This function fetches the date, category and expense value from the text inputs and
// sends a POST request to the Flask server to edit an existing record's details.

const EditExpense = ({ onEditExpense, selectedExpense }: Props) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  var date = new Date();
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  var MyDateString: string = date.toISOString().split('T')[0];

  const [expDate, setExpDate] = useState(MyDateString);
  const [expenseValue, setExpenseValue] = useState('0');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [oldData, setOldData] = useState<expenseProps>({
    expense_amount: '0',
    expense_category: '',
    expense_date: MyDateString,
    expense_currency: 'dollar',
  });

  async function onSubmit(data: any) {
    if (selectedExpense.length == 1) {
      await axios.post(
        'http://127.0.0.1:5000/edit_cost',
        {
          user_id: localStorage.getItem('globalUserId'),
          new_cost: expenseValue,
          selected_data: [
            'Date=' + oldData.expense_date,
            'Category=' + oldData.expense_category,
            'Amount=' + oldData.expense_amount,
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      // Since we allow the user to change any part of the transaction we make the calls for date, value and category.
      await axios.post(
        'http://127.0.0.1:5000/edit_date',
        {
          user_id: localStorage.getItem('globalUserId'),
          new_date: expDate,
          selected_data: [
            'Date=' + oldData.expense_date,
            'Category=' + oldData.expense_category,
            'Amount=' + oldData.expense_amount,
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      await axios.post(
        'http://127.0.0.1:5000/edit_category',
        {
          user_id: localStorage.getItem('globalUserId'),
          new_category: expenseCategory,
          selected_data: [
            'Date=' + oldData.expense_date,
            'Category=' + oldData.expense_category,
            'Amount=' + oldData.expense_amount,
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
    setOldData({
      expense_amount: expenseValue,
      expense_category: expenseCategory,
      expense_date: expDate,
      expense_currency: oldData.expense_currency,
    });
    await new Promise((r) => setTimeout(r, 2000));
    onEditExpense?.(true);
    window.location.reload();
  }

  useEffect(() => {
    if (selectedExpense.length == 1) {
      axios
        .get(
          `http://127.0.0.1:5000/display/${localStorage.getItem(
            'globalUserId',
          )}`,
        )
        .then(function (resp) {
          for (let i = 0; i < resp.data.length; i++) {
            var expenseData: expenseProps = {
              expense_amount: '0',
              expense_category: '',
              expense_date: MyDateString,
              expense_currency: 'dollar',
            };
            if (i == parseInt(selectedExpense[0])) {
              expenseData = {
                expense_amount: resp.data[i]['expense_amount'],
                expense_category: resp.data[i]['expense_category'],
                expense_date: resp.data[i]['expense_date'],
                expense_currency: resp.data[i]['expense_currency'],
              };
              if (selectedExpense.length == 1) {
                setOldData(expenseData);
                setExpenseValue(expenseData.expense_amount);
                setExpenseCategory(expenseData.expense_category);
                setExpDate(expenseData.expense_date);
              }
            }
          }
        });
    } else {
      setExpDate(MyDateString);
      setExpenseCategory('');
      setExpenseValue('0');
    }
  }, [selectedExpense]);

  return (
    <Container>
      <Center>
        <Heading fontWeight="bold" marginBottom="10px">
          Edit Expenses
        </Heading>
      </Center>
      <Text fontSize="sm" marginBottom="10px" fontWeight="bold" color="teal">
        Select one transaction from the table to edit.
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Text fontSize="sm" fontWeight="medium" marginBottom="2px">
          Edit Date
        </Text>
        <DatePicker
          size="large"
          value={dayjs(expDate, 'YYYY-MM-DD')}
          style={{ width: '100%', marginBottom: '10px' }}
          onChange={(dateStrings) => {
            if (dateStrings != null) {
              setExpDate(String(dateStrings.format('YYYY-MM-DD')));
            }
          }}
        />
        <Text fontSize="sm" fontWeight="medium" marginBottom="2px">
          Edit Category
        </Text>
        <Input
          id="category"
          marginBottom="10px"
          placeholder="Enter Category"
          value={expenseCategory}
          background={'white'}
          onChange={(e: any) => {
            setExpenseCategory(String(e.target.value));
          }}
        />
        <Text fontSize="sm" fontWeight="medium" marginBottom="2px">
          Edit Expense Value
        </Text>
        <Flex flexDir="row">
          <SelectRoot
            collection={currencies}
            size="md"
            width="65px"
            variant="subtle"
            margin="0 5px 0px 0"
            value={[oldData.expense_currency.trim()]}
            disabled
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
            onValueChange={({ value }) => {
              setExpenseValue(value);
            }}
          >
            <NumberInputField value={expenseValue} />
          </NumberInputRoot>
        </Flex>
        <Button mt={4} colorScheme="teal" loading={isSubmitting} type="submit">
          Edit
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

export default EditExpense;
