import { View, Text } from "react-native";
import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Home from "../screens/Home";
import { COLORS } from "../constants/theme";
import Profile from "../screens/Profile";
import Cart from "../screens/Cart";
import LoginPage from "../screens/LoginPage";
import { LoginContext } from "../context/LoginContext";
import PredictScreen from "../screens/PredictScreen";



const Tab = createBottomTabNavigator();

const tabBarStyle = {
  backgroundColor: '#5DC58A',
  borderTopWidth: 0,
  elevation: 0, 
  shadowOpacity: 0,
};

const BottomTab = () => {
  
  const {login, setLogin} = useContext(LoginContext)

 
  
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor={COLORS.secondary}
      tabBarHideKeyBoard={true}
      headerShown={false}
      inactiveColor="#3e2465"
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarStyle: tabBarStyle,
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "grid" : "grid-outline"}
              color={focused ? COLORS.secondary : COLORS.secondary1}
              size={26}
            />
          ),
        }}
      />

      <Tab.Screen
        name="PredictScreen"
        component={PredictScreen}
        options={{
          tabBarStyle: tabBarStyle,
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "search" : "search"}
              color={focused ? COLORS.secondary : COLORS.secondary1}
              size={26}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarStyle: tabBarStyle,
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 26, height: 26, position: 'relative' }}>
            <FontAwesome
                name={
                    focused ? "opencart" : "opencart"
                }
                color={focused ? COLORS.secondary : COLORS.secondary1}
                size={26}
            />
            
            
        </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={login ? Profile : LoginPage }
        options={{
          tabBarStyle: tabBarStyle,
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={focused ? COLORS.secondary : COLORS.secondary1}
              size={26}
            />
          ),
        }}
      />

            


    </Tab.Navigator>
  );
};

export default BottomTab;
