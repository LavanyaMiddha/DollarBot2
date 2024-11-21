import axios from 'axios';
import { useState } from 'react';
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

type Props = {
    onAddExpense?: (value: boolean) => void;
  };

function retCurrencySymbol(currency: string) {
    var result = '';
    switch (currency) {
      case 'dollar':
        result = '$';
        break;
      case 'euro':
        result = '€';
        break;
      case 'rupee':
        result = '₹';
        break;
      default:
        return '$';
    }
    return result;
  }



const Goals =( {onAddExpense }: Props)=>{
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
      } = useForm();
    const [expenses, setExpenses] = useState([{}]);
    const [goalType, setGoalType] = useState<string>('Short-Term');
    const handleExpense = (value: boolean) => {
        if (value) {
          var newData: any[] = [];
          axios
            .get(
              `http://127.0.0.1:5000/display/${localStorage.getItem(
                'globalUserId',
              )}`,
            )
            .then(function (resp) {
              for (let i = 0; i < resp.data.length; i++) {
                var expenseData = {
                  expense_amount:
                    retCurrencySymbol(resp.data[i]['expense_currency'].trim()) +
                    resp.data[i]['expense_amount'],
                  expense_category: resp.data[i]['expense_category'],
                  expense_date: resp.data[i]['expense_date'],
                };
                newData.push(expenseData);
              }
              setExpenses(newData);
            });
        }
      };
      const [expDate, setExpDate] = useState('');
      const [selectedCurrency, setSelectedCurrency] = useState('dollar');
      async function onSubmit(data: any) {
        if (expDate != '') {
          axios.post(
            'http://127.0.0.1:5000/add_budget/add_single',
            {
              // Global User ID is set during SignUp/SignIn
              user_id: localStorage.getItem('globalUserId'),
              amount: data.budgetValue,
              date: expDate,
              goal_type: goalType,
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
    return(
        <Container background={"black"}>
        <Center>
          <Heading fontWeight="bold" marginBottom="8px" color="White">
            Set Your Financial Goals!
          </Heading>
        </Center>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Text fontSize="sm" fontWeight="medium" marginBottom="2px" color="White">
            Date
          </Text>
          <DatePicker
            size="large"
            style={{ width: '100%', marginBottom: '15px' }}
            onChange={(dateStrings) => {
              setExpDate(String(dateStrings.format('YYYY-MM-DD')));
            }}
          />
          <Text fontSize="sm" fontWeight="medium" marginBottom="15px" color="White">
            Goal Type
          </Text>
          <select id="goalType" value={goalType} onChange={(e) => setGoalType(e.target.value)}style={{marginTop:"10px", marginBottom:"5px"}}>
            <option value="Short-Term">Short-Term</option>
            <option value="Long-Term">Long-Term</option>
          </select>
          <Text fontSize="sm" fontWeight="medium"  marginTop = "10px"marginBottom="15px" color="White">
            Budget Value
          </Text>
          <Flex flexDir="row">
            <SelectRoot
              collection={currencies}
              size="md"
              width="65px"
              variant="subtle"
              margin="0 5px 0px 0"
              background={"white"}
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
              background={"white"}
            >
              <NumberInputField
                {...register('budgetValue', {
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

export default Goals
