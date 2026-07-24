"use client";

import {
  Card,
  Center,
  Flex,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { PasswordInput, PasswordStrengthMeter } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { registerUser } from "@/app/register/register.action";
import { CreateUserDTO } from "@/app/register/types";
import { useRouter } from "next/navigation";
import { FaUserPlus } from "react-icons/fa";
import Link from "@/components/ui/link";
import { useState } from "react";
import { ValidationErrors } from "@/types/validation-error";
import { showErrorToast } from "@/core/errors";
import { getPasswordStrength } from "@/util/password-strength";
import { fieldErrorsToValidationErrors } from "@/util/form-errors";

export default function SignupCard() {
  const { register, handleSubmit, formState, watch } = useForm<CreateUserDTO>();
  const [serverErrors, setServerErrors] = useState<ValidationErrors>([]);
  const password = watch("password");

  const errors = [
    ...fieldErrorsToValidationErrors(formState.errors),
    ...serverErrors,
  ];

  const router = useRouter();
  const onSubmit = handleSubmit((data) => {
    registerUser(data).then(
      () => {
        router.push("/login");
      },
      (error: ValidationErrors | unknown) => {
        if (Array.isArray(error)) {
          setServerErrors(error);
        } else {
          showErrorToast(error);
        }
      },
    );
  });

  return (
    <Flex minH="calc(100dvh - 80px)" align="center" justify="center" py={10} px={4}>
      <Card.Root
        w="full"
        maxW={{ base: "sm", md: "md", lg: "xl", xl: "max" }}
        minW={{ md: "sm", xl: "lg" }}
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border.hairline"
        borderTopWidth="2px"
        borderTopColor="accent.solidColor"
        borderRadius="md"
      >
        <Card.Body p={{ base: 6, md: 8 }} gap="4">
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
                <FaUserPlus size={24} color="var(--chakra-colors-accent-solidColor)" />
              </Flex>
            </Center>
            <Stack gap={1.5} textAlign="center">
              <Heading fontFamily="heading" fontSize="2xl">
                Create an account
              </Heading>
              <Text fontSize="sm" color="fg.subtle">
                Already have an account? <Link href="/login">Sign in</Link>
              </Text>
            </Stack>
            <form onSubmit={onSubmit} className="vsm-form">
              <HStack
                gap={4}
                width="full"
                flexWrap={{ base: "wrap", lg: "nowrap" }}
              >
                <Field label="First Name" errors={errors} field="firstName">
                  <Input {...register("firstName")} data-testid="firstName"></Input>
                </Field>
                <Field label="Last Name" errors={errors} field="lastName">
                  <Input {...register("lastName")} data-testid="lastName"></Input>
                </Field>
              </HStack>
              <Field
                label="Email Address"
                errors={errors}
                required
                field="emailAddress"
              >
                <Input
                  type="email"
                  inputMode="email"
                  {...register("emailAddress", { required: "Email is required" })}
                  data-testid="email"
                ></Input>
              </Field>
              <Field label="Password" errors={errors} required field="password">
                <PasswordInput
                  {...register("password", { required: "Password is required" })}
                  data-testid="password"
                ></PasswordInput>
                {password && (
                  <PasswordStrengthMeter
                    value={getPasswordStrength(password)}
                    mt={1}
                  />
                )}
              </Field>
              <Flex justify="end" gap="4">
                <Button variant="outline" onClick={() => router.push("/")} data-testid="cancelButton">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={formState.isSubmitting}
                  data-testid="registerButton"
                >
                  Create Account
                </Button>
              </Flex>
            </form>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Flex>
  );
}
