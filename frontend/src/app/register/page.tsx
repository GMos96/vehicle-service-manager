"use client";

import {
  Card,
  Center,
  Flex,
  Heading,
  HStack,
  Input,
  Stack,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { registerUser } from "@/app/register/register.action";
import { CreateUserDTO } from "@/app/register/types";
import { useRouter } from "next/navigation";
import { FaUserPlus } from "react-icons/fa";
import Link from "@/components/ui/link";
import { useState } from "react";

export default function SignupCard() {
  const { register, handleSubmit } = useForm<CreateUserDTO>();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const router = useRouter();
  const onSubmit = handleSubmit((data) => {
    registerUser(data).then(
      () => {},
      (error) => {
        setErrors(error);
      },
    );
  });

  return (
    <Stack>
      <Card.Root maxW="xl" minW="lg" mx="auto">
        <Card.Body gap="4">
          <Stack gap={4}>
            <Center>
              <FaUserPlus size={32} color="lightblue"></FaUserPlus>
            </Center>
            <Flex direction="column" justify="center" align="center" gap={2}>
              <Heading as="h1">Create An Account</Heading>
              <Heading as="h4" size="xs">
                Already have an account? <Link href="/login">Sign In</Link>
              </Heading>
            </Flex>
            <form onSubmit={onSubmit} className={"d-flex flex-column gap"}>
              <HStack gap={4} width="full">
                <Field label="First Name" errors={errors["firstName"]}>
                  <Input {...register("firstName")}></Input>
                </Field>
                <Field label="Last Name" errors={errors["lastName"]}>
                  <Input {...register("lastName")}></Input>
                </Field>
              </HStack>
              <Field
                label="Email Address"
                errors={errors["emailAddress"]}
                required
              >
                <Input {...register("emailAddress")}></Input>
              </Field>
              <Field label="Password" errors={errors["password"]} required>
                <PasswordInput {...register("password")}></PasswordInput>
              </Field>
              <Flex justify="end" gap="4">
                <Button type="submit">Create Account</Button>
                <Button onClick={() => router.push("/")}>Cancel</Button>
              </Flex>
            </form>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Stack>
  );
}
