import { useSignIn } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import React from 'react';
import {
  Alert,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      await setActive({ session: completeSignIn.createdSessionId });
      router.replace('/');
    } catch (err: any) {
      Alert.alert('Error', err.errors[0].message);
    }
  };

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
            <ScrollView className="flex-1 px-6">
              <View className="flex-1 justify-center py-8">
                {/* Header */}
                <View className="items-center mb-8">
                  <View className="w-20 h-20 bg-amber-600 rounded-full items-center justify-center mb-4">
                    <Text className="text-white text-2xl">🐄</Text>
                  </View>
                  <Text className="text-white text-2xl font-bold text-center">
                    Welcome Back
                  </Text>
                  <Text className="text-gray-300 text-center mt-2">
                    Sign in to continue trading
                  </Text>
                </View>

                {/* Form */}
                <View className="space-y-4">
                  <TextInput
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                    placeholder="Email Address"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  <TextInput
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                    placeholder="Password"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />

                  <TouchableOpacity onPress={onSignInPress} className="mt-6">
                    <LinearGradient
                      colors={['#f59e0b', '#d97706']}
                      className="py-4 rounded-lg"
                    >
                      <Text className="text-white text-lg font-bold text-center">
                        Sign In
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity className="mt-4">
                    <Text className="text-amber-400 text-center">
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>

                  <View className="flex-row justify-center items-center mt-6">
                    <Text className="text-gray-300">Don't have an account? </Text>
                    <Link href="/sign-up" asChild>
                      <TouchableOpacity>
                        <Text className="text-amber-400 font-semibold">Sign Up</Text>
                      </TouchableOpacity>
                    </Link>
                  </View>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaProvider>
  );
}