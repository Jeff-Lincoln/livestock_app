import GoogleSignIn from '@/components/GoogleSignIn'
import { useSignIn } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(false)
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '' })
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const shakeAnim = useRef(new Animated.Value(0)).current
  
  useEffect(() => {
    // Simple fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [])
  
  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  // Shake animation for errors
  const shakeInput = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start()
  }

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Reset errors
    setErrors({ email: '', password: '' })
    
    // Basic validation
    let hasErrors = false
    const newErrors = { email: '', password: '' }
    
    if (!emailAddress.trim()) {
      newErrors.email = 'Email is required'
      hasErrors = true
    } else if (!validateEmail(emailAddress)) {
      newErrors.email = 'Please enter a valid email'
      hasErrors = true
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required'
      hasErrors = true
    }
    
    if (hasErrors) {
      setErrors(newErrors)
      shakeInput()
      return
    }

    setIsLoading(true)

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
        Alert.alert('Sign In Failed', 'Please check your credentials and try again.')
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
      Alert.alert('Error', 'Something went wrong. Please try again.')
      shakeInput()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView className='flex-1 bg-gray-50'>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className='flex-1'
        >
          <Animated.View 
            className='flex-1 px-6 justify-center'
            style={{ 
              opacity: fadeAnim,
              transform: [{ translateX: shakeAnim }]
            }}
          >
            {/* Header section - Made more compact */}
            <View className='items-center mb-8'>
              {/* Logo - Reduced size and improved styling */}
              <View className='w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-lg'>
                <Ionicons name='storefront' size={28} color='#FFFFFF'/>
              </View>
              
              {/* Titles - More compact spacing */}
              <Text className='text-2xl font-bold text-gray-900 mb-1 text-center'>Northern Kenya</Text>
              <Text className='text-xl font-bold text-green-600 mb-2 text-center'>Livestock Market</Text>
              <Text className='text-gray-600 text-center text-sm px-4'>Join the smarter way to buy and sell livestock</Text>
            </View>
          
            {/** Sign in form - Improved width and styling */}
            <View className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 mx-4'>
              <Text className='text-2xl font-bold text-gray-900 mb-6 text-center'>
                Welcome Back!
              </Text>
                
              {/** Email Input - Enhanced with focus states and validation */}
              <View className='mb-4'>
                <Text className='text-sm font-medium text-gray-700 mb-2'>
                  Email
                </Text>

                <View className={`flex-row items-center rounded-xl px-4 py-4 border ${
                  errors.email 
                    ? 'bg-red-50 border-red-300' 
                    : emailFocused 
                      ? 'bg-blue-50 border-blue-300' 
                      : 'bg-gray-50 border-gray-200'
                }`}>
                  <Ionicons 
                    name='mail-outline' 
                    size={20} 
                    color={errors.email ? "#DC2626" : emailFocused ? "#3B82F6" : "#6B7280"}
                  />
                  <TextInput
                    autoCapitalize='none'
                    value={emailAddress}
                    placeholder='Enter your email'
                    placeholderTextColor="#9CA3AF"
                    onChangeText={(text) => {
                      setEmailAddress(text)
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
                    }}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    className='flex-1 ml-3 text-gray-900'
                    editable={!isLoading}
                    keyboardType="email-address"
                  />
                </View>
                {errors.email && (
                  <Text className='text-red-500 text-xs mt-1 ml-1'>{errors.email}</Text>
                )}
              </View>

              {/** Password Input - Enhanced with show/hide toggle */}
              <View className='mb-6'>
                <Text className='text-sm font-medium text-gray-700 mb-2'>
                  Password
                </Text>
                <View className={`flex-row items-center rounded-xl px-4 py-4 border ${
                  errors.password 
                    ? 'bg-red-50 border-red-300' 
                    : passwordFocused 
                      ? 'bg-blue-50 border-blue-300' 
                      : 'bg-gray-50 border-gray-200'
                }`}>
                  <Ionicons 
                    name='lock-closed-outline' 
                    size={20} 
                    color={errors.password ? "#DC2626" : passwordFocused ? "#3B82F6" : "#6B7280"}
                  />
                  <TextInput
                    value={password}
                    placeholder='Enter your password'
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    onChangeText={(text) => {
                      setPassword(text)
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
                    }}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className='flex-1 ml-3 text-gray-900'
                    editable={!isLoading}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    className='p-1'
                  >
                    <Ionicons 
                      name={showPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text className='text-red-500 text-xs mt-1 ml-1'>{errors.password}</Text>
                )}
              </View>

              {/** Sign In Button - Keeping your original style but enhanced */}
              <TouchableOpacity
                onPress={onSignInPress}
                disabled={isLoading}
                className={`rounded-xl py-4 shadow-sm mb-4 ${
                  isLoading ? 'bg-gray-400' : 'bg-green-600'
                } flex-row items-center justify-center`}
                activeOpacity={0.8}
              >
                <View className='flex-row items-center justify-center'>
                  {isLoading ? (
                    <Ionicons name='refresh' size={20} color="white"/>
                  ) : (
                    <Ionicons name='log-in-outline' size={20} color="white"/>
                  )}

                  <Text className='text-white font-semibold text-lg ml-2'>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/***Divider */}
              <View className='flex-row items-center my-4'>
                <View className='flex-1 h-px bg-gray-300'/>
                <Text className='mx-4 text-gray-500'>or</Text>
                <View className='flex-1 h-px bg-gray-300'/>
              </View>

              {/** Google Sign In Button */}
              <GoogleSignIn />

              {/* Sign Up Link */}
              <View className='flex-row justify-center items-center mt-4'>
                <Text className='text-gray-600'>Don't have an account? </Text>
                <Link href="/sign-up" asChild>
                  <TouchableOpacity>
                    <Text className='text-green-600 font-semibold'>Create one</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>

            {/** Footer - Made more compact */}
            <View className='px-6 pb-4'>
              <Text className='text-sm text-gray-500 text-center'>
                By continuing, you agree to our
                <Text className='text-green-600 font-semibold'> Terms of Service</Text>
                {' '}and
                <Text className='text-green-600 font-semibold'> Privacy Policy</Text>
              </Text>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  )
}



// import GoogleSignIn from '@/components/GoogleSignIn'
// import { useSignIn } from '@clerk/clerk-expo'
// import { Ionicons } from '@expo/vector-icons'
// import { useRouter } from 'expo-router'
// import React, { useEffect, useRef, useState } from 'react'
// import {
//   Alert,
//   Animated,
//   KeyboardAvoidingView,
//   Platform,
//   StatusBar,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'

// export default function Page() {
//   const { signIn, setActive, isLoaded } = useSignIn()
//   const router = useRouter()
  
//   const [isLoading, setIsLoading] = useState(false)
//   const [emailAddress, setEmailAddress] = useState('')
//   const [password, setPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [emailFocused, setEmailFocused] = useState(false)
//   const [passwordFocused, setPasswordFocused] = useState(false)
//   const [errors, setErrors] = useState({ email: '', password: '' })
  
//   // Animation values
//   const fadeAnim = useRef(new Animated.Value(0)).current
//   const shakeAnim = useRef(new Animated.Value(0)).current
  
//   useEffect(() => {
//     // Simple fade in animation
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 800,
//       useNativeDriver: true,
//     }).start()
//   }, [])
  
//   // Validation functions
//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     return emailRegex.test(email)
//   }
  
//   // Shake animation for errors
//   const shakeInput = () => {
//     Animated.sequence([
//       Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
//       Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
//       Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
//       Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true })
//     ]).start()
//   }

//   // Handle the submission of the sign-in form
//   const onSignInPress = async () => {
//     if (!isLoaded) return

//     // Reset errors
//     setErrors({ email: '', password: '' })
    
//     // Basic validation
//     let hasErrors = false
//     const newErrors = { email: '', password: '' }
    
//     if (!emailAddress.trim()) {
//       newErrors.email = 'Email is required'
//       hasErrors = true
//     } else if (!validateEmail(emailAddress)) {
//       newErrors.email = 'Please enter a valid email'
//       hasErrors = true
//     }
    
//     if (!password.trim()) {
//       newErrors.password = 'Password is required'
//       hasErrors = true
//     }
    
//     if (hasErrors) {
//       setErrors(newErrors)
//       shakeInput()
//       return
//     }

//     setIsLoading(true)

//     // Start the sign-in process using the email and password provided
//     try {
//       const signInAttempt = await signIn.create({
//         identifier: emailAddress,
//         password,
//       })

//       // If sign-in process is complete, set the created session as active
//       // and redirect the user
//       if (signInAttempt.status === 'complete') {
//         await setActive({ session: signInAttempt.createdSessionId })
//         router.replace('/')
//       } else {
//         // If the status isn't complete, check why. User might need to
//         // complete further steps.
//         console.error(JSON.stringify(signInAttempt, null, 2))
//         Alert.alert('Sign In Failed', 'Please check your credentials and try again.')
//       }
//     } catch (err) {
//       // See https://clerk.com/docs/custom-flows/error-handling
//       // for more info on error handling
//       console.error(JSON.stringify(err, null, 2))
//       Alert.alert('Error', 'Something went wrong. Please try again.')
//       shakeInput()
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <>
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
//       <SafeAreaView className='flex-1 bg-gray-50'>
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           className='flex-1'
//         >
//           <Animated.View 
//             className='flex-1 px-6 justify-center'
//             style={{ 
//               opacity: fadeAnim,
//               transform: [{ translateX: shakeAnim }]
//             }}
//           >
//             {/* Header section - Made more compact */}
//             <View className='items-center mb-8'>
//               {/* Logo - Reduced size and improved styling */}
//               <View className='w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-lg'>
//                 <Ionicons name='storefront' size={28} color='#FFFFFF'/>
//               </View>
              
//               {/* Titles - More compact spacing */}
//               <Text className='text-2xl font-bold text-gray-900 mb-1 text-center'>Northern Kenya</Text>
//               <Text className='text-xl font-bold text-green-600 mb-2 text-center'>Livestock Market</Text>
//               <Text className='text-gray-600 text-center text-sm px-4'>Join the smarter way to buy and sell livestock</Text>
//             </View>
          
//             {/** Sign in form - Improved width and styling */}
//             <View className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 mx-4'>
//               <Text className='text-2xl font-bold text-gray-900 mb-6 text-center'>
//                 Welcome Back!
//               </Text>
                
//               {/** Email Input - Enhanced with focus states and validation */}
//               <View className='mb-4'>
//                 <Text className='text-sm font-medium text-gray-700 mb-2'>
//                   Email
//                 </Text>

//                 <View className={`flex-row items-center rounded-xl px-4 py-4 border ${
//                   errors.email 
//                     ? 'bg-red-50 border-red-300' 
//                     : emailFocused 
//                       ? 'bg-blue-50 border-blue-300' 
//                       : 'bg-gray-50 border-gray-200'
//                 }`}>
//                   <Ionicons 
//                     name='mail-outline' 
//                     size={20} 
//                     color={errors.email ? "#DC2626" : emailFocused ? "#3B82F6" : "#6B7280"}
//                   />
//                   <TextInput
//                     autoCapitalize='none'
//                     value={emailAddress}
//                     placeholder='Enter your email'
//                     placeholderTextColor="#9CA3AF"
//                     onChangeText={(text) => {
//                       setEmailAddress(text)
//                       if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
//                     }}
//                     onFocus={() => setEmailFocused(true)}
//                     onBlur={() => setEmailFocused(false)}
//                     className='flex-1 ml-3 text-gray-900'
//                     editable={!isLoading}
//                     keyboardType="email-address"
//                   />
//                 </View>
//                 {errors.email && (
//                   <Text className='text-red-500 text-xs mt-1 ml-1'>{errors.email}</Text>
//                 )}
//               </View>

//               {/** Password Input - Enhanced with show/hide toggle */}
//               <View className='mb-6'>
//                 <Text className='text-sm font-medium text-gray-700 mb-2'>
//                   Password
//                 </Text>
//                 <View className={`flex-row items-center rounded-xl px-4 py-4 border ${
//                   errors.password 
//                     ? 'bg-red-50 border-red-300' 
//                     : passwordFocused 
//                       ? 'bg-blue-50 border-blue-300' 
//                       : 'bg-gray-50 border-gray-200'
//                 }`}>
//                   <Ionicons 
//                     name='lock-closed-outline' 
//                     size={20} 
//                     color={errors.password ? "#DC2626" : passwordFocused ? "#3B82F6" : "#6B7280"}
//                   />
//                   <TextInput
//                     value={password}
//                     placeholder='Enter your password'
//                     placeholderTextColor="#9CA3AF"
//                     secureTextEntry={!showPassword}
//                     onChangeText={(text) => {
//                       setPassword(text)
//                       if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
//                     }}
//                     onFocus={() => setPasswordFocused(true)}
//                     onBlur={() => setPasswordFocused(false)}
//                     className='flex-1 ml-3 text-gray-900'
//                     editable={!isLoading}
//                   />
//                   <TouchableOpacity 
//                     onPress={() => setShowPassword(!showPassword)}
//                     className='p-1'
//                   >
//                     <Ionicons 
//                       name={showPassword ? "eye-outline" : "eye-off-outline"} 
//                       size={20} 
//                       color="#6B7280" 
//                     />
//                   </TouchableOpacity>
//                 </View>
//                 {errors.password && (
//                   <Text className='text-red-500 text-xs mt-1 ml-1'>{errors.password}</Text>
//                 )}
//               </View>

//               {/** Sign In Button - Keeping your original style but enhanced */}
//               <TouchableOpacity
//                 onPress={onSignInPress}
//                 disabled={isLoading}
//                 className={`rounded-xl py-4 shadow-sm mb-4 ${
//                   isLoading ? 'bg-gray-400' : 'bg-green-600'
//                 } flex-row items-center justify-center`}
//                 activeOpacity={0.8}
//               >
//                 <View className='flex-row items-center justify-center'>
//                   {isLoading ? (
//                     <Ionicons name='refresh' size={20} color="white"/>
//                   ) : (
//                     <Ionicons name='log-in-outline' size={20} color="white"/>
//                   )}

//                   <Text className='text-white font-semibold text-lg ml-2'>
//                     {isLoading ? "Signing In..." : "Sign In"}
//                   </Text>
//                 </View>
//               </TouchableOpacity>

//               {/***Divider */}
//               <View className='flex-row items-center my-4'>
//                 <View className='flex-1 h-px bg-gray-300'/>
//                 <Text className='mx-4 text-gray-500'>or</Text>
//                 <View className='flex-1 h-px bg-gray-300'/>
//               </View>

//               {/** Google Sign In Button */}
//               <GoogleSignIn />
//             </View>

//             {/** Footer - Made more compact */}
//             <View className='px-6 pb-4'>
//               <Text className='text-sm text-gray-500 text-center'>
//                 By continuing, you agree to our
//                 <Text className='text-green-600 font-semibold'> Terms of Service</Text>
//                 {' '}and
//                 <Text className='text-green-600 font-semibold'> Privacy Policy</Text>
//               </Text>
//             </View>
//           </Animated.View>
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     </>
//   )
// }


// //   import GoogleSignIn from '@/components/GoogleSignIn'
// // import { useSignIn } from '@clerk/clerk-expo'
// // import { Ionicons } from '@expo/vector-icons'
// // import { useRouter } from 'expo-router'
// // import React, { useState } from 'react'
// // import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
// // import { SafeAreaView } from 'react-native-safe-area-context'

// //   export default function Page() {
// //     const { signIn, setActive, isLoaded } = useSignIn()
// //     const router = useRouter();
// //     const [isLoading, setIsLoading] = useState(false);

// //     const [emailAddress, setEmailAddress] = useState('');
// //     const [password, setPassword] = useState('')

// //     // Handle the submission of the sign-in form
// //     const onSignInPress = async () => {
// //       if (!isLoaded) return

// //       // Start the sign-in process using the email and password provided
// //       try {
// //         const signInAttempt = await signIn.create({
// //           identifier: emailAddress,
// //           password,
// //         })

// //         // If sign-in process is complete, set the created session as active
// //         // and redirect the user
// //         if (signInAttempt.status === 'complete') {
// //           await setActive({ session: signInAttempt.createdSessionId })
// //           router.replace('/')
// //         } else {
// //           // If the status isn't complete, check why. User might need to
// //           // complete further steps.
// //           console.error(JSON.stringify(signInAttempt, null, 2))
// //         }
// //       } catch (err) {
// //         // See https://clerk.com/docs/custom-flows/error-handling
// //         // for more info on error handling
// //         console.error(JSON.stringify(err, null, 2))
// //       }
// //     }

// //     return (
// //       <SafeAreaView className='flex-1'>
// //         <KeyboardAvoidingView
// //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //         className='flex-1'
// //         >
// //           <View className=' flex-1 px-6'>

// //           {/* Header section */}

// //           <View className='flex-1 justify-center'>
// //             {/*logo branding can go here*/}
// //             <View className='items-center mb-8'>
// //               <View className='w-20 h-20 bg-gradient-to-br from-blue-600
// //               to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-lg'>
// //                 <Ionicons name='storefront' size={40} color='#4FACFE'/>
// //               </View>
// //               <Text className='text-3xl font-bold text-gray-900 mb-2 text-center'>Northern Kenya</Text>
// //               <Text className='text-2xl font-bold text-green-600 mb-2 text-center'>Livestock Market</Text>
// //               <Text className='text-gray-700 text-center'>Join the smarter way to buy and sell livestock.</Text>
// //             </View>
          


// //           {/** Sign in form */}
// //           <View className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6'>
// //             <Text className='text-2xl font-bold text-gray-900 mb-6 text-center'>
// //               Welcome Back!
// //             </Text>
              
// //               {/** Email Input */}
// //               <View className='mb-4'>
// //                 <Text className='text-sm font-medium text-gay-700 mb-2'>
// //                   Email
// //                 </Text>

// //                 <View className='flex-row items-center bg-gray-50
// //                 rounded-xl px-4 py-4 border border-gray-200'>
// //                   <Ionicons name='mail-outline' size={20} color="#6B7280"/>
// //                   <TextInput
// //                   autoCapitalize='none'
// //                   value={emailAddress}
// //                   placeholder='Enter you email'
// //                   placeholderTextColor="#9CA3AF"
// //                   onChangeText={setEmailAddress}
// //                   className='flex-1 ml-3 text-gray-900'
// //                   editable={!isLoading}
// //                   />
// //                 </View>
// //               </View>

// //               {/** Password Input */}
// //               <View className='mb-6'>
// //                 <Text className='text-sm font-medium text-gray-700 mb-2'>
// //                   Password
// //                 </Text>
// //                 <View className='flex-row items-center bg-gray-50 rounded-xl
// //                 px-4 py-4 border border-gray-200'>
// //                   <Ionicons name='lock-closed-outline' size={20} color="#6B7280"/>
// //                   <TextInput
// //                     value={password}
// //                     placeholder='Enter your password'
// //                     placeholderTextColor="#9CA3AF"
// //                     secureTextEntry={true}
// //                     onChangeText={setPassword}
// //                     className='flex-1 ml-3 text-gray-900'
// //                     editable={!isLoading}
// //                   />
// //                 </View>
// //               </View>
// //           </View>

// //           {/** Sign In Button */}

// //           <TouchableOpacity
// //             onPress={onSignInPress}
// //             disabled={isLoading}
// //             className={`rounded-xl py-4 shadow-sm mb-4 ${
// //               isLoading ? 'bg-gray-400' : 'bg-green-600'
// //             } flex-row items-center justify-center`}
// //             activeOpacity={0.8}
// //           >
// //           <View className='flex-row items-center justify-center'>
// //             {isLoading ? (
// //               <Ionicons name='refresh' size={20} color="white"/>
// //             ) : (
// //               <Ionicons name='log-in-outline' size={20} color="white"/>
// //             )}

// //             <Text className='text-white font-semibold text-lg ml-2'>
// //               {isLoading ? "Signing In..." : "Sign In"}
// //             </Text>
// //           </View>
// //           </TouchableOpacity>

// //           {/***Divider */}
// //           <View className='flex-row items-center my-4'>
// //             <View className='flex-1 h-px bg-gray-300'/>
// //             <Text className='mx-4 text-gray-500'>or</Text>
// //             <View className='flex-1 h-px bg-gray-300'/>
// //           </View>

// //           {/** Google Sign In Button */}
// //           <GoogleSignIn />

// //         </View>

// //         {/** footer */}

// //         <View className='px-6 pb-6'>
// //           <Text className='text-sm text-gray-500 text-center'>
// //             By continuing, you agree to our
// //             <Text className='text-green-600 font-semibold'> Terms of Service</Text>
// //             and
// //             <Text className='text-green-600 font-semibold'> Privacy Policy</Text>
// //           </Text>
// //         </View>
// //       </View>
// //         </KeyboardAvoidingView>
// //       </SafeAreaView>
// //     )
// //   }




// // // import { useSignIn } from '@clerk/clerk-expo'
// // // import { Ionicons } from '@expo/vector-icons'
// // // import { Link, useRouter } from 'expo-router'
// // // import React, { useState } from 'react'
// // // import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
// // // import { SafeAreaView } from 'react-native-safe-area-context'

// // // export default function Page() {
// // //   const { signIn, setActive, isLoaded } = useSignIn()
// // //   const router = useRouter()

// // //   const [emailAddress, setEmailAddress] = useState('');
// // //   const [password, setPassword] = useState('')

// // //   // Handle the submission of the sign-in form
// // //   const onSignInPress = async () => {
// // //     if (!isLoaded) return

// // //     // Start the sign-in process using the email and password provided
// // //     try {
// // //       const signInAttempt = await signIn.create({
// // //         identifier: emailAddress,
// // //         password,
// // //       })

// // //       // If sign-in process is complete, set the created session as active
// // //       // and redirect the user
// // //       if (signInAttempt.status === 'complete') {
// // //         await setActive({ session: signInAttempt.createdSessionId })
// // //         router.replace('/')
// // //       } else {
// // //         // If the status isn't complete, check why. User might need to
// // //         // complete further steps.
// // //         console.error(JSON.stringify(signInAttempt, null, 2))
// // //       }
// // //     } catch (err) {
// // //       // See https://clerk.com/docs/custom-flows/error-handling
// // //       // for more info on error handling
// // //       console.error(JSON.stringify(err, null, 2))
// // //     }
// // //   }

// // //   return (
// // //     <SafeAreaView className='flex-1 bg-white p-4'>
// // //       <KeyboardAvoidingView
// // //       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// // //       >

// // //         {/* Header section */}

// // //         <View className='flex-1 justify-center items-center'>
// // //           {/*logo branding can go here*/}
// // //           <View className='w-20 h-20 bg-gradient-to-br from-blue-600
// // //           to-purple-600 rounded-2xl items-center justify-center mb-4
// // //           shadow-lg'>
// // //             <Ionicons name='storefront' size={40} color='#4FACFE'/>
// // //           </View>
// // //           <Text className='text-3xl font-bold text-gray-900 mb-2'>LiveStock MarketPlace Kenya</Text>
// // //         </View>
// // //       <Text>Sign in</Text>
// // //       <TextInput
// // //         autoCapitalize="none"
// // //         value={emailAddress}
// // //         placeholder="Enter email"
// // //         onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
// // //       />
// // //       <TextInput
// // //         value={password}
// // //         placeholder="Enter password"
// // //         secureTextEntry={true}
// // //         onChangeText={(password) => setPassword(password)}
// // //       />
// // //       <TouchableOpacity onPress={onSignInPress}>
// // //         <Text>Continue</Text>
// // //       </TouchableOpacity>
// // //       <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
// // //         <Link href="/sign-up">
// // //           <Text>Sign up</Text>
// // //         </Link>
// // //       </View>
// // //       </KeyboardAvoidingView>
// // //     </SafeAreaView>
// // //   )
// // // }