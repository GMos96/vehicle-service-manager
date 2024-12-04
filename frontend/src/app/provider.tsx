"use client";

import { ChakraProvider, defaultSystem, Theme } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function Provider(props: { children: ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem} {...props}>
      <Theme appearance="dark">{props.children}</Theme>
    </ChakraProvider>
  );
}
