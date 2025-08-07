import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  const router = useRouter();

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    // Navigate to sign up page
    router.push('/sign-up')
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80'
        }}
        className="flex-1"
        resizeMode="cover"
      >
        {/* Overlay Gradient */}
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
          className="flex-1"
        >
          <SafeAreaView className="flex-1">
            <View className="flex-1 justify-between px-6 py-8">
              
              {/* Header Section */}
              <Animated.View 
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }}
                className="items-center mt-12"
              >
                {/* App Logo/Icon Area */}
                <View className="w-24 h-24 bg-amber-600 rounded-full items-center justify-center mb-6 shadow-lg">
                  <Text className="text-white text-3xl font-bold">🐄</Text>
                </View>
                
                {/* App Title */}
                <Text className="text-white text-3xl font-bold text-center mb-2">
                  Northern Eastern
                </Text>
                <Text className="text-amber-400 text-2xl font-semibold text-center mb-2">
                  LiveStock Market
                </Text>
                <Text className="text-gray-200 text-base text-center leading-6 max-w-xs">
                  Connect with buyers and sellers in the largest livestock marketplace
                </Text>
              </Animated.View>

              {/* Middle Content - Features */}
              <Animated.View 
                style={{
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }]
                }}
                className="items-center"
              >
                <View className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mx-4">
                  <View className="flex-row justify-around mb-4">
                    <View className="items-center">
                      <View className="w-12 h-12 bg-green-600 rounded-full items-center justify-center mb-2">
                        <Text className="text-white text-lg">🛒</Text>
                      </View>
                      <Text className="text-white text-xs font-medium">Buy</Text>
                    </View>
                    <View className="items-center">
                      <View className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center mb-2">
                        <Text className="text-white text-lg">💰</Text>
                      </View>
                      <Text className="text-white text-xs font-medium">Sell</Text>
                    </View>
                    <View className="items-center">
                      <View className="w-12 h-12 bg-purple-600 rounded-full items-center justify-center mb-2">
                        <Text className="text-white text-lg">🤝</Text>
                      </View>
                      <Text className="text-white text-xs font-medium">Connect</Text>
                    </View>
                  </View>
                  <Text className="text-gray-200 text-center text-sm">
                    Trade cattle, goats, sheep and more with trusted farmers
                  </Text>
                </View>
              </Animated.View>

              {/* Bottom Section - CTA */}
              <Animated.View 
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }}
                className="items-center"
              >
                {/* Get Started Button */}
                <TouchableOpacity
                  onPress={handleGetStarted}
                  activeOpacity={0.8}
                  className="w-full"
                >
                  <LinearGradient
                    colors={['#f59e0b', '#d97706', '#b45309']}
                    className="py-4 px-8 rounded-full shadow-lg"
                  >
                    <Text className="text-white text-lg font-bold text-center">
                      Get Started
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Secondary Info */}
                <Text className="text-gray-300 text-sm text-center mt-4 mb-2">
                  Join thousands of farmers trading daily
                </Text>
                
                {/* Trust Indicators */}
                <View className="flex-row items-center space-x-4 mt-2">
                  <View className="flex-row items-center">
                    <Text className="text-yellow-400 text-xs">⭐⭐⭐⭐⭐</Text>
                    <Text className="text-gray-300 text-xs ml-1">4.8</Text>
                  </View>
                  <View className="w-1 h-1 bg-gray-400 rounded-full" />
                  <Text className="text-gray-300 text-xs">10K+ Users</Text>
                  <View className="w-1 h-1 bg-gray-400 rounded-full" />
                  <Text className="text-gray-300 text-xs">Trusted & Secure</Text>
                </View>

                {/* Bottom Safe Area Padding */}
                <View className="h-4" />
              </Animated.View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaProvider>
  );
}