import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import Provider from "./provider";
import Navbar from "@/components/segments/navbar";
import { Container, Stack } from "@chakra-ui/react";
import AuthProvider from "@/providers/auth.provider";
import { Toaster } from "@/components/ui/toaster";
import { spaceGrotesk, inter, jetBrainsMono } from "@/app/fonts";

export const metadata: Metadata = {
  title: "Vehicle Service Manager",
  description: "Track maintenance, mileage, and service history for every vehicle you own.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`vsm-root ${spaceGrotesk.variable} ${inter.variable} ${jetBrainsMono.variable}`}
    >
      <body className="chakra-theme dark" style={{ colorScheme: "dark" }}>
        <AuthProvider>
          <Provider>
            <Stack gap={0} minH="100vh">
              <Navbar></Navbar>
              <Container as="main" maxW="6xl" px={{ base: 4, md: 10 }}>
                {children}
              </Container>
            </Stack>
            <Toaster />
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
}
