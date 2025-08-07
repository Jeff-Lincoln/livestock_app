import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Slot } from "expo-router";
import './global.css';

const clerkPublicKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

if (!clerkPublicKey) {
  throw new Error('Missing Clerk publishable key')
}

const InitialLayout = () => {
  return (
    <Slot />
  )
}

const RootLayout = () => {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={clerkPublicKey}>
        <ClerkLoaded>
          <InitialLayout />
        </ClerkLoaded>
    </ClerkProvider>
  )
}

export default RootLayout;
