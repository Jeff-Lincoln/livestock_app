import { SignOutButton } from '@/components/SignOutButton';
import { SignedIn, useUser } from '@clerk/clerk-expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Home = () => {

  const { user } = useUser();

  return (
    <View className='bg-gray-100 flex-1 items-center justify-center'>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <SignOutButton />
      </SignedIn>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})