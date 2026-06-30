"use client";

import { ChakraProvider, Theme } from "@chakra-ui/react";
import { ReactNode } from "react";
import { system } from "@/app/theme";

export default function Provider(props: { children: ReactNode }) {
  return (
    <ChakraProvider value={system} {...props}>
      <Theme appearance="dark">{props.children}</Theme>
    </ChakraProvider>
  );
}
