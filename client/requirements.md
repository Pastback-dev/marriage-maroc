## Packages
framer-motion | Essential for soft animations and image sliders
lucide-react | Iconography for the UI (already in base but explicit check)

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
  arabic: ["var(--font-arabic)"],
}
Authentication uses local session cookies (credentials: "include")
Images for providers are arrays of strings (URLs)
