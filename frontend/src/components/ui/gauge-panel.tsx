"use client";

import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { ReactNode, useEffect, useRef, useState } from "react";

type RadialArcProps = {
  /** 0–1, how full the arc reads */
  fill: number;
  size?: number;
};

/**
 * A gauge-needle-style arc that sweeps into place once on mount.
 * Respects prefers-reduced-motion by settling immediately.
 */
function RadialArc({ fill, size = 54 }: RadialArcProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference * (1 - Math.min(Math.max(fill, 0), 1));
  const [offset, setOffset] = useState(circumference);
  const ref = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      setOffset(targetOffset);
      return;
    }
    const frame = requestAnimationFrame(() => setOffset(targetOffset));
    return () => cancelAnimationFrame(frame);
  }, [targetOffset]);

  return (
    <Box flexShrink={0} w={`${size}px`} h={`${size}px`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--chakra-colors-border-hairline)"
          strokeWidth={4}
        />
        <circle
          ref={ref}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--chakra-colors-accent-solidColor)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 700ms ease-out" }}
        />
      </svg>
    </Box>
  );
}

type GaugePanelProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  tag?: ReactNode;
  /** Text/foreground color for the tag chip. Defaults to a neutral accent tone. */
  tagColor?: string;
  /** Background color for the tag chip. Defaults to a neutral accent tone. */
  tagBg?: string;
  value: ReactNode;
  unit?: ReactNode;
  footerLabel?: ReactNode;
  footerValue?: ReactNode;
  /** 0–1 fill amount for the radial arc; omit to hide the arc */
  arcFill?: number;
  onClick?: () => void;
  /** Smaller, quieter treatment for secondary stat tiles nested inside another panel. */
  compact?: boolean;
};

export default function GaugePanel({
  title,
  subtitle,
  tag,
  tagColor = "accent.fg",
  tagBg = "accent.subtle",
  value,
  unit,
  footerLabel,
  footerValue,
  arcFill,
  onClick,
  compact = false,
}: GaugePanelProps) {
  return (
    <Box
      bg="bg.panelRaised"
      borderWidth="1px"
      borderColor="border.hairline"
      borderRadius={compact ? "md" : "lg"}
      boxShadow={compact ? "panel" : "panelRaised"}
      px={compact ? 5 : 6}
      py={compact ? 4 : 5}
      cursor={onClick ? "pointer" : undefined}
      onClick={onClick}
      transition="border-color 150ms ease, transform 150ms ease"
      _hover={onClick ? { borderColor: "accent.solidColor" } : undefined}
      _focusVisible={{
        outline: "2px solid",
        outlineColor: "accent.solidColor",
        outlineOffset: "2px",
      }}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick();
            }
          : undefined
      }
    >
      <Flex justify="space-between" align="flex-start" mb={compact ? 3 : 4}>
        <Box>
          <Text fontFamily="heading" fontWeight="600" fontSize={compact ? "sm" : "md"}>
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="sm" color="fg.subtle" mt="1px">
              {subtitle}
            </Text>
          )}
        </Box>
        {tag && (
          <Box
            fontFamily="mono"
            fontSize="2xs"
            letterSpacing="0.1em"
            textTransform="uppercase"
            fontWeight="600"
            color={tagColor}
            bg={tagBg}
            borderRadius="sm"
            px={2}
            py="2px"
          >
            {tag}
          </Box>
        )}
      </Flex>

      <HStack gap={3.5} align="flex-end">
        {arcFill !== undefined && <RadialArc fill={arcFill} />}
        <Box>
          <Text
            as="span"
            className="vsm-mono-num"
            fontWeight="500"
            fontSize={compact ? "2xl" : "3xl"}
            lineHeight="1"
          >
            {value}
          </Text>
          {unit && (
            <Text as="span" fontFamily="mono" fontSize="xs" color="fg.subtle" ml={1.5}>
              {unit}
            </Text>
          )}
        </Box>
      </HStack>

      {(footerLabel || footerValue) && (
        <Flex
          justify="space-between"
          mt={4}
          pt={3.5}
          borderTopWidth="1px"
          borderTopColor="border.hairline"
          fontFamily="mono"
          fontSize="xs"
          color="fg.subtle"
        >
          <Text>{footerLabel}</Text>
          <Text color="fg.default">{footerValue}</Text>
        </Flex>
      )}
    </Box>
  );
}
