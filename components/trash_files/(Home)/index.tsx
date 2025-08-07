import { useClerk, useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

const HomePage = () => {
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('')
  const [showSignOutModal, setShowSignOutModal] = useState(false)

  const handleSearch = () => {
    if (searchQuery.trim()) {
      Alert.alert('Search', `Searching for: ${searchQuery}`)
      // Implement your search logic here
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      Linking.openURL(Linking.createURL('/'))
    } catch (err) {
      console.error('Sign out error:', JSON.stringify(err, null, 2))
      Alert.alert('Error', 'Failed to sign out. Please try again.')
    }
  }

  const confirmSignOut = () => {
    setShowSignOutModal(false)
    handleSignOut()
    router.replace('/(auth)/sign-in')

  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#0f766e" />
      
      {/* Header Container */}
      <View style={styles.headerContainer} className="bg-teal-700">
        {/* Main Header Content */}
        <View className="flex-row justify-between items-center mb-4">
          {/* Left Side - Profile & Greeting */}
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => setShowSignOutModal(true)}>
              <Image
                source={{ uri: user?.imageUrl || 'https://via.placeholder.com/48' }}
                className="w-12 h-12 rounded-full border-2 border-white mr-3"
              />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-white text-lg font-bold">
                Hi, {user?.firstName || 'Trader'}!
              </Text>
              <Text className="text-teal-100 text-sm opacity-90">
                {user?.primaryEmailAddress?.emailAddress}
              </Text>
            </View>
          </View>

          {/* Right Side - Notification */}
          <TouchableOpacity className="p-2 relative">
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center z-10">
              <Text className="text-white text-xs font-bold">3</Text>
            </View>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Welcome Message */}
        <Text className="text-white text-center text-lg font-semibold mb-4">
          Welcome to Livestock Trading
        </Text>

        {/* Search Bar */}
        <View className="bg-white rounded-2xl p-1 shadow-lg">
          <View className="flex-row items-center px-4 py-2">
            <Ionicons name="search" size={20} color="#6b7280" />
            <TextInput
              className="flex-1 ml-3 text-base text-gray-700"
              placeholder="Search livestock, traders, or locations..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>

      {/* Quick Categories */}
      <View className="bg-white mx-5 -mt-6 rounded-2xl p-5 shadow-lg">
        <Text className="text-gray-800 text-lg font-semibold text-center mb-4">
          Browse Categories
        </Text>
        
        <View className="flex-row justify-between">
          <TouchableOpacity className="items-center bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex-1 mx-1">
            <View className="bg-emerald-100 p-3 rounded-full mb-2">
              <Ionicons name="logo-buffalo" size={24} color="#059669" />
            </View>
            <Text className="text-emerald-700 font-medium text-sm">Cattle</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center bg-orange-50 p-4 rounded-xl border border-orange-100 flex-1 mx-1">
            <View className="bg-orange-100 p-3 rounded-full mb-2">
              <Ionicons name="leaf" size={24} color="#ea580c" />
            </View>
            <Text className="text-orange-700 font-medium text-sm">Goats</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center bg-blue-50 p-4 rounded-xl border border-blue-100 flex-1 mx-1">
            <View className="bg-blue-100 p-3 rounded-full mb-2">
              <Ionicons name="home" size={24} color="#2563eb" />
            </View>
            <Text className="text-blue-700 font-medium text-sm">Poultry</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center bg-cyan-50 p-4 rounded-xl border border-cyan-100 flex-1 mx-1">
            <View className="bg-cyan-100 p-3 rounded-full mb-2">
              <Ionicons name="fish" size={24} color="#0891b2" />
            </View>
            <Text className="text-cyan-700 font-medium text-sm">Fish</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity Section */}
      <View className="mx-5 mt-6">
        <Text className="text-gray-800 text-xl font-bold mb-4">Recent Activity</Text>
        
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="bg-green-100 p-2 rounded-full mr-3">
                <Ionicons name="trending-up" size={20} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-semibold">New cattle listing</Text>
                <Text className="text-gray-500 text-sm">Premium Friesian cows available</Text>
              </View>
            </View>
            <Text className="text-gray-400 text-xs">2h ago</Text>
          </View>
        </View>

        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="bg-blue-100 p-2 rounded-full mr-3">
                <Ionicons name="chatbubble-ellipses" size={20} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-semibold">Message from John Doe</Text>
                <Text className="text-gray-500 text-sm">Interested in your goat listing</Text>
              </View>
            </View>
            <Text className="text-gray-400 text-xs">1d ago</Text>
          </View>
        </View>
      </View>

      {/* Sign Out Modal */}
      <Modal
        transparent={true}
        visible={showSignOutModal}
        animationType="fade"
        onRequestClose={() => setShowSignOutModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            {/* Modal Header */}
            <View className="items-center mb-4">
              <View className="bg-red-100 p-3 rounded-full mb-3">
                <Ionicons name="log-out-outline" size={24} color="#dc2626" />
              </View>
              <Text className="text-xl font-bold text-gray-800 mb-2">Sign Out</Text>
              <Text className="text-gray-600 text-center">
                Are you sure you want to sign out of your account?
              </Text>
            </View>

            {/* User Info */}
            <View className="bg-gray-50 rounded-xl p-3 mb-6">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: user?.imageUrl || 'https://via.placeholder.com/40' }}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">
                    {user?.firstName} {user?.lastName}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {user?.primaryEmailAddress?.emailAddress}
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row space-x-3">
              <TouchableOpacity 
                className="flex-1 bg-gray-100 py-3 rounded-xl"
                onPress={() => setShowSignOutModal(false)}
              >
                <Text className="text-center font-semibold text-gray-700">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 bg-red-500 py-3 rounded-xl"
                onPress={confirmSignOut}
              >
                <Text className="text-center font-semibold text-white">Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom spacing */}
      <View className="h-10" />
    </ScrollView>
  )
}

export default HomePage

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
})



// import { useUser } from '@clerk/clerk-expo'
// import { Ionicons } from '@expo/vector-icons'
// import React from 'react'
// import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

// const HomePage = () => {
//   const { user } = useUser()

//   return (
//     <ScrollView className='flex-1 bg-gray-50'>
//       <StatusBar barStyle="light-content" backgroundColor="#059669" />
      
//       {/* Header Container */}
//       <View style={styles.headerContainer}>
//         {/* Main Header Content */}
//         <View style={styles.headerContent}>
//           {/* Left Side - Profile & Greeting */}
//           <View style={styles.leftSection}>
//             <Image
//               source={{ uri: user?.imageUrl || 'https://via.placeholder.com/56' }}
//               style={styles.profileImage}
//             />
//             <View style={styles.greetingContainer}>
//               <Text style={styles.hiText}>Hi, {user?.firstName || 'Trader'}!</Text>
//               <Text style={styles.emailText}>{user?.primaryEmailAddress?.emailAddress}</Text>
//             </View>
//           </View>

//           {/* Right Side - Icons */}
//           <View style={styles.rightSection}>
//             <TouchableOpacity style={styles.iconButton}>
//               <Ionicons name="search" size={24} color="#ffffff" />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.iconButton}>
//               <View style={styles.notificationBadge}>
//                 <Text style={styles.badgeText}>3</Text>
//               </View>
//               <Ionicons name="notifications" size={24} color="#ffffff" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Welcome Message */}
//         <View style={styles.welcomeContainer}>
//           <Text style={styles.welcomeText}>Welcome to Livestock Trading</Text>
//         </View>
//       </View>

//       {/* What are you looking for section */}
//       <View style={styles.searchPromptContainer}>
//         <Text style={styles.searchPromptText}>What are you looking for today?</Text>
        
//         {/* Quick Action Buttons */}
//         <View style={styles.quickActionsContainer}>
//           <TouchableOpacity style={styles.quickActionButton}>
//             <Ionicons name="cattle" size={20} color="#059669" />
//             <Text style={styles.quickActionText}>Cattle</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.quickActionButton}>
//             <Ionicons name="leaf" size={20} color="#059669" />
//             <Text style={styles.quickActionText}>Goats</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.quickActionButton}>
//             <Ionicons name="home" size={20} color="#059669" />
//             <Text style={styles.quickActionText}>Poultry</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.quickActionButton}>
//             <Ionicons name="fish" size={20} color="#059669" />
//             <Text style={styles.quickActionText}>Fish</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Content area - you can add your content here */}
//       <View style={styles.contentContainer}>
//         <Text style={styles.contentPlaceholder}>Your content goes here...</Text>
//         {/* Add your main content components here */}
//       </View>
//     </ScrollView>
//   )
// }

// export default HomePage

// const styles = StyleSheet.create({
//   headerContainer: {
//     backgroundColor: '#059669', // Emerald green
//     paddingTop: StatusBar.currentHeight || 50,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//     borderBottomLeftRadius: 25,
//     borderBottomRightRadius: 25,
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 4.65,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 15,
//   },
//   leftSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   profileImage: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     borderWidth: 3,
//     borderColor: '#ffffff',
//     marginRight: 12,
//   },
//   greetingContainer: {
//     flex: 1,
//   },
//   hiText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     marginBottom: 2,
//   },
//   emailText: {
//     fontSize: 13,
//     color: '#d1fae5', // Light green
//     opacity: 0.9,
//   },
//   rightSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   iconButton: {
//     padding: 10,
//     marginLeft: 8,
//     position: 'relative',
//   },
//   notificationBadge: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     backgroundColor: '#ef4444', // Red
//     borderRadius: 10,
//     minWidth: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1,
//   },
//   badgeText: {
//     color: '#ffffff',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   welcomeContainer: {
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   welcomeText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#ffffff',
//     textAlign: 'center',
//   },
//   searchPromptContainer: {
//     backgroundColor: '#ffffff',
//     marginHorizontal: 20,
//     marginTop: -15,
//     borderRadius: 20,
//     padding: 20,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//   },
//   searchPromptText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1f2937', // Dark gray
//     textAlign: 'center',
//     marginBottom: 15,
//   },
//   quickActionsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 10,
//   },
//   quickActionButton: {
//     alignItems: 'center',
//     backgroundColor: '#f0fdf4', // Very light green
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 12,
//     minWidth: 70,
//     borderWidth: 1,
//     borderColor: '#bbf7d0', // Light green border
//   },
//   quickActionText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#059669',
//     marginTop: 4,
//   },
//   contentContainer: {
//     padding: 20,
//     marginTop: 20,
//   },
//   contentPlaceholder: {
//     fontSize: 16,
//     color: '#6b7280',
//     textAlign: 'center',
//     fontStyle: 'italic',
//   },
// });


// // import { useUser } from '@clerk/clerk-expo'
// // import React from 'react'
// // import { Image, StyleSheet, Text, View } from 'react-native'


// // const HomePage = () => {
// //   const { user } = useUser()

// //   return (
// //       <View className='flex-1'>
// //         <View className='flex flex-direction-col justify-center mt-10 gap-10'>
// //           <Image
// //             source={{ uri: user?.imageUrl }}
// //             className='h-14 w-14 rounded-full'
// //           />
// //           <Text className='text-2xl font-bold text-center mt-10'>
// //             Hi,
// //           </Text>
// //           <Text className='text-lg text-center mt-5'>User: {user?.username}</Text>
// //         </View>
// //       </View>
// //   )
// // }

// // export default HomePage

// // const styles = StyleSheet.create({});

