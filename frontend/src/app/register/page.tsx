"use client";

import { Card, Flex, Heading, HStack, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { registerUser } from "@/app/register/register.action";
import { CreateUserDTO } from "@/app/register/types";
import { useRouter } from "next/navigation";

export default function SignupCard() {
  const { register, handleSubmit } = useForm<CreateUserDTO>();

  const router = useRouter();
  const onSubmit = handleSubmit((data) => registerUser(data));

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack gap={4} maxW={"2xl"} flexGrow="1">
        <Heading mx={"auto"} py={6} px={6}>
          Create An Account
        </Heading>
        <Card.Root>
          <Card.Body gap="4">
            <form onSubmit={onSubmit} className={"d-flex flex-column gap"}>
              <HStack gap={4} width="full">
                <Field label="First Name">
                  <Input {...register("firstName")}></Input>
                </Field>
                <Field label="Last Name">
                  <Input {...register("lastName")}></Input>
                </Field>
              </HStack>
              <Field label="Email Address">
                <Input {...register("emailAddress")}></Input>
              </Field>
              <Field label="Password">
                <PasswordInput {...register("password")}></PasswordInput>
              </Field>
              <Flex justify="end" gap="4">
                <Button type="submit">Create Account</Button>
                <Button onClick={() => router.push("/")}>Cancel</Button>
              </Flex>
            </form>
          </Card.Body>
        </Card.Root>
      </Stack>
    </Flex>
  );
}
