import axios from 'axios';
import { useState } from 'react';
import {
  Center,
  Container,
  createListCollection,
  Flex,
  Heading,
  Icon,
  Text,
} from '@chakra-ui/react';
import {
  SelectContent,
  SelectItem,
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

type Props = {
  onAddBudgetGoal?: (value: boolean) => void;
};

const Goals = ({ onAddBudgetGoal }: Props) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const [goalType, setGoalType] = useState<string>('Short-Term');
  const [category, setCategory] = useState<string>('Food');
  const [year, setYear] = useState<string>('2024');
  const [month, setMonth] = useState<string>('1');
  const [selectedCurrency, setSelectedCurrency] = useState('dollar');
  async function onSubmit(data: any) {
    if (goalType != '') {
      axios.post(
        'http://127.0.0.1:5000/add_budget/add_single',
        {
          // Global User ID is set during SignUp/SignIn
          user_id: localStorage.getItem('globalUserId'),
          amount: data.budgetValue,
          goal_type: goalType,
          category: category,
          currency: selectedCurrency,
          year: year,
          month: month,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
    await new Promise((r) => setTimeout(r, 2000));
    onAddBudgetGoal?.(true);
    window.location.reload();
  }

  const renderSwitch = (goalType: string) => {
    switch (goalType) {
      case 'Long-Term':
        return (
          <div>
            <Text
              fontSize="15px"
              fontWeight="bold"
              marginBottom="5px"
              color="Black"
              marginTop="20px"
              marginLeft="0px"
            >
              Year
            </Text>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              style={{
                marginTop: '5px',
                marginBottom: '5px',
                height: '40px',
                width: '130px',
              }}
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        );
      case 'Short-Term':
        return (
          <div>
            <Text
              fontSize="15px"
              fontWeight="bold"
              marginBottom="5px"
              color="Black"
              marginTop="20px"
              marginLeft="0px"
            >
              Year
            </Text>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              style={{
                marginTop: '5px',
                marginBottom: '5px',
                height: '40px',
                width: '130px',
              }}
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
            <Text
              fontSize="15px"
              fontWeight="bold"
              marginBottom="5px"
              color="Black"
              marginTop="20px"
              marginLeft="0px"
            >
              Month
            </Text>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              style={{
                marginTop: '5px',
                marginBottom: '5px',
                height: '40px',
                width: '130px',
              }}
            >
              <option value="1">Jan</option>
              <option value="2">Feb</option>
              <option value="3">Mar</option>
              <option value="4">Apr</option>
              <option value="5">May</option>
              <option value="6">Jun</option>
              <option value="7">Jul</option>
              <option value="8">Aug</option>
              <option value="9">Sep</option>
              <option value="10">Oct</option>
              <option value="11">Nov</option>
              <option value="12">Dec</option>
            </select>
          </div>
        );
    }
  };
  return (
    <Container background={'#c2d4dd'}>
      <Center>
        <Heading fontWeight="bold" marginBottom="8px" color="Black">
          Set Your Financial Goals!
        </Heading>
      </Center>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Text
          fontSize="15px"
          fontWeight="bold"
          marginBottom="5px"
          color="Black"
          marginTop="20px"
        >
          Goal Type
        </Text>
        <select
          id="goalType"
          value={goalType}
          onChange={(e) => setGoalType(e.target.value)}
          style={{
            marginTop: '5px',
            marginBottom: '5px',
            height: '40px',
            width: '130px',
          }}
        >
          <option value="Short-Term">Short-Term</option>
          <option value="Long-Term">Long-Term</option>
        </select>
        {renderSwitch(goalType)}
        <Text
          fontSize="15px"
          fontWeight="bold"
          marginBottom="5px"
          color="Black"
          marginTop="20px"
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
          fontSize="15px"
          fontWeight="bold"
          marginTop="10px"
          marginBottom="15px"
          color="Black"
        >
          Budget Value
        </Text>
        <Flex flexDir="row">
          <SelectRoot
            collection={currencies}
            size="md"
            width="65px"
            variant="subtle"
            margin="0 5px 0px 0"
            background={'white'}
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

export default Goals;
