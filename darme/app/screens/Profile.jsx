import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from "react-native"; 
import React, { useState, useContext } from "react"; 
import { COLORS, SIZES } from "../constants/theme"; 
import { AntDesign, Ionicons } from "@expo/vector-icons"; 
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginContext } from "../context/LoginContext";

const Profile = ({ navigation }) => { 
  const { login, setLogin } = useContext(LoginContext);
  const [user, setUser] = useState({ 
    username: "Daniel Choi", 
    mobile: "+78449334556", 
    profile: require('../../assets/logo_1.jpg'), 
  }); 

  const logout = async () => {
    try {
      const response = await axios.post('http:/172.20.10.2:3000/auth/logout');
      if (response.status === 200) {
        await AsyncStorage.removeItem('token');
        setLogin(false);
        Alert.alert("Logout", "You have been logged out successfully", [
          { text: "OK" },
        ]);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert("Logout Error", "An error occurred during logout. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  return ( 
    <View style={styles.container}> 
      <View style={styles.backgroundContainer}> 
        <Image 
          source={{}} 
          style={styles.backgroundImage} 
        /> 
        <View style={styles.profileContainer}> 
          <Image 
            source={require('../../assets/logo_1.jpg')} 
            style={styles.profileImage} 
          /> 
          <View style={styles.userInfo}> 
            <Text style={styles.username}>{user.username}</Text> 
            <Text style={styles.mobile}>{user.mobile}</Text> 
          </View> 
          <TouchableOpacity onPress={logout} style={{ marginHorizontal: 190 }}>
            <AntDesign name="logout" size={24} color="red" />
          </TouchableOpacity>
        </View> 
        <View style={styles.buttonsContainer}> 
          <TouchableOpacity style={styles.button}> 
            <Ionicons name="heart" size={24} color={'#000'} /> 
            <Text style={styles.buttonText}>Favorites</Text> 
          </TouchableOpacity> 
          <TouchableOpacity style={styles.button}> 
            <Ionicons name="checkmark-done" size={24} color={'#000'} /> 
            <Text style={styles.buttonText}>My Orders</Text> 
          </TouchableOpacity> 
          <TouchableOpacity style={styles.button}> 
            <Ionicons name="help-circle" size={24} color={'#000'} /> 
            <Text style={styles.buttonText}>Help</Text> 
          </TouchableOpacity> 
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('EditProfile')}
          > 
            <Ionicons name="create" size={24} color={'#000'} /> 
            <Text style={styles.buttonText}>Edit Profile</Text> 
          </TouchableOpacity> 
        </View> 
      </View> 
    </View> 
  ); 
};

export default Profile;

const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    backgroundColor: 'white', 
  }, 
  backgroundContainer: { 
    flex: 1, 
    backgroundColor: '#C0C0C0', 
    borderBottomEndRadius: 30, 
    borderBottomStartRadius: 30, 
    overflow: 'hidden', 
  }, 
  backgroundImage: { 
    ...StyleSheet.absoluteFillObject, 
    opacity: 0.7, 
  }, 
  profileContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    margin: 20, 
    marginTop: 60, 
  }, 
  profileImage: { 
    width: 70, // Specify width for the profile image 
    height: 70, // Specify height for the profile image 
    borderRadius: 35, 
  }, 
  userInfo: { 
    marginLeft: 10, 
  }, 
  username: { 
    fontSize: 18, 
    fontFamily: "medium", 
    color: COLORS.black, 
  }, 
  mobile: { 
    fontSize: 14, 
    fontFamily: "regular", 
    color: COLORS.gray, 
  }, 
  buttonsContainer: { 
    marginTop: 20, 
  }, 
  button: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: COLORS.lightWhite, 
    marginHorizontal: 20, 
    marginVertical: 10, 
    padding: 15, 
    borderRadius: 12, 
  },
  buttonText: { 
    marginLeft: 10, 
    fontSize: 16, 
    fontFamily: "regular", 
    color: '#000', 
  }, 
});
