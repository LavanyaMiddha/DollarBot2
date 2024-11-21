import axios from 'axios';
import { useState, useEffect } from 'react';
import { Container, Flex, Text, Link } from '@chakra-ui/react';
import AddBudgetGoal from './AddBudgetGoals';

function retCurrencySymbol(currency: string) {
  switch (currency) {
    case 'dollar':
      return '$';
    case 'euro':
      return '€';
    case 'rupee':
      return '₹';
    default:
      return '$';
  }
}

const BudgetGoal = () => {
  const [selection, setSelection] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);

  // Function to fetch budget goals
  const fetchBudgetGoals = () => {
    const userId = localStorage.getItem('globalUserId');
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    axios
      .get(`http://127.0.0.1:5000/display/budget/${userId}`)
      .then((resp) => {
        const newData = resp.data.map((item: any, index: number) => ({
          id: index,
          budget_amount:
            retCurrencySymbol(item.expense_currency.trim()) +
            item.budget_amount,
          budget_category: item.budget_category,
          budget_date: item.budget_date,
          budget_type: item.budget_type,
        }));
        setExpenses(newData);
      })
      .catch((error) => {
        console.error('Error fetching budget goals:', error);
      });
  };

  // Trigger fetch on component mount and when selection changes
  useEffect(() => {
    fetchBudgetGoals();
  }, [selection]);

  // Callback for adding a new budget goal
  const handleBudget = () => {
    fetchBudgetGoals();
  };

  return (
    <div>
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
            href="/BudgetGoals"
          >
            Budget Goals
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
        <br />
        <br />
        <br />
        {/* AddBudgetGoal triggers handleBudget on goal addition */}
        <AddBudgetGoal onAddBudgetGoal={handleBudget} />
        <div style={{ marginTop: '20px' }}>
          <Text fontSize="xl" fontWeight="bold" marginBottom="10px">
            Budget Goals
          </Text>
          {expenses.length > 0 ? (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                marginTop: '10px',
              }}
            >
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>
                    Amount
                  </th>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>
                    Category
                  </th>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>
                    Goal Type
                  </th>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td style={{ padding: '8px' }}>{expense.budget_amount}</td>
                    <td style={{ padding: '8px' }}>{expense.budget_category}</td>
                    <td style={{ padding: '8px' }}>{expense.budget_type}</td>
                    <td style={{ padding: '8px' }}>{expense.budget_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Text>No budget goals to display.</Text>
          )}
        </div>
      </Container>
    </div>
  );
};

export default BudgetGoal;
