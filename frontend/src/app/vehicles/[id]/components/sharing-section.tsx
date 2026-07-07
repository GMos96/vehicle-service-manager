"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { api } from "@/core/api";
import { VehicleInvitationDTO, VehicleShareDTO, VehicleSharesDTO } from "@/app/vehicles/types";
import { showErrorToast, showSuccessToast } from "@/core/errors";

type Props = { vehicleId: number };

export default function SharingSection({ vehicleId }: Props) {
  const [data, setData] = useState<VehicleSharesDTO>({ shares: [], invitations: [] });
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState<"READ" | "WRITE">("READ");
  const [inviting, setInviting] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get(`vehicles/${vehicleId}/shares`)
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [vehicleId]);

  useEffect(() => { load(); }, [load]);

  async function invite() {
    if (!email.trim()) return;
    setInviting(true);
    try {
      await api.post(`vehicles/${vehicleId}/shares`, { inviteeEmail: email.trim(), level });
      setEmail("");
      showSuccessToast("Invitation created");
      load();
    } catch (err) {
      showErrorToast(err, { title: "Could not create invitation" });
    } finally {
      setInviting(false);
    }
  }

  async function revoke(shareId: number) {
    try {
      await api.delete(`vehicles/${vehicleId}/shares/${shareId}`);
      showSuccessToast("Access revoked");
      load();
    } catch (err) {
      showErrorToast(err, { title: "Could not revoke access" });
    }
  }

  function copyLink(inv: VehicleInvitationDTO) {
    navigator.clipboard.writeText(inv.inviteUrl).then(() => {
      setCopiedId(inv.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  if (loading) {
    return <Box color="fg.subtle" fontSize="sm">Loading…</Box>;
  }

  return (
    <Stack gap={5}>
      {/* Invite form */}
      <Box>
        <Text fontFamily="heading" fontWeight="500" fontSize="sm" mb={3}>
          Invite someone
        </Text>
        <Stack gap={3}>
          <HStack>
            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                size="sm"
              />
            </Field>
            <Field label="Access">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as "READ" | "WRITE")}
                style={{ padding: "6px 8px", borderRadius: 6, fontSize: 14, background: "var(--chakra-colors-bg-subtle)", border: "1px solid var(--chakra-colors-border-hairline)", color: "var(--chakra-colors-fg)" }}
              >
                <option value="READ">View only</option>
                <option value="WRITE">Can edit</option>
              </select>
            </Field>
          </HStack>
          <Button size="sm" onClick={invite} disabled={inviting} alignSelf="start">
            {inviting ? "Sending…" : "Send invite"}
          </Button>
        </Stack>
      </Box>

      {/* Pending invitations */}
      {data.invitations.filter((i) => i.status === "PENDING").length > 0 && (
        <Box>
          <Text fontFamily="heading" fontWeight="500" fontSize="sm" mb={2}>
            Pending invitations
          </Text>
          <Stack gap={2}>
            {data.invitations
              .filter((i) => i.status === "PENDING")
              .map((inv) => (
                <Flex key={inv.id} align="center" justify="space-between" py={2} borderBottomWidth="1px" borderColor="border.hairline" _last={{ borderBottomWidth: 0 }}>
                  <Box>
                    <Text fontSize="sm">{inv.inviteeEmail}</Text>
                    <Text fontSize="xs" color="fg.muted">{inv.level === "WRITE" ? "Can edit" : "View only"}</Text>
                  </Box>
                  <HStack>
                    <Button size="xs" variant="outline" onClick={() => copyLink(inv)}>
                      {copiedId === inv.id ? "Copied!" : "Copy link"}
                    </Button>
                    <Button size="xs" colorPalette="red" variant="outline" onClick={() => revoke(inv.id)}>
                      Revoke
                    </Button>
                  </HStack>
                </Flex>
              ))}
          </Stack>
        </Box>
      )}

      {/* Active collaborators */}
      {data.shares.length > 0 && (
        <Box>
          <Text fontFamily="heading" fontWeight="500" fontSize="sm" mb={2}>
            Collaborators
          </Text>
          <Stack gap={2}>
            {data.shares.map((share: VehicleShareDTO) => (
              <Flex key={share.id} align="center" justify="space-between" py={2} borderBottomWidth="1px" borderColor="border.hairline" _last={{ borderBottomWidth: 0 }}>
                <Box>
                  <Text fontSize="sm">User #{share.userId}</Text>
                  <Text fontSize="xs" color="fg.muted">{share.level === "WRITE" ? "Can edit" : "View only"}</Text>
                </Box>
                <Button size="xs" colorPalette="red" variant="outline" onClick={() => revoke(share.id)}>
                  Remove
                </Button>
              </Flex>
            ))}
          </Stack>
        </Box>
      )}

      {data.shares.length === 0 && data.invitations.filter((i) => i.status === "PENDING").length === 0 && (
        <Text color="fg.subtle" fontSize="sm">
          No collaborators yet. Send an invite above.
        </Text>
      )}
    </Stack>
  );
}
