import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { LoginContext } from '../context/LoginContext';
import { Feather } from '@expo/vector-icons'; // Import Feather icons

const EditProfileScreen = ({ navigation }) => {
  const { user, setUser } = useContext(LoginContext);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [surName, setSurName] = useState(user?.surName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(user?.photo || ''); // New state for user photo

  const handleSave = async () => {
    try {
      const response = await axios.post(`http://172.20.10.2:3000/user/${user._id}/edit`, {
        firstName,
        surName,
        phoneNumber,
        password,
        photo, // Pass the photo to the backend
      });

      if (response.status === 200) {
        setUser(response.data);
        Alert.alert('Success', 'Profile updated successfully', [{ text: 'OK' }]);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'An error occurred while updating profile', [{ text: 'OK' }]);
    }
  };

  const handleEditPhoto = async () => {
    // Implement photo editing logic here
    // For example, you can use ImagePicker to allow the user to select a new photo
  };

  const handleDeletePhoto = async () => {
    try {
      const response = await axios.post(`http://172.20.10.2:3000/user/${user._id}/delete/photo`);

      if (response.status === 200) {
        setUser({ ...user, photo: null }); // Update the local user state to remove the photo
        setPhoto(null); // Update the photo state to remove the photo
        Alert.alert('Success', 'Profile photo deleted successfully', [{ text: 'OK' }]);
      }
    } catch (error) {
      console.error('Error deleting profile photo:', error);
      Alert.alert('Error', 'An error occurred while deleting profile photo', [{ text: 'OK' }]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        {photo ? (
          <TouchableOpacity onPress={handleEditPhoto}>
            <Feather name='camera' size={50} color='#5DC58A' />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleEditPhoto}>
            <View style={styles.addPhotoCircle}>
              <Feather name='camera' size={24} color='#5DC58A' />
            </View>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.buttonContainer}>
        {photo && (
          <Button title="Delete Photo" onPress={handleDeletePhoto} color="#5DC58A" />
        )}
        <Button title="Edit Photo" onPress={handleEditPhoto} color="#5DC58A" />
      </View>
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />
      <Text style={styles.label}>Surname</Text>
      <TextInput
        style={styles.input}
        value={surName}
        onChangeText={setSurName}
      />
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Save" onPress={handleSave} color="#5DC58A" />
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#C0C0C0',
    marginTop: 40, // Adjust the marginTop to move all the elements down
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the buttons horizontally
    marginBottom: 15,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  addPhotoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF', // White background for the circle
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
});
