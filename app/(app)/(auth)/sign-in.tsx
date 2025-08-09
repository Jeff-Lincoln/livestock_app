
  import GoogleSignIn from '@/components/GoogleSignIn'
import { useSignIn } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

  export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('')

    // Handle the submission of the sign-in form
    const onSignInPress = async () => {
      if (!isLoaded) return

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
        }
      } catch (err) {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2))
      }
    }

    return (
      <SafeAreaView className='flex-1'>
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
        >
          <View className=' flex-1 px-6'>

          {/* Header section */}

          <View className='flex-1 justify-center'>
            {/*logo branding can go here*/}
            <View className='items-center mb-8'>
              <View className='w-35 h-35 bg-gradient-to-br from-blue-600
              to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-lg'>
                <Ionicons name='unlink-sharp' size={40} color='#4FACFE'/>
              </View>
              <Text className='text-3xl font-bold text-gray-900 mb-2 text-center'>Northern Kenya</Text>
              <Text className='text-2xl font-bold text-green-600 mb-2 text-center'>Livestock Market</Text>
              <Text className='text-gray-700 text-center'>Join the smarter way to buy and sell livestock.</Text>
            </View>
          


          {/** Sign in form */}
          <View className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6'>
            <Text className='text-2xl font-bold text-gray-900 mb-6 text-center'>
              Welcome Back!
            </Text>
              
              {/** Email Input */}
              <View className='mb-4'>
                <Text className='text-sm font-medium text-gay-700 mb-2'>
                  Email
                </Text>

                <View className='flex-row items-center bg-gray-50
                rounded-xl px-4 py-2 border border-gray-200'>
                  <Ionicons name='mail-outline' size={20} color="#6B7280"/>
                  <TextInput
                  autoCapitalize='none'
                  value={emailAddress}
                  placeholder='Enter you email'
                  placeholderTextColor="#9CA3AF"
                  onChangeText={setEmailAddress}
                  className='flex-1 ml-3 text-gray-900'
                  editable={!isLoading}
                  />
                </View>
              </View>

              {/** Password Input */}
              <View className='mb-6'>
                <Text className='text-sm font-medium text-gray-700 mb-2'>
                  Password
                </Text>
                <View className='flex-row items-center bg-gray-50 rounded-xl
                px-4 py-2 border border-gray-200'>
                  <Ionicons name='lock-closed-outline' size={20} color="#6B7280"/>
                  <TextInput
                    value={password}
                    placeholder='Enter your password'
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    className='flex-1 ml-3 text-gray-900'
                    editable={!isLoading}
                  />
                </View>
              </View>
          </View>

          {/** Sign In Button */}

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
          <View className='flex-row items-center my-2'>
            <View className='flex-1 h-px bg-gray-300'/>
            <Text className='mx-4 text-gray-500'>or</Text>
            <View className='flex-1 h-px bg-gray-300'/>
          </View>

          {/** Google Sign In Button */}
          <GoogleSignIn />

          {/**Sign up link */}
        <View className='flex-row items-center justify-center pb-4 mt-3'>
          <Text className='text-sm text-gray-500 mr-2'>Don't have an account?</Text>
          <Link href='/sign-up' className='text-sm text-orange-600 font-semibold'>
            Sign Up
          </Link>
        </View>

        </View>



        {/** footer */}

        <View className='px-6 pb-4'>
          <Text className='text-sm text-gray-500 text-center'>
            By continuing, you agree to our
            <Text className='text-orange-600 font-semibold'> Terms of Service</Text>
             and
            <Text className='text-orange-600 font-semibold'> Privacy Policy</Text>
          </Text>
        </View>
      </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }




// import { useSignIn } from '@clerk/clerk-expo'
// import { Ionicons } from '@expo/vector-icons'
// import { Link, useRouter } from 'expo-router'
// import React, { useState } from 'react'
// import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'

// export default function Page() {
//   const { signIn, setActive, isLoaded } = useSignIn()
//   const router = useRouter()

//   const [emailAddress, setEmailAddress] = useState('');
//   const [password, setPassword] = useState('')

//   // Handle the submission of the sign-in form
//   const onSignInPress = async () => {
//     if (!isLoaded) return

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
//       }
//     } catch (err) {
//       // See https://clerk.com/docs/custom-flows/error-handling
//       // for more info on error handling
//       console.error(JSON.stringify(err, null, 2))
//     }
//   }

//   return (
//     <SafeAreaView className='flex-1 bg-white p-4'>
//       <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       >

//         {/* Header section */}

//         <View className='flex-1 justify-center items-center'>
//           {/*logo branding can go here*/}
//           <View className='w-20 h-20 bg-gradient-to-br from-blue-600
//           to-purple-600 rounded-2xl items-center justify-center mb-4
//           shadow-lg'>
//             <Ionicons name='storefront' size={40} color='#4FACFE'/>
//           </View>
//           <Text className='text-3xl font-bold text-gray-900 mb-2'>LiveStock MarketPlace Kenya</Text>
//         </View>
//       <Text>Sign in</Text>
//       <TextInput
//         autoCapitalize="none"
//         value={emailAddress}
//         placeholder="Enter email"
//         onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
//       />
//       <TextInput
//         value={password}
//         placeholder="Enter password"
//         secureTextEntry={true}
//         onChangeText={(password) => setPassword(password)}
//       />
//       <TouchableOpacity onPress={onSignInPress}>
//         <Text>Continue</Text>
//       </TouchableOpacity>
//       <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
//         <Link href="/sign-up">
//           <Text>Sign up</Text>
//         </Link>
//       </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   )
// }