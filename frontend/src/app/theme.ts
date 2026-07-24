import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    body: {
      bg: "bg.canvas",
      color: "fg.default",
      colorPalette: "accent",
    },
  },
  theme: {
    tokens: {
      colors: {
        bg: {
          canvas: { value: "#0B0D0F" },
          panel: { value: "#1A1E23" },
          panelRaised: { value: "#23282F" },
        },
        accent: {
          50: { value: "#E9F5FE" },
          100: { value: "#CCE9FD" },
          200: { value: "#9FD6FB" },
          300: { value: "#72C3F9" },
          400: { value: "#56B6F7" },
          500: { value: "#3FA9F5" },
          600: { value: "#2A8FD6" },
          700: { value: "#206FA8" },
          800: { value: "#164F78" },
          900: { value: "#0E324D" },
          950: { value: "#081D2E" },
        },
        fg: {
          default: { value: "#E8E6E1" },
          muted: { value: "#A8ACB0" },
          subtle: { value: "#5A6168" },
        },
        border: {
          hairline: { value: "#262B31" },
        },
      },
      fonts: {
        heading: { value: "var(--font-display)" },
        body: { value: "var(--font-body)" },
        mono: { value: "var(--font-mono)" },
      },
      shadows: {
        panel: { value: "0 1px 2px 0 rgba(0, 0, 0, 0.55)" },
        panelRaised: {
          value:
            "0 8px 24px -6px rgba(0, 0, 0, 0.6), 0 1px 2px 0 rgba(0, 0, 0, 0.5)",
        },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          canvas: { value: "{colors.bg.canvas}" },
          panel: { value: "{colors.bg.panel}" },
          panelRaised: { value: "{colors.bg.panelRaised}" },
        },
        fg: {
          default: { value: "{colors.fg.default}" },
          muted: { value: "{colors.fg.muted}" },
          subtle: { value: "{colors.fg.subtle}" },
        },
        border: {
          hairline: { value: "{colors.border.hairline}" },
        },
        accent: {
          solidColor: { value: "{colors.accent.500}" },
          contrast: { value: "{colors.accent.950}" },
          fg: { value: "{colors.accent.400}" },
          subtle: { value: "{colors.accent.950}" },
          muted: { value: "{colors.accent.900}" },
          emphasized: { value: "{colors.accent.700}" },
          solid: { value: "{colors.accent.500}" },
          focusRing: { value: "{colors.accent.400}" },
        }
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
