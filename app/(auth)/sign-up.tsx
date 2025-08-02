import { useSignUp } from '@clerk/clerk-expo'
import { LinearGradient } from 'expo-linear-gradient'
import { Link, useRouter } from 'expo-router'
import * as React from 'react'
import {
  Alert,
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current
  const slideAnim = React.useRef(new Animated.Value(30)).current

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start()
  }, [pendingVerification])

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return
    if (!emailAddress || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
      
      // Reset animation values for verification screen
      fadeAnim.setValue(0)
      slideAnim.setValue(30)
      
      // Animate in verification screen
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start()
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      Alert.alert('Error', err.errors?.[0]?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return
    if (!code) {
      Alert.alert('Error', 'Please enter the verification code')
      return
    }

    setLoading(true)
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
        Alert.alert('Error', 'Verification failed. Please try again.')
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      Alert.alert('Error', err.errors?.[0]?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const resendCode = async () => {
    if (!isLoaded) return
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      Alert.alert('Success', 'Verification code sent!')
    } catch (err: any) {
      Alert.alert('Error', 'Failed to resend code')
    }
  }

  if (pendingVerification) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80'
          }}
          className="flex-1"
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
            className="flex-1"
          >
            <SafeAreaView className="flex-1">
              <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
              >
                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                  <Animated.View 
                    style={{
                      opacity: fadeAnim,
                      transform: [{ translateY: slideAnim }]
                    }}
                    className="flex-1 justify-center py-12"
                  >
                    {/* Header */}
                    <View className="items-center mb-8">
                      <View className="w-24 h-24 bg-green-600 rounded-full items-center justify-center mb-6 shadow-lg">
                        <Text className="text-white text-3xl">📧</Text>
                      </View>
                      <Text className="text-white text-3xl font-bold text-center mb-2">
                        Check Your Email
                      </Text>
                      <Text className="text-gray-300 text-center text-base leading-6 max-w-sm">
                        We've sent a 6-digit verification code to
                      </Text>
                      <Text className="text-amber-400 text-center font-semibold mt-1">
                        {emailAddress}
                      </Text>
                    </View>

                    {/* Verification Form */}
                    <View className="space-y-6">
                      <View>
                        <Text className="text-white text-sm font-medium mb-2 ml-1">
                          Verification Code
                        </Text>
                        <TextInput
                          className="bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white text-center text-2xl tracking-widest font-mono"
                          placeholder="000000"
                          placeholderTextColor="rgba(255,255,255,0.4)"
                          value={code}
                          onChangeText={setCode}
                          keyboardType="number-pad"
                          maxLength={6}
                          autoFocus
                        />
                      </View>

                      <TouchableOpacity 
                        onPress={onVerifyPress} 
                        disabled={loading || code.length < 6}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={code.length < 6 || loading ? ['#6b7280', '#4b5563'] : ['#f59e0b', '#d97706', '#b45309']}
                          className="py-4 px-8 rounded-xl shadow-lg"
                        >
                          <Text className="text-white text-lg font-bold text-center">
                            {loading ? 'Verifying...' : 'Verify Email'}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      {/* Resend Code */}
                      <View className="items-center space-y-3">
                        <Text className="text-gray-400 text-sm">
                          Didn't receive the code?
                        </Text>
                        <TouchableOpacity onPress={resendCode} activeOpacity={0.7}>
                          <Text className="text-amber-400 font-semibold text-base">
                            Resend Code
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {/* Back Button */}
                      <TouchableOpacity 
                        onPress={() => setPendingVerification(false)}
                        className="mt-8"
                        activeOpacity={0.7}
                      >
                        <View className="flex-row items-center justify-center">
                          <Text className="text-gray-300 text-base">← </Text>
                          <Text className="text-gray-300 text-base">Back to Sign Up</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                </ScrollView>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </LinearGradient>
        </ImageBackground>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80'
        }}
        className="flex-1"
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
          className="flex-1"
        >
          <SafeAreaView className="flex-1">
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className="flex-1"
            >
              <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                <Animated.View 
                  style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                  }}
                  className="flex-1 justify-center py-12"
                >
                  {/* Header */}
                  <View className="items-center mb-8">
                    <View className="w-24 h-24 bg-amber-600 rounded-full items-center justify-center mb-6 shadow-lg">
                      <Text className="text-white text-3xl">🐄</Text>
                    </View>
                    <Text className="text-white text-3xl font-bold text-center mb-2">
                      Join Our Community
                    </Text>
                    <Text className="text-gray-300 text-center text-base leading-6 max-w-sm">
                      Start trading livestock with trusted farmers across the region
                    </Text>
                  </View>

                  {/* Sign Up Form */}
                  <View className="space-y-6">
                    <View>
                      <Text className="text-white text-sm font-medium mb-2 ml-1">
                        Email Address
                      </Text>
                      <TextInput
                        className="bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white text-base"
                        placeholder="Enter your email"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        autoCapitalize="none"
                        value={emailAddress}
                        onChangeText={setEmailAddress}
                        keyboardType="email-address"
                        autoComplete="email"
                      />
                    </View>

                    <View>
                      <Text className="text-white text-sm font-medium mb-2 ml-1">
                        Password
                      </Text>
                      <TextInput
                        className="bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white text-base"
                        placeholder="Create a strong password"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        value={password}
                        secureTextEntry={true}
                        onChangeText={setPassword}
                        autoComplete="password-new"
                      />
                    </View>

                    <TouchableOpacity 
                      onPress={onSignUpPress} 
                      disabled={loading}
                      activeOpacity={0.8}
                      className="mt-8"
                    >
                      <LinearGradient
                        colors={loading ? ['#6b7280', '#4b5563'] : ['#f59e0b', '#d97706', '#b45309']}
                        className="py-4 px-8 rounded-xl shadow-lg"
                      >
                        <Text className="text-white text-lg font-bold text-center">
                          {loading ? 'Creating Account...' : 'Create Account'}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    {/* Terms & Privacy */}
                    <Text className="text-gray-400 text-xs text-center leading-5 max-w-sm mx-auto">
                      By creating an account, you agree to our Terms of Service and Privacy Policy
                    </Text>

                    {/* Sign In Link */}
                    <View className="flex-row justify-center items-center mt-6 space-x-1">
                      <Text className="text-gray-300 text-base">Already have an account?</Text>
                      <Link href="/sign-in" asChild>
                        <TouchableOpacity activeOpacity={0.7}>
                          <Text className="text-amber-400 font-semibold text-base ml-1">
                            Sign In
                          </Text>
                        </TouchableOpacity>
                      </Link>
                    </View>

                    {/* Trust Indicators */}
                    <View className="items-center mt-8">
                      <View className="bg-white/5 rounded-xl p-4 w-full">
                        <View className="flex-row justify-around">
                          <View className="items-center">
                            <Text className="text-2xl mb-1">🔒</Text>
                            <Text className="text-white text-xs font-medium">Secure</Text>
                          </View>
                          <View className="items-center">
                            <Text className="text-2xl mb-1">⚡</Text>
                            <Text className="text-white text-xs font-medium">Fast</Text>
                          </View>
                          <View className="items-center">
                            <Text className="text-2xl mb-1">🤝</Text>
                            <Text className="text-white text-xs font-medium">Trusted</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </Animated.View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaProvider>
  )
}


// import { useSignUp } from '@clerk/clerk-expo';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Link, router } from 'expo-router';
// import React, { useState } from 'react';
// import {
//   Alert,
//   ImageBackground,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';

// export default function SignUp() {
//   const { isLoaded, signUp, setActive } = useSignUp();
//   const [emailAddress, setEmailAddress] = useState('');
//   const [password, setPassword] = useState('');
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [pendingVerification, setPendingVerification] = useState(false);
//   const [code, setCode] = useState('');

//   const onSignUpPress = async () => {
//     if (!isLoaded) {
//       return;
//     }

//     try {
//       await signUp.create({
//         emailAddress,
//         password,
//         firstName,
//         lastName,
//       });

//       await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
//       setPendingVerification(true);
//     } catch (err: any) {
//       Alert.alert('Error', err.errors[0].message);
//     }
//   };

//   const onPressVerify = async () => {
//     if (!isLoaded) {
//       return;
//     }

//     try {
//       const completeSignUp = await signUp.attemptEmailAddressVerification({
//         code,
//       });

//       await setActive({ session: completeSignUp.createdSessionId });
//       router.replace('/');
//     } catch (err: any) {
//       Alert.alert('Error', err.errors[0].message);
//     }
//   };

//   return (
//     <SafeAreaProvider>
//       <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
//       <ImageBackground
//         source={{
//           uri: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80'
//         }}
//         className="flex-1"
//         resizeMode="cover"
//       >
//         <LinearGradient
//           colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
//           className="flex-1"
//         >
//           <SafeAreaView className="flex-1">
//             <ScrollView className="flex-1 px-6">
//               {!pendingVerification && (
//                 <View className="flex-1 justify-center py-8">
//                   {/* Header */}
//                   <View className="items-center mb-8">
//                     <View className="w-20 h-20 bg-amber-600 rounded-full items-center justify-center mb-4">
//                       <Text className="text-white text-2xl">🐄</Text>
//                     </View>
//                     <Text className="text-white text-2xl font-bold text-center">
//                       Join Our Community
//                     </Text>
//                     <Text className="text-gray-300 text-center mt-2">
//                       Start trading livestock today
//                     </Text>
//                   </View>

//                   {/* Form */}
//                   <View className="space-y-4">
//                     <View className="flex-row space-x-3">
//                       <TextInput
//                         className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
//                         placeholder="First Name"
//                         placeholderTextColor="rgba(255,255,255,0.6)"
//                         value={firstName}
//                         onChangeText={setFirstName}
//                       />
//                       <TextInput
//                         className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
//                         placeholder="Last Name"
//                         placeholderTextColor="rgba(255,255,255,0.6)"
//                         value={lastName}
//                         onChangeText={setLastName}
//                       />
//                     </View>

//                     <TextInput
//                       className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
//                       placeholder="Email Address"
//                       placeholderTextColor="rgba(255,255,255,0.6)"
//                       value={emailAddress}
//                       onChangeText={setEmailAddress}
//                       keyboardType="email-address"
//                       autoCapitalize="none"
//                     />

//                     <TextInput
//                       className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
//                       placeholder="Password"
//                       placeholderTextColor="rgba(255,255,255,0.6)"
//                       value={password}
//                       onChangeText={setPassword}
//                       secureTextEntry
//                     />

//                     <TouchableOpacity onPress={onSignUpPress} className="mt-6">
//                       <LinearGradient
//                         colors={['#f59e0b', '#d97706']}
//                         className="py-4 rounded-lg"
//                       >
//                         <Text className="text-white text-lg font-bold text-center">
//                           Create Account
//                         </Text>
//                       </LinearGradient>
//                     </TouchableOpacity>

//                     <View className="flex-row justify-center items-center mt-6">
//                       <Text className="text-gray-300">Already have an account? </Text>
//                       <Link href="/sign-in" asChild>
//                         <TouchableOpacity onPress={
//                           () => router.push('/sign-in')
//                         }>
//                           <Text className="text-amber-400 font-semibold">Sign In</Text>
//                         </TouchableOpacity>
//                       </Link>
//                     </View>
//                   </View>
//                 </View>
//               )}

//               {pendingVerification && (
//                 <View className="flex-1 justify-center py-8">
//                   <View className="items-center mb-8">
//                     <Text className="text-white text-2xl font-bold text-center mb-4">
//                       Verify Your Email
//                     </Text>
//                     <Text className="text-gray-300 text-center">
//                       We have sent a verification code to {emailAddress}
//                     </Text>
//                   </View>

//                   <TextInput
//                     className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-center text-2xl tracking-widest mb-6"
//                     placeholder="Enter code"
//                     placeholderTextColor="rgba(255,255,255,0.6)"
//                     value={code}
//                     onChangeText={setCode}
//                     keyboardType="number-pad"
//                     maxLength={6}
//                   />

//                   <TouchableOpacity onPress={onPressVerify}>
//                     <LinearGradient
//                       colors={['#f59e0b', '#d97706']}
//                       className="py-4 rounded-lg"
//                     >
//                       <Text className="text-white text-lg font-bold text-center">
//                         Verify Email
//                       </Text>
//                     </LinearGradient>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </ScrollView>
//           </SafeAreaView>
//         </LinearGradient>
//       </ImageBackground>
//     </SafeAreaProvider>
//   );
// }