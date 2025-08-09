import { AntDesign } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

const TabsLayout = () => {
  return (
    <Tabs
    >
      <Tabs.Screen name="index"
      options={{
        headerShown: false,
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size}) => (
            <AntDesign name="home" size={size} color={color} />
        )
      }}/>
      <Tabs.Screen name="search"
      options={{
        headerShown: false,
        tabBarLabel: 'Search',
        tabBarIcon: ({ color, size}) => (
            <AntDesign name="search1" size={size} color={color} />
        )
      }}/>
      <Tabs.Screen name="create"
      options={{
        headerShown: false,
        tabBarLabel: 'Create',
        tabBarStyle: { display: 'none' },
        tabBarIcon: ({ color, size}) => (
            <AntDesign name="pluscircleo" size={size} color={color} />
        )
      }}/>
      <Tabs.Screen name="notifications"
      options={{
        headerShown: false,
        tabBarLabel: 'Notifications',
        tabBarIcon: ({ color, size}) => (
            <AntDesign name="bells" size={size} color={color} />
        )
      }}/>
      <Tabs.Screen name="profile"
      options={{
        headerShown: false,
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size}) => (
            <AntDesign name="user" size={size} color={color} />
        )
      }}/>

    </Tabs>
  )
}

export default TabsLayout

const styles = StyleSheet.create({})