"use client";

import { Card, Center, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react";
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
  const router = useRouter();

  const onSubmit = handleSubmit((data) =>
    login(data).then(() => {
      setAuth(true);
      router.push("/vehicles");
    }),
  );

  return (
    <Flex minH="calc(100dvh - 80px)" align="center" justify="center" py={10}>
      <Card.Root
        maxW={{ base: "md", xl: "xl" }}
        minW={{ base: "sm", xl: "lg" }}
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border.hairline"
        borderTopWidth="2px"
        borderTopColor="accent.solidColor"
        borderRadius="md"
      >
        <Card.Body p={{ base: 6, md: 8 }}>
          <Stack gap={5}>
            <Center>
              <Flex
                w="56px"
                h="56px"
                align="center"
                justify="center"
                borderRadius="full"
                borderWidth="1px"
                borderColor="accent.solidColor"
                bg="bg.canvas"
              >
                <FaCircleUser size={26} color="var(--chakra-colors-accent-solidColor)" />
              </Flex>
            </Center>
            <Stack gap={1.5} textAlign="center">
              <Heading fontFamily="heading" fontSize="2xl">
                Welcome back
              </Heading>
              <Text fontSize="sm" color="fg.subtle">
                Don&apos;t have an account? <Link href="/register">Create one</Link>
              </Text>
            </Stack>
            <form className="vsm-form" onSubmit={onSubmit}>
              <Field label="Email Address">
                <Input {...register("emailAddress")}></Input>
              </Field>
              <Field label="Password">
                <PasswordInput {...register("password")}></PasswordInput>
              </Field>
              <Button type="submit" w="full">
                Log In
              </Button>
            </form>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Flex>
  );
}
