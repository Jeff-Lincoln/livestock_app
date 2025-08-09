import { useUser } from '@clerk/clerk-expo';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {

  const { user } = useUser();

  return (
    <SafeAreaView className='flex-1 bg-gray-100'>
      <View>

        <View>

        </View>
      </View>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({})