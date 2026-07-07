"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Flex, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import { api } from "@/core/api";

type Props = { params: Promise<{ token: string }> };

interface InvitationInfo {
  vehicleId: number;
  vehicleName: string;
  level: "READ" | "WRITE";
  inviteeEmail: string;
  expiresAt: string;
}

export default function InvitationPage({ params }: Props) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [info, setInfo] = useState<InvitationInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    params.then(({ token: t }) => {
      setToken(t);
      api
        .get(`invitations/${t}`)
        .then((r) => setInfo(r.data))
        .catch((err) => {
          const msg = err?.response?.data?.message ?? "Invitation not found or expired";
          setError(msg);
        });
    });
  }, [params]);

  async function accept() {
    if (!token) return;
    setAccepting(true);
    try {
      const r = await api.post(`invitations/${token}/accept`);
      setAccepted(true);
      setTimeout(() => router.push(`/vehicles/${r.data.vehicleId}`), 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Could not accept invitation";
      setError(msg);
    } finally {
      setAccepting(false);
    }
  }

  if (!info && !error) {
    return (
      <Flex justify="center" py={20}>
        <Spinner color="accent.solidColor" />
      </Flex>
    );
  }

  return (
    <Flex justify="center" py={16} px={4}>
      <Box maxW="md" w="full" bg="bg.panel" borderWidth="1px" borderColor="border.hairline" borderTopWidth="2px" borderTopColor="accent.solidColor" borderRadius="md" p={8}>
        {error ? (
          <Stack gap={4} textAlign="center">
            <Heading size="md">Invitation Unavailable</Heading>
            <Text color="fg.muted">{error}</Text>
            <Button variant="outline" onClick={() => router.push("/vehicles")}>Go to my vehicles</Button>
          </Stack>
        ) : accepted ? (
          <Stack gap={4} textAlign="center">
            <Heading size="md">Access granted!</Heading>
            <Text color="fg.muted">Redirecting to the vehicle…</Text>
          </Stack>
        ) : info ? (
          <Stack gap={5}>
            <Heading size="md">Vehicle Invitation</Heading>
            <Text>
              You&apos;ve been invited to{" "}
              <strong>{info.level === "WRITE" ? "view and edit" : "view"}</strong>{" "}
              <strong>{info.vehicleName}</strong>.
            </Text>
            <Text fontSize="sm" color="fg.muted">
              Invitation sent to: {info.inviteeEmail}
            </Text>
            <Button onClick={accept} disabled={accepting}>
              Accept invitation
            </Button>
            <Button variant="ghost" onClick={() => router.push("/vehicles")}>
              Decline
            </Button>
          </Stack>
        ) : null}
      </Box>
    </Flex>
  );
}
