import { useAuth } from '@clerk/clerk-expo'
import { Stack } from 'expo-router'
import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

const Layout = () => {
  const { isLoaded, isSignedIn, userId, sessionId, getToken} = useAuth();
  console.log('isSignedIn', isSignedIn)

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }
  return (
    <Stack>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" options={{
        headerShown: false,
      }}/>
      </Stack.Protected>

      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)" options={{
          headerShown: false,
        }}/>
      </Stack.Protected>
    </Stack>
  )
}

export default Layout

const styles = StyleSheet.create({})