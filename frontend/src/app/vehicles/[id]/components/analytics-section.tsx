"use client";

import { Box, Grid, Text } from "@chakra-ui/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import GaugePanel from "@/components/ui/gauge-panel";
import { useFetchAnalytics } from "@/app/vehicles/hooks/use-fetch-analytics";
import { ServiceLogDescription } from "@/types/service-logs";

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString()}`;
}

export default function AnalyticsSection({
  vehicleId,
}: {
  vehicleId: number;
}) {
  const { data, loading, error } = useFetchAnalytics(vehicleId);

  if (error) {
    return (
      <Box color="fg.subtle" fontSize="sm">
        Unable to load cost analytics right now.
      </Box>
    );
  }

  if (loading || !data) {
    return (
      <Box color="fg.subtle" fontSize="sm">
        Loading analytics…
      </Box>
    );
  }

  if (data.byServiceType.length === 0) {
    return (
      <Box color="fg.subtle" fontSize="sm">
        No service history yet — add a service log to see cost analytics.
      </Box>
    );
  }

  const byYearData = data.byYear.map((entry) => ({
    label: String(entry.year),
    value: entry.total,
  }));

  const byServiceTypeData = data.byServiceType.map((entry) => ({
    label: ServiceLogDescription[entry.serviceType] ?? entry.serviceType,
    value: entry.total,
  }));

  return (
    <Box>
      <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4} mb={6}>
        <GaugePanel
          compact
          title="Total Spend"
          value={formatCurrency(data.totalSpend)}
        />
        <GaugePanel
          compact
          title="Cost per Mile"
          value={
            data.costPerMile !== null
              ? `$${data.costPerMile.toFixed(2)}`
              : "—"
          }
          footerLabel={
            data.trackedMiles !== null ? "tracked miles" : undefined
          }
          footerValue={
            data.trackedMiles !== null
              ? data.trackedMiles.toLocaleString()
              : undefined
          }
        />
      </Grid>

      {data.totalSpend === 0 ? (
        <Box color="fg.subtle" fontSize="sm">
          No cost data yet — add a repair cost to a service log to see
          spending trends.
        </Box>
      ) : (
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
          <Box>
            <Text fontFamily="heading" fontWeight="500" fontSize="sm" mb={2}>
              Spend by Year
            </Text>
            <ChartPanel data={byYearData} />
          </Box>
          <Box>
            <Text fontFamily="heading" fontWeight="500" fontSize="sm" mb={2}>
              Spend by Service Type
            </Text>
            <ChartPanel data={byServiceTypeData} />
          </Box>
        </Grid>
      )}
    </Box>
  );
}

function ChartPanel({ data }: { data: { label: string; value: number }[] }) {
  return (
    <Box h="220px">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--chakra-colors-border-hairline)"
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--chakra-colors-fg-muted)", fontSize: 12 }}
            axisLine={{ stroke: "var(--chakra-colors-border-hairline)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--chakra-colors-fg-muted)", fontSize: 12 }}
            axisLine={{ stroke: "var(--chakra-colors-border-hairline)" }}
            tickLine={false}
            tickFormatter={(value) => formatCurrency(value)}
            width={56}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              background: "var(--chakra-colors-bg-panel)",
              border: "1px solid var(--chakra-colors-border-hairline)",
              borderRadius: 6,
              fontSize: 12,
            }}
          />
          <Bar
            dataKey="value"
            fill="var(--chakra-colors-accent-solidColor)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
