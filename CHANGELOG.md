# Changelog

## [0.2.0] - 2026-03-28

### Added
- React Native (Expo SDK 54) project replacing Next.js dashboard
- Login screen with staggered fade-in animations
- Register screen with 3-step wizard (basics, location, details) and progress dots
- Home screen with "Welcome to Omni" greeting
- Auth context with SecureStore token management and auto session restore
- API client with Bearer token auth and automatic refresh on 401
- React Navigation with auth stack (Login/Register) vs main stack (Home)
- Auth footer with Terms of Service, Privacy Policy, and CC BY-NC-ND 4.0 license
- Omni design tokens in `constants/Colors.ts`
- Inter and Poppins font loading via @expo-google-fonts
- Tunnel mode dev script (`pnpm dev`) for physical device testing

### Changed
- Migrated from npm to pnpm
- Downgraded from SDK 55 canary to SDK 54 stable for Expo Go compatibility

### Archived
- Full Next.js codebase preserved on `nextjs-archive` branch
