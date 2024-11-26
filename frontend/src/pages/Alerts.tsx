import React, { useState, useEffect } from 'react';
import { Container, Flex, Text, Link } from '@chakra-ui/react';
import axios from 'axios';

type NotificationsData = {
  Category: string;
  'Monthly Expense': number;
  'Monthly Budget': number;
  color1: string;
  'Yearly Expense': number;
  'Yearly Budget': number;
  color2: string;
};

const Alerts = () => {
  const [notifications, setNotifications] = useState<NotificationsData[]>([]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/add_alerts/alerts/${localStorage.getItem('globalUserId')}`,
      );
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    
    const interval = setInterval(fetchNotifications, 3000);
    return () => clearInterval(interval); 
  }, []);

  const colorData = [
    { category: 'Over Budget', color: 'red' },
    { category: 'High Expense', color: 'orange' },
    { category: 'Moderate Expense', color: 'purple' },
    { category: 'Low Expense', color: 'green' },
  ];

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
      </Container>
      <h2
        style={{
          fontSize: '25px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: 'red',
        }}
      >
        Alerts
      </h2>
      <p
        style={{
          fontSize: '20px',
          fontWeight: 'Medium',
          marginBottom: '18px',
          fontStyle: 'italic',
        }}
      >
        {' '}
        Displaying Statistics for current Month and Year
      </p>
      <table
        style={{
          background: 'White',
          border: '1px solid black',
          width: '100%',
          fontSize: '20px',
          fontWeight: 'bold',
          borderBlockColor: 'black',
          borderBlockStyle: 'dotted',
          padding: '10px',
          alignContent: 'center',
        }}
      >
        <thead>
          <tr>
            <th style={{ border: '1px solid black' }}>Category</th>
            <th style={{ border: '1px solid black' }}>Monthly Expense</th>
            <th style={{ border: '1px solid black' }}>Monthly Budget</th>
            <th style={{ border: '1px solid black' }}>Yearly Expense</th>
            <th style={{ border: '1px solid black' }}>Yearly Budget</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification, index) => (
            <tr key={index}>
              <td
                style={{ borderLeft: '1px solid black', textAlign: 'center' }}
              >
                {notification.Category}
              </td>
              <td
                style={{
                  borderLeft: '1px solid black',
                  color: notification.color1,
                  textAlign: 'center',
                }}
              >
                ${notification['Monthly Expense']}
              </td>
              <td
                style={{
                  borderLeft: '1px solid black',
                  color: notification.color1,
                  textAlign: 'center',
                }}
              >
                ${notification['Monthly Budget']}
              </td>
              <td
                style={{
                  borderLeft: '1px solid black',
                  color: notification.color2,
                  textAlign: 'center',
                }}
              >
                ${notification['Yearly Expense']}
              </td>
              <td
                style={{
                  borderLeft: '1px solid black',
                  color: notification.color2,
                  textAlign: 'center',
                }}
              >
                ${notification['Yearly Budget']}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table
        style={{
          borderCollapse: 'collapse',
          width: '40%',
          margin: '10px 0',
          border: '1px solid black',
          background: 'White',
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          fontSize: '18px',
        }}
      >
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>
              Category
            </th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Color</th>
          </tr>
        </thead>
        <tbody>
          {colorData.map((item, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                {item.category}
              </td>
              <td
                style={{
                  border: '1px solid black',
                  padding: '8px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: item.color,
                    display: 'inline-block',
                    border: '1px solid #000',
                  }}
                ></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Alerts;
