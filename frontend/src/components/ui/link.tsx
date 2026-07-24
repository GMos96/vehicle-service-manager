import { ReactNode } from "react";
import NextLink from "next/link";
import { Link as ChakraLink } from "@chakra-ui/react/link";

export default function Link({
  children,
  href,
  ...rest
}: {
  children: ReactNode;
  href: string;
  "data-testid"?: string;
}) {
  return (
    <ChakraLink asChild>
      <NextLink href={href} {...rest}>
        {children}
      </NextLink>
    </ChakraLink>
  );
}
