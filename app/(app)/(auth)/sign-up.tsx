import GoogleSignIn from '@/components/GoogleSignIn'
import { useSignUp } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import * as React from 'react'
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

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [emailFocused, setEmailFocused] = React.useState(false)
  const [passwordFocused, setPasswordFocused] = React.useState(false)
  const [codeFocused, setCodeFocused] = React.useState(false)
  const [errors, setErrors] = React.useState({ email: '', password: '', code: '' })
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current
  const shakeAnim = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
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

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return
    
    // Reset errors
    setErrors({ email: '', password: '', code: '' })
    
    // Validation
    let hasErrors = false
    const newErrors = { email: '', password: '', code: '' }
    
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
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
      hasErrors = true
    }
    
    if (hasErrors) {
      setErrors(newErrors)
      shakeInput()
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
    } catch (err) {
      Alert.alert('Error', err.errors?.[0]?.longMessage || 'Something went wrong')
      console.error(JSON.stringify(err, null, 2))
      shakeInput()
    } finally {
      setLoading(false)
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    // Reset errors
    setErrors({ email: '', password: '', code: '' })

    if (!code.trim()) {
      setErrors(prev => ({ ...prev, code: 'Verification code is required' }))
      shakeInput()
      return
    }

    if (code.length !== 6) {
      setErrors(prev => ({ ...prev, code: 'Code must be 6 digits' }))
      shakeInput()
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
        shakeInput()
      }
    } catch (err) {
      Alert.alert('Error', err.errors?.[0]?.longMessage || 'Verification failed')
      console.error(JSON.stringify(err, null, 2))
      shakeInput()
    } finally {
      setLoading(false)
    }
  }

  // Verification Screen
  if (pendingVerification) {
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
              {/* Header */}
              <View className='items-center mb-8'>
                <View className='w-16 h-16 bg-green-100 rounded-2xl items-center justify-center mb-4'>
                  <Ionicons name='mail' size={28} color='#10B981'/>
                </View>
                <Text className='text-2xl font-bold text-gray-900 mb-2 text-center'>Verify Your Email</Text>
                <Text className='text-gray-600 text-center text-sm px-4'>
                  We've sent a 6-digit code to {'\n'}{emailAddress}
                </Text>
              </View>

              {/* Verification Form */}
              <View className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 mx-4'>
                <View className='mb-6'>
                  <Text className='text-sm font-medium text-gray-700 mb-2'>
                    Verification Code
                  </Text>

                  <View className={`flex-row items-center rounded-xl px-4 py-4 border ${
                    errors.code 
                      ? 'bg-red-50 border-red-300' 
                      : codeFocused 
                        ? 'bg-blue-50 border-blue-300' 
                        : 'bg-gray-50 border-gray-200'
                  }`}>
                    <Ionicons 
                      name='keypad-outline' 
                      size={20} 
                      color={errors.code ? "#DC2626" : codeFocused ? "#3B82F6" : "#6B7280"}
                    />
                    <TextInput
                      value={code}
                      placeholder='Enter 6-digit code'
                      placeholderTextColor="#9CA3AF"
                      onChangeText={(text) => {
                        setCode(text)
                        if (errors.code) setErrors(prev => ({ ...prev, code: '' }))
                      }}
                      onFocus={() => setCodeFocused(true)}
                      onBlur={() => setCodeFocused(false)}
                      className='flex-1 ml-3 text-gray-900 text-center text-lg tracking-widest'
                      editable={!loading}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  </View>
                  {errors.code && (
                    <Text className='text-red-500 text-xs mt-1 ml-1'>{errors.code}</Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={onVerifyPress}
                  disabled={loading}
                  className={`rounded-xl py-4 shadow-sm mb-4 ${
                    loading ? 'bg-gray-400' : 'bg-green-600'
                  } flex-row items-center justify-center`}
                  activeOpacity={0.8}
                >
                  <View className='flex-row items-center justify-center'>
                    {loading ? (
                      <Ionicons name='refresh' size={20} color="white"/>
                    ) : (
                      <Ionicons name='checkmark-outline' size={20} color="white"/>
                    )}
                    <Text className='text-white font-semibold text-lg ml-2'>
                      {loading ? "Verifying..." : "Verify Account"}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => setPendingVerification(false)}
                  className='items-center py-2'
                >
                  <Text className='text-green-600 font-medium'>← Back to sign up</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </>
    )
  }

  // Main Sign Up Screen
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
            {/* Header section */}
            <View className='items-center mb-8'>
              <View className='w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-lg'>
                <Ionicons name='storefront' size={28} color='#FFFFFF'/>
              </View>
              <Text className='text-2xl font-bold text-gray-900 mb-1 text-center'>Northern Kenya</Text>
              <Text className='text-xl font-bold text-green-600 mb-2 text-center'>Livestock Market</Text>
              <Text className='text-gray-600 text-center text-sm px-4'>Connect with farmers and buyers in your area</Text>
            </View>

            {/* Sign Up Form */}
            <View className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 mx-4'>
              <Text className='text-2xl font-bold text-gray-900 mb-6 text-center'>
                Create Account
              </Text>

              {/* Email Input */}
              <View className='mb-4'>
                <Text className='text-sm font-medium text-gray-700 mb-2'>
                  Email Address
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
                    editable={!loading}
                    keyboardType="email-address"
                  />
                </View>
                {errors.email && (
                  <Text className='text-red-500 text-xs mt-1 ml-1'>{errors.email}</Text>
                )}
              </View>

              {/* Password Input */}
              <View className='mb-4'>
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
                    placeholder='Create password'
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    onChangeText={(text) => {
                      setPassword(text)
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
                    }}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className='flex-1 ml-3 text-gray-900'
                    editable={!loading}
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
                <Text className='text-xs text-gray-500 mt-1 ml-1'>
                  Password must be at least 8 characters
                </Text>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                onPress={onSignUpPress}
                disabled={loading}
                className={`rounded-xl py-4 shadow-sm mb-4 mt-2 ${
                  loading ? 'bg-gray-400' : 'bg-green-600'
                } flex-row items-center justify-center`}
                activeOpacity={0.8}
              >
                <View className='flex-row items-center justify-center'>
                  {loading ? (
                    <Ionicons name='refresh' size={20} color="white"/>
                  ) : (
                    <Ionicons name='person-add-outline' size={20} color="white"/>
                  )}
                  <Text className='text-white font-semibold text-lg ml-2'>
                    {loading ? "Creating Account..." : "Create Account"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Divider */}
              <View className='flex-row items-center my-4'>
                <View className='flex-1 h-px bg-gray-300'/>
                <Text className='mx-4 text-gray-500'>or</Text>
                <View className='flex-1 h-px bg-gray-300'/>
              </View>

              {/* Google Sign In Button */}
              <GoogleSignIn />

              {/* Sign In Link */}
              <View className='flex-row justify-center items-center mt-4'>
                <Text className='text-gray-600'>Already have an account? </Text>
                <Link href="/sign-in" asChild>
                  <TouchableOpacity>
                    <Text className='text-green-600 font-semibold'>Sign in</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>

            {/* Features */}
            <View className='px-6 pb-4'>
              <View className='flex-row justify-around items-center'>
                <View className='flex-row items-center'>
                  <Ionicons name="shield-checkmark-outline" size={16} color="#10B981" />
                  <Text className='text-xs text-gray-600 ml-1'>Secure</Text>
                </View>
                <View className='flex-row items-center'>
                  <Ionicons name="location-outline" size={16} color="#10B981" />
                  <Text className='text-xs text-gray-600 ml-1'>Local</Text>
                </View>
                <View className='flex-row items-center'>
                  <Ionicons name="trending-up-outline" size={16} color="#10B981" />
                  <Text className='text-xs text-gray-600 ml-1'>Real-time</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  )
}



// import { useSignUp } from '@clerk/clerk-expo'
// import { Link, useRouter } from 'expo-router'
// import * as React from 'react'
// import { Text, TextInput, TouchableOpacity, View } from 'react-native'

// export default function SignUpScreen() {
//   const { isLoaded, signUp, setActive } = useSignUp()
//   const router = useRouter()

//   const [emailAddress, setEmailAddress] = React.useState('')
//   const [password, setPassword] = React.useState('')
//   const [pendingVerification, setPendingVerification] = React.useState(false)
//   const [code, setCode] = React.useState('')

//   // Handle submission of sign-up form
//   const onSignUpPress = async () => {
//     if (!isLoaded) return

//     // Start sign-up process using email and password provided
//     try {
//       await signUp.create({
//         emailAddress,
//         password,
//       })

//       // Send user an email with verification code
//       await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

//       // Set 'pendingVerification' to true to display second form
//       // and capture OTP code
//       setPendingVerification(true)
//     } catch (err) {
//       // See https://clerk.com/docs/custom-flows/error-handling
//       // for more info on error handling
//       console.error(JSON.stringify(err, null, 2))
//     }
//   }

//   // Handle submission of verification form
//   const onVerifyPress = async () => {
//     if (!isLoaded) return

//     try {
//       // Use the code the user provided to attempt verification
//       const signUpAttempt = await signUp.attemptEmailAddressVerification({
//         code,
//       })

//       // If verification was completed, set the session to active
//       // and redirect the user
//       if (signUpAttempt.status === 'complete') {
//         await setActive({ session: signUpAttempt.createdSessionId })
//         router.replace('/')
//       } else {
//         // If the status is not complete, check why. User may need to
//         // complete further steps.
//         console.error(JSON.stringify(signUpAttempt, null, 2))
//       }
//     } catch (err) {
//       // See https://clerk.com/docs/custom-flows/error-handling
//       // for more info on error handling
//       console.error(JSON.stringify(err, null, 2))
//     }
//   }

//   if (pendingVerification) {
//     return (
//       <>
//         <Text>Verify your email</Text>
//         <TextInput
//           value={code}
//           placeholder="Enter your verification code"
//           onChangeText={(code) => setCode(code)}
//         />
//         <TouchableOpacity onPress={onVerifyPress}>
//           <Text>Verify</Text>
//         </TouchableOpacity>
//       </>
//     )
//   }

//   return (
//     <View>
//       <>
//         <Text>Sign up</Text>
//         <TextInput
//           autoCapitalize="none"
//           value={emailAddress}
//           placeholder="Enter email"
//           onChangeText={(email) => setEmailAddress(email)}
//         />
//         <TextInput
//           value={password}
//           placeholder="Enter password"
//           secureTextEntry={true}
//           onChangeText={(password) => setPassword(password)}
//         />
//         <TouchableOpacity onPress={onSignUpPress}>
//           <Text>Continue</Text>
//         </TouchableOpacity>
//         <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
//           <Text>Already have an account?</Text>
//           <Link href="/sign-in">
//             <Text>Sign in</Text>
//           </Link>
//         </View>
//       </>
//     </View>
//   )
// }