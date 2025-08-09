import { useAuth, useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {
  const { user } = useUser();

  const { signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "OK",
        onPress: () => signOut()
      }
    ]);
  }
  return (
    <SafeAreaView  className='bg-gray-100 flex-1'>
     <Text className='text-2xl font-bold text-center mt-4'>Profile</Text>

     <View className='px-6 mb-6'>
      <TouchableOpacity
      onPress={handleSignOut}
      className='bg-red-600 rounded-2xl p-4 shadow-sm'
      activeOpacity={0.7}
      >
        <View className='flex-row items-center justify-center'>
          <Ionicons name='log-out-outline' size={24} color='white' />
          <Text className='text-white font-semibold text-lg ml-2'>Sign Out</Text>
        </View>
      </TouchableOpacity>
      
     </View>
    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({})