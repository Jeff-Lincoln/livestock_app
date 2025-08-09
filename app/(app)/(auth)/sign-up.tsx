import GoogleSignIn from '@/components/GoogleSignIn'
import { useSignUp } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import * as React from 'react'
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    setIsLoading(true)

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
      Alert.alert('Error', 'Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    setIsLoading(true)

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
      Alert.alert('Error', 'Invalid verification code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Verification screen
  if (pendingVerification) {
    return (
      <SafeAreaView className='flex-1 bg-gray-50'>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className='flex-1'
        >
          <View className='flex-1 px-6'>
            <View className='flex-1 justify-center'>
              {/* Header */}
              <View className='items-center mb-8'>
                <View className='w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-lg'>
                  <Ionicons name='mail-outline' size={40} color='#4FACFE'/>
                </View>
                <Text className='text-3xl font-bold text-gray-900 mb-2 text-center'>Check Your Email</Text>
                <Text className='text-gray-600 text-center px-4'>
                  We've sent a verification code to {emailAddress}
                </Text>
              </View>

              {/* Verification Form */}
              <View className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6'>
                <Text className='text-xl font-bold text-gray-900 mb-6 text-center'>
                  Enter Verification Code
                </Text>
                
                <View className='mb-6'>
                  <View className='flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
                    <Ionicons name='keypad-outline' size={20} color="#6B7280"/>
                    <TextInput
                      value={code}
                      placeholder="Enter 6-digit code"
                      placeholderTextColor="#9CA3AF"
                      onChangeText={setCode}
                      className='flex-1 ml-3 text-gray-900 text-center text-lg tracking-widest font-semibold'
                      keyboardType='number-pad'
                      maxLength={6}
                      editable={!isLoading}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={onVerifyPress}
                  disabled={isLoading || code.length !== 6}
                  className={`rounded-xl py-4 shadow-sm ${
                    isLoading || code.length !== 6 ? 'bg-gray-400' : 'bg-green-600'
                  }`}
                  activeOpacity={0.8}
                >
                  <View className='flex-row items-center justify-center'>
                    {isLoading ? (
                      <Ionicons name='refresh' size={20} color="white"/>
                    ) : (
                      <Ionicons name='checkmark-circle-outline' size={20} color="white"/>
                    )}
                    <Text className='text-white font-semibold text-lg ml-2'>
                      {isLoading ? "Verifying..." : "Verify Account"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Resend code */}
              <View className='flex-row items-center justify-center'>
                <Text className='text-sm text-gray-500 mr-2'>Didn't receive the code?</Text>
                <TouchableOpacity>
                  <Text className='text-sm text-orange-600 font-semibold'>
                    Resend Code
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  // Main sign-up screen
  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <View className='flex-1 px-6'>
          {/* Header section */}
          <View className='flex-1 justify-center'>
            {/* Logo branding */}
            <View className='items-center mb-8'>
              <View className='w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-lg'>
                <Ionicons name='person-add-outline' size={40} color='#4FACFE'/>
              </View>
              <Text className='text-3xl font-bold text-gray-900 mb-2 text-center'>Northern Kenya</Text>
              <Text className='text-2xl font-bold text-green-600 mb-2 text-center'>Livestock Market</Text>
              <Text className='text-gray-700 text-center'>Create your account to start trading</Text>
            </View>

            {/* Sign up form */}
            <View className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6'>
              <Text className='text-2xl font-bold text-gray-900 mb-6 text-center'>
                Create Account
              </Text>

              {/* Email Input */}
              <View className='mb-4'>
                <Text className='text-sm font-medium text-gray-700 mb-2'>
                  Email
                </Text>
                <View className='flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200'>
                  <Ionicons name='mail-outline' size={20} color="#6B7280"/>
                  <TextInput
                    autoCapitalize='none'
                    value={emailAddress}
                    placeholder='Enter your email'
                    placeholderTextColor="#9CA3AF"
                    onChangeText={setEmailAddress}
                    className='flex-1 ml-3 text-gray-900'
                    keyboardType='email-address'
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className='mb-6'>
                <Text className='text-sm font-medium text-gray-700 mb-2'>
                  Password
                </Text>
                <View className='flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200'>
                  <Ionicons name='lock-closed-outline' size={20} color="#6B7280"/>
                  <TextInput
                    value={password}
                    placeholder='Enter your password'
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    onChangeText={setPassword}
                    className='flex-1 ml-3 text-gray-900'
                    editable={!isLoading}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons 
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                      size={20} 
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={onSignUpPress}
              disabled={isLoading || !emailAddress || !password}
              className={`rounded-xl py-4 shadow-sm mb-4 ${
                isLoading || !emailAddress || !password ? 'bg-gray-400' : 'bg-green-600'
              }`}
              activeOpacity={0.8}
            >
              <View className='flex-row items-center justify-center'>
                {isLoading ? (
                  <Ionicons name='refresh' size={20} color="white"/>
                ) : (
                  <Ionicons name='person-add-outline' size={20} color="white"/>
                )}
                <Text className='text-white font-semibold text-lg ml-2'>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Divider */}
            <View className='flex-row items-center my-2'>
              <View className='flex-1 h-px bg-gray-300'/>
              <Text className='mx-4 text-gray-500'>or</Text>
              <View className='flex-1 h-px bg-gray-300'/>
            </View>

            {/* Google Sign In Button */}
            <GoogleSignIn />

            {/* Sign in link */}
            <View className='flex-row items-center justify-center pb-4 mt-3'>
              <Text className='text-sm text-gray-500 mr-2'>Already have an account?</Text>
              <Link href='/sign-in' className='text-sm text-orange-600 font-semibold'>
                Sign In
              </Link>
            </View>
          </View>

          {/* Footer */}
          <View className='px-6 pb-4'>
            <Text className='text-sm text-gray-500 text-center'>
              By continuing, you agree to our
              <Text className='text-orange-600 font-semibold'> Terms of Service</Text>
              {' '}and{' '}
              <Text className='text-orange-600 font-semibold'>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

// import { useSignUp } from '@clerk/clerk-expo'
// import { Ionicons } from '@expo/vector-icons'
// import { Link, useRouter } from 'expo-router'
// import * as React from 'react'
// import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'

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
//     <SafeAreaView className='flex-1 bg-gray-50'>
//       <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       className='flex-1'>
        
//         <View className='flex-1 px-6'>

//           {/**Main */}
//           <View className='flex-1 justify-center'>
//             {/** Logo Branding */}
//             <View className='items-center mb-8'>
//               <View className='flex-1 justify-center'>
//                 <View className='w-20 h-20 bg-gradient-to-br from-blue-600
//                 to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-lg'>
//                   <Ionicons name="fitness" size={40} color="green" />
//                 </View>
//                 <Text className='text-3xl font-bold text-red-800 mt-3'>
//                   Join WanyamaMart
//                 </Text>
//               </View>
//             </View>
//           </View>
//           {/**Footer */}

//         </View>



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
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   )
// }