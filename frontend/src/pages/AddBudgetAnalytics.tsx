import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  Center,
  Container,
  Heading,
  Text,
} from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
  onAddBudgetAnalytics?: (value: boolean) => void;
};
type ChartData = {
  labels: string[];
  values: number[];
};

const Analytics=({ onAddBudgetAnalytics }: Props)=>{

  const [category, setCategory] = useState<string>('Food');
  const [month, setMonth] = useState<string>('1');
  const [year, setYear] = useState<string>('2024');
  const [chartData, setChartData] = useState<ChartData>();

  // Function to fetch budget goals
  const fetchBudgetGoals = () => {
    const userId = localStorage.getItem('globalUserId');
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    axios
      .get(`http://127.0.0.1:5000/budget_analytics/add_analytics/${category}/${year}/${month}/${userId}`)
      .then((resp) => {
        const newData = resp.data
        setChartData(newData);
      })
      .catch((erdr) => {
        console.error('Error fetching budget goals:', Error);
      });
  };

  // Trigger fetch on component mount and when selection changes
  useEffect(() => {
    fetchBudgetGoals();
  }, [category, month, year]);

  const barColors = [
    'rgba(255, 206, 86, 0.2)', // Yellow
    'rgba(75, 192, 192, 0.2)', // Green
    'rgba(153, 102, 255, 0.2)', // Purple
];

const borderColors = [
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
];
  const barChartData = {
    labels: chartData?.labels,
    datasets: [
        {
            label: 'Dataset',
            data: chartData?.values,
            backgroundColor: barColors,
            borderColor: borderColors,
            borderWidth: 1,
        },
    ],
};

const options = {
  responsive: true,
  plugins: {
      legend: {
          position: 'top' as const,
          display: false
      },
      title: {
          display: true,
          text: 'Expenses v/s Budget Goals',
          font:{
            size: 30
          }
      },
  },
  scales: {
    x: {
        grid: {
            color: 'rgba(0, 0, 0, 0.1)', // Grid line color
            backgroundColor: 'white',  // Background color of the grid
        },
        ticks: {
            color: 'black', // X-axis tick color
            font :{
              size : 20
            }
        },
    },
    y: {
        grid: {
            color: 'rgba(0, 0, 0, 0.1)', // Grid line color
            backgroundColor: 'white',  // Background color of the grid
        },
        ticks: {
            color: 'black', // Y-axis tick color
            font :{
              size : 20
            }
        },
    },
},
};

    return(
    <Container background={'#92a8d1'}>
    <Center>
      <Heading fontWeight="bold" marginBottom="8px" color="black">
        View your Budget Analytics!
      </Heading>
    </Center>
    <form>
    <Text
          fontSize="15px"
          fontWeight="bold"
          marginBottom="5px"
          color="black"
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
            marginBottom: '20px',
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
        <div>
            <Text
              fontSize="15px"
              fontWeight="bold"
              marginBottom="5px"
              color="black"
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
              color="black"
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
            <br></br>
            <button onClick={() =>{ setCategory(''); setMonth(''); setYear('')}}>Clear Filter</button>
            </div>
    </form>
    { chartData?.labels.length !=0  ? (
      <div style={{background:"White", marginTop: "30px", padding: "20px"}}>
     <Bar data={barChartData} options={options}/>
     </div>
            ) : (
                <p>No data available.</p>
            )}
    </Container>
      )
}


export default Analytics