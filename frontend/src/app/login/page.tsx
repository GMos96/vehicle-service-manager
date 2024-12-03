"use client";

import { Card, Flex, Heading, HStack, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { LoginDTO } from "@/app/login/types";
import { PasswordInput } from "@/components/ui/password-input";
import { login } from "@/app/login/login.action";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthDispatchContext } from "@/core/context/auth.context";

export default function Login() {
  const { register, handleSubmit } = useForm<LoginDTO>();
  const setAuth = useContext(AuthDispatchContext);

  const onSubmit = handleSubmit((data) =>
    login(data).then(() => {
      setAuth(true);
      router.push("/vehicles");
    }),
  );
  const router = useRouter();

  return (
    <Flex gap={4} align="center" justify="center">
      <Stack gap={4} minW="2xl">
        <Heading mx="auto">Welcome back!</Heading>
        <Card.Root>
          <Card.Body>
            <form className="vsm-form" onSubmit={onSubmit}>
              <Field label="Email Address">
                <Input {...register("emailAddress")}></Input>
              </Field>
              <Field label="Password">
                <PasswordInput {...register("password")}></PasswordInput>
              </Field>
              <HStack justify="end" gap={4}>
                <Button type="submit">Log In</Button>
                <Button type="submit" onClick={() => router.push("/")}>
                  Cancel
                </Button>
              </HStack>
            </form>
          </Card.Body>
        </Card.Root>
      </Stack>
    </Flex>
  );
}
