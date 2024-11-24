import React, { useState, useEffect } from "react";
import { Container, Flex, Text, Link } from '@chakra-ui/react';
import axios from "axios";

type NotificationsData = {
  Category: string;
  "Monthly Expense": number;
  "Monthly Budget": number;
  color1: string;
  "Yearly Expense": number;
  "Yearly Budget": number;
  color2: string;
};

const Alerts = () => {
  // Initialize notifications state as an array of `NotificationsData`
  const [notifications, setNotifications] = useState<NotificationsData[]>([]);

  // Fetch notifications from the API
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/add_alerts/alerts/${localStorage.getItem("globalUserId")}`
      );
      setNotifications(response.data); // Assume response.data is an array of `NotificationsData`
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    // Fetch notifications every 5 seconds
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, []);

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
      </Container>
      <h2 style={{fontSize: "30px", fontWeight:"bold", marginBottom:"20px"}}>Notifications</h2>
      <p style={{fontSize: "20px", fontWeight:"bold", marginBottom:"20px"}}> Displaying Statistics for current Month and Year</p>
      <table style={{ background: "White", border: "1px solid black", width: "100%", fontSize: "20px", fontWeight:"bold", borderBlockColor:"black", borderBlockStyle:"dotted", padding: "10px", alignContent:"center"}}>
        <thead>
          <tr>
            <th style={{border: "1px solid black"}}>Category</th>
            <th style={{border: "1px solid black"}}>Monthly Expense</th>
            <th style={{border: "1px solid black"}}>Monthly Budget</th>
            <th style={{border: "1px solid black"}}>Yearly Expense</th>
            <th style={{border: "1px solid black"}}>Yearly Budget</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification, index) => (
            <tr key={index}>
              <td style={{borderLeft: "1px solid black", textAlign:"center"}}>{notification.Category}</td>
              <td style={{borderLeft: "1px solid black", color: notification.color1, textAlign:"center"}}>${notification["Monthly Expense"]}</td>
              <td style={{borderLeft: "1px solid black", color: notification.color1, textAlign:"center"}}>${notification["Monthly Budget"]}</td>
              <td style={{borderLeft: "1px solid black", color: notification.color2, textAlign:"center"}}>${notification["Yearly Expense"]}</td>
              <td style={{borderLeft: "1px solid black", color: notification.color2, textAlign:"center"}}>${notification["Yearly Budget"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Alerts;
