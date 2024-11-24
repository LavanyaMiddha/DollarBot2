import { Container, Flex, Text, Link } from '@chakra-ui/react';
import AddBudgetAnalytics from './AddBudgetAnalytics';

const BudgetAnalytics = () => {
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
        <AddBudgetAnalytics />
      </Container>
    </div>
  );
};

export default BudgetAnalytics;
