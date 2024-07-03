import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';  
import React, { useState, useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from "expo-splash-screen";
import * as Location from 'expo-location';
import BottomTab from './app/navigation/BottomTab';
import SignUp from './app/screens/SignUp';
import Profile from './app/screens/Profile';
import Home from './app/screens/Home';

import { UserLocationContext } from './app/context/UserLocationContext';
import { LoginContext } from './app/context/LoginContext';
import { CartProvider } from './app/context/CartCountContext';
import { UserReversedGeoCode } from './app/context/UserReversedGeoCode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductsScreen from './app/screens/ProductsScreen';
import ProductPage from './app/screens/ProductPage';
import EditProfileScreen from './app/screens/EditProfileScreen';
import PredictScreen from './app/screens/PredictScreen';
import PredictionScreen from './app/screens/PredictionScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  const [login, setLogin] = useState(false);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setErrorMsg] = useState(null);

  const defaultAddresss = {
    "city": "Astana",
    "country": "Kazakhstan",
    "district": "Esil",
    "isoCountryCode": "KZ",
    "name": "",
    "postalCode": "010000",
    "region": "NQZ",
    "street": "",
    "streetNumber": "",
    "subregion": "",
    "timezone": ""
  };

  const [fontsLoaded] = useFonts({
    regular: require('./assets/fonts/Poppins-Regular.ttf'),
    light: require('./assets/fonts/Poppins-Light.ttf'),
    bold: require('./assets/fonts/Poppins-Bold.ttf'),
    medium: require('./assets/fonts/Poppins-Medium.ttf'),
    extrabold: require('./assets/fonts/Poppins-ExtraBold.ttf'),
    semibold: require('./assets/fonts/Poppins-SemiBold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    (async () => {
      setAddress(defaultAddresss);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location);
      await loginStatus();
    })();
  }, []);

  if (!fontsLoaded) {
    // Return a loading indicator or splash screen while fonts are loading or app is initializing
    return null;
  }

const loginStatus = async () => {
    try {
        console.log("Checking login status...");
        const userToken = await AsyncStorage.getItem('token');
        console.log("Retrieved token:", userToken);
        if (userToken) {
            setLogin(true);
        } else {
            setLogin(false);
        }
    } catch (error) {
        console.error("Error retrieving token:", error);
        setLogin(false);
    }
    console.log('Login status:', login);
    console.log('logout status', logout)
};


  const inValidForm = () => {
    Alert.alert("Invalid Form", "Please provide all required fields", [
      {
        text: "Cancel",
        onPress: () => {},
      },
      {
        text: "Continue",
        onPress: () => {},
      },
      { defaultIndex: 1 },
    ]);
  };

  return (
    <CartProvider>
      <UserLocationContext.Provider value={{ location, setLocation }}>
        <UserReversedGeoCode.Provider value={{ address, setAddress }}>
          <LoginContext.Provider value={{ login, setLogin }}>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen
                  name='bottom-navigation'
                  component={BottomTab}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name='signUp'
                  component={SignUp}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name='Profile'
                  component={Profile}
                  options={{ headerShown: false }}
                />
        
                <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                <Stack.Screen name="ProductsScreen" component={ProductsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ProductPage" component={ProductPage} options={{ headerShown: false }} />
                <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
                <Stack.Screen name="PredictScreen" component={PredictScreen} options={{ headerShown: false }} />
                <Stack.Screen name="PredictionScreen" component={PredictionScreen} options={{ headerShown: false }} />
              </Stack.Navigator>
            </NavigationContainer>
          </LoginContext.Provider>
        </UserReversedGeoCode.Provider>
      </UserLocationContext.Provider>
    </CartProvider>
  );
}
