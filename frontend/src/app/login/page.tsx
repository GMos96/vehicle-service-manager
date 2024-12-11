"use client";

import { Card, Center, Heading, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { LoginDTO } from "@/app/login/types";
import { PasswordInput } from "@/components/ui/password-input";
import { login } from "@/app/login/login.action";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthDispatchContext } from "@/core/context/auth.context";
import { FaCircleUser } from "react-icons/fa6";
import Link from "@/components/ui/link";

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
    <Stack gap={4} className="prelogin-background">
      <Card.Root maxW="xl" minW="lg" mx="auto">
        <Card.Body>
          <Stack gap={4}>
            <Center>
              <FaCircleUser size={32} color="lightblue"></FaCircleUser>
            </Center>
            <Center>
              <Heading>Welcome Back</Heading>
            </Center>
            <Center>
              <Heading as="h4" size="xs">
                Don't have an account? <Link href="/register">Create one!</Link>
              </Heading>
            </Center>
            <form className="vsm-form" onSubmit={onSubmit}>
              <Field label="Email Address">
                <Input {...register("emailAddress")}></Input>
              </Field>
              <Field label="Password">
                <PasswordInput {...register("password")}></PasswordInput>
              </Field>
              <Button type="submit">Log In</Button>
            </form>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Stack>
  );
}
