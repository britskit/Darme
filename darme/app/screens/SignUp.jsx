import React, { useState, useContext } from "react";
import { ScrollView, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BackBtn from "../components/BackBtn";
import Button from "../components/Button";
import AssetImage from "../components/AssetImage";
import { UserLocationContext } from "../context/UserLocationContext";
import { LoginContext } from "../context/LoginContext";
import { COLORS } from "../constants/theme";
import styles from "./login.style";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
  phoneNumber: Yup.string()
    .min(10, "Phone number must be valid")
    .required("Required"),
  firstName: Yup.string()
    .min(3, "Provide a valid first name")
    .required("Required"),
  surName: Yup.string()
    .min(3, "Provide a valid surname")
    .required("Required"),
});

const SignUp = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const { location, setLocation } = useContext(UserLocationContext);
  const { setLogin } = useContext(LoginContext);
  const [obsecureText, setObsecureText] = useState(true);

  const registerUser = async (values) => {
    setLoader(true);
  
    try {
      const endpoint = "http://172.20.10.2:3000/auth/register";
      console.log('Sending request to:', endpoint, 'with values:', values);  // Debugging log
      const response = await axios.post(endpoint, values);
      console.log('Received response:', response);  
  
      if (response.status === 200) {
        const { userToken } = response.data;
        console.log('Extracted token:', userToken);  
  
        if (userToken) {
          await AsyncStorage.setItem('token', userToken);
          setLogin(true); 
          Alert.alert("Success", "Registration successful", [
            {
              text: "OK",
              onPress: () => navigation.navigate('Profile')
            }
          ]);
        } else {
          console.error("Token is null or undefined");  
          Alert.alert("Error", "Token is null or undefined");
        }
      } else {
        console.error("Registration failed with status:", response.status);  // Log status
        Alert.alert("Error", "Registration failed, please try again");
      }
    } catch (error) {
      console.error('Error during registration:', error);  // Detailed error logging
      Alert.alert("Error", "Registration failed, please try again");
    } finally {
      setLoader(false);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: COLORS.white }}>
      <View style={{ marginHorizontal: 20, marginTop: 50 }}>
        <BackBtn onPress={() => navigation.goBack()} />
        <AssetImage data={require("../../assets/logo_1.jpg")} width={300} height={300} radius={50} mode={"cover"} style={{ justifyContent: 'center' }} />
        <Text style={styles.titleLogin}>Darme</Text>
        <Formik
          initialValues={{
            firstName: "",
            surName: "",
            phoneNumber: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => registerUser(values)}
        >
          {({
            handleChange,
            handleBlur,
            touched,
            handleSubmit,
            values,
            errors,
            isValid,
            setFieldTouched,
          }) => (
            <View>
              <View style={styles.wrapper}>
                <Text style={styles.label}>First Name</Text>
                <View style={styles.inputWrapper(touched.firstName ? COLORS.secondary : COLORS.offwhite)}>
                  <MaterialCommunityIcons
                    name="face-man-profile"
                    size={20}
                    color={COLORS.gray}
                    style={styles.iconStyle}
                  />
                  <TextInput
                    placeholder="First Name"
                    onFocus={() => setFieldTouched("firstName")}
                    onBlur={() => setFieldTouched("firstName", "")}
                    value={values.firstName}
                    onChangeText={handleChange("firstName")}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={{ flex: 1 }}
                  />
                </View>
                {touched.firstName && errors.firstName && (
                  <Text style={styles.errorMessage}>{errors.firstName}</Text>
                )}
              </View>

              <View style={styles.wrapper}>
                <Text style={styles.label}>Last Name</Text>
                <View style={styles.inputWrapper(touched.surName ? COLORS.secondary : COLORS.offwhite)}>
                  <MaterialCommunityIcons
                    name="face-man-profile"
                    size={20}
                    color={COLORS.gray}
                    style={styles.iconStyle}
                  />
                  <TextInput
                    placeholder="Last Name"
                    onFocus={() => setFieldTouched("surName")}
                    onBlur={() => setFieldTouched("surName", "")}
                    value={values.surName}
                    onChangeText={handleChange("surName")}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={{ flex: 1 }}
                  />
                </View>
                {touched.surName && errors.surName && (
                  <Text style={styles.errorMessage}>{errors.surName}</Text>
                )}
              </View>

              <View style={styles.wrapper}>
                <Text style={styles.label}>Phone</Text>
                <View style={styles.inputWrapper(touched.phoneNumber ? COLORS.secondary : COLORS.offwhite)}>
                  <MaterialCommunityIcons
                    name="phone-outline"
                    size={20}
                    color={COLORS.gray}
                    style={styles.iconStyle}
                  />
                  <TextInput
                    placeholder="Enter phone number"
                    onFocus={() => setFieldTouched("phoneNumber")}
                    onBlur={() => setFieldTouched("phoneNumber", "")}
                    value={values.phoneNumber}
                    onChangeText={handleChange("phoneNumber")}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={{ flex: 1 }}
                  />
                </View>
                {touched.phoneNumber && errors.phoneNumber && (
                  <Text style={styles.errorMessage}>{errors.phoneNumber}</Text>
                )}
              </View>

              <View style={styles.wrapper}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper(touched.password ? COLORS.secondary : COLORS.offwhite)}>
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={20}
                    color={COLORS.gray}
                    style={styles.iconStyle}
                  />
                  <TextInput
                    secureTextEntry={obsecureText}
                    placeholder="Password"
                    onFocus={() => setFieldTouched("password")}
                    onBlur={() => setFieldTouched("password", "")}
                    value={values.password}
                    onChangeText={handleChange("password")}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={{ flex: 1 }}
                  />
                  <TouchableOpacity
                    onPress={() => setObsecureText(!obsecureText)}
                  >
                    <MaterialCommunityIcons
                      name={obsecureText ? "eye-outline" : "eye-off-outline"}
                      size={18}
                    />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && (
                  <Text style={styles.errorMessage}>{errors.password}</Text>
                )}
              </View>

              <Button
                title={"SIGN UP"}
                onPress={handleSubmit}
                loader={loader}
                isValid={isValid}
              />
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default SignUp;
