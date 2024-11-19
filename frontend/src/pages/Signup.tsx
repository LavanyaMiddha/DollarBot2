import { Button } from "../components/ui/button";
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
  Icon,
  Heading,
} from "@chakra-ui/react";
import { Field } from "../components/ui/field";
import { PasswordInput } from "../components/ui/password-input";
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "../components/ui/tooltip";
import { FaInfoCircle } from "react-icons/fa";

const Signup = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const [visible, setVisible] = useState(false);
  const [importing, setImporting] = useState(true);
  let navigate = useNavigate();

  // user_id can be null which means the user doesn't want to import data from telegram.
  // If the user_id is specified it means that the user wants to import their telegram dollarbot data.
  // This user_id will be set as their telegram_id in the database
  async function onSubmit(data: any) {
    axios
      .post(
        "http://127.0.0.1:5000/register",
        {
          username: data.username,
          password: data.password,
          user_id: data.user_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((resp) => {
        // globalUserID is set by fetching it from the response after login
        localStorage.setItem("globalUserId", resp.data.user_id);
        navigate("/home");
      })
      .catch((error) => {
        alert("Login Failed. Username/Password is wrong!");
        console.log(error.message);
      });
  }

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
          >
            Sign In
          </Link>
          <Link
            color="black"
            textStyle="lg"
            fontWeight="medium"
            margin="18px 35px 0 0"
          >
            About
          </Link>
          <Link
            color="black"
            textStyle="lg"
            fontWeight="medium"
            margin="18px 35px 0 0"
          >
            Help
          </Link>
        </Flex>
      </Container>
      <AbsoluteCenter alignContent="center" axis="both">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card.Root maxW="sm" margin="0 100" colorPalette="teal" shadow="lg">
            <Card.Header>
              <Card.Title>Sign up</Card.Title>
              <Card.Description>
                Fill in the form below to create an account
              </Card.Description>
            </Card.Header>
            <Card.Body>
              <Stack gap="4" w="full">
                <Field label="Email">
                  <Input
                    {...register("username", {
                      required: "This is required",
                    })}
                  />
                </Field>
                <Field label="Password">
                  <PasswordInput
                    visible={visible}
                    onVisibleChange={setVisible}
                    {...register("password", {
                      required: "This is required",
                    })}
                  />
                </Field>
                <Link
                  href="/signin"
                  colorScheme="teal"
                  fontSize="sm"
                  fontWeight="medium"
                >
                  Already Have An Account?
                </Link>
                <Flex>
                  <Link
                    colorScheme="teal"
                    fontSize="sm"
                    fontWeight="medium"
                    onClick={() => {
                      setImporting(!importing);
                    }}
                    margin="0 10px 0 0"
                  >
                    Importing Data from Telegram?
                  </Link>
                  <Tooltip
                    content={
                      <>
                        <Text
                          fontSize="md"
                          fontWeight="bold"
                          justifyContent="center"
                        >
                          How to fetch your UserID from Dollar Bot?
                        </Text>
                        <br />
                        1. To find your UserID go to the telegram chat with
                        Dollar Bot. <br /> 2. Type the command{" "}
                        <strong>/reqUserID</strong> and copy-paste the contents
                        of the reply in the userID field to import your data!{" "}
                      </>
                    }
                    interactive
                  >
                    <Icon padding="3px 0 0 0">
                      <FaInfoCircle />
                    </Icon>
                  </Tooltip>
                </Flex>
                <Field label="Enter userID" hidden={importing}>
                  <Input hidden={importing} {...register("user_id")} />
                </Field>
              </Stack>
            </Card.Body>
            <Card.Footer justifyContent="flex-end">
              <Button variant="solid" loading={isSubmitting} type="submit">
                Sign Up
              </Button>
            </Card.Footer>
          </Card.Root>
        </form>
      </AbsoluteCenter>
    </div>
  );
};

export default Signup;
