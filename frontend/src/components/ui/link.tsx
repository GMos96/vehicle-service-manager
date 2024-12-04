import { ReactNode } from "react";
import NextLink from "next/link";
import { Link as ChakraLink } from "@chakra-ui/react/link";

export default function Link({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <ChakraLink asChild>
      <NextLink href={href}>{children}</NextLink>
    </ChakraLink>
  );
}
