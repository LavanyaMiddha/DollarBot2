import { Button } from '../components/ui/button';
import {
  Card,
  Container,
  AbsoluteCenter,
  HStack,
  Input,
  Stack,
  Center,
  Flex,
  Text,
  Link,
} from '@chakra-ui/react';
import { Field } from '../components/ui/field';
import { PasswordInput } from '../components/ui/password-input';
import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const [visible, setVisible] = useState(false);
  let navigate = useNavigate();

  async function onSubmit(data: any) {
    axios
      .post(
        'http://127.0.0.1:5000/login',
        {
          username: data.username,
          password: data.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then((resp) => {
        localStorage.setItem('globalUserId', resp.data.user_id);
        navigate('/home');
      })
      .catch((error) => {
        alert('Login Failed. Username/Password is wrong!');
        console.log(error.message);
      });
  }

  return (
    <div>
      <Container>
        <Flex justifyContent="flex-start">
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
            href="/signup"
            fontWeight="medium"
            margin="18px 35px 0 0"
          >
            Sign Up
          </Link>
          <Link
            color="black"
            textStyle="lg"
            fontWeight="medium"
            margin="18px 35px 0 0"
            href="https://github.com/LavanyaMiddha/DollarBot2"
          >
            About
          </Link>
          <Link
            color="black"
            textStyle="lg"
            fontWeight="medium"
            margin="18px 35px 0 0"
            href="https://github.com/LavanyaMiddha/DollarBot2"
          >
            Help
          </Link>
        </Flex>
      </Container>
      <AbsoluteCenter alignContent="center" axis="both">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card.Root maxW="md" margin="0 100" colorPalette="teal" shadow="lg">
            <Card.Header>
              <Card.Title>Sign In</Card.Title>
              <Card.Description marginRight="50px">
                Log into your Dollar Bot Account!
              </Card.Description>
            </Card.Header>
            <Card.Body>
              <Stack gap="4" w="full">
                <Field label="Email">
                  <Input
                    {...register('username', {
                      required: 'This is required',
                    })}
                  />
                </Field>
                <Field label="Password">
                  <PasswordInput
                    visible={visible}
                    onVisibleChange={setVisible}
                    {...register('password', {
                      required: 'This is required',
                    })}
                  />
                </Field>
                <Link
                  href="/signup"
                  colorScheme="teal"
                  fontSize="sm"
                  fontWeight="medium"
                >
                  Create a new account
                </Link>
              </Stack>
            </Card.Body>
            <Card.Footer justifyContent="flex-end">
              <Button variant="solid" loading={isSubmitting} type="submit">
                Sign in
              </Button>
            </Card.Footer>
          </Card.Root>
        </form>
      </AbsoluteCenter>
    </div>
  );
};

export default Signin;
