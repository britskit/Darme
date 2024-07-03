import React, { useState, useRef, useContext } from "react";
import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { LoginContext } from "../context/LoginContext";
import BackBtn from "../components/BackBtn";
import Button from "../components/Button";
import AssetImage from "../components/AssetImage";
import styles from "./login.style";
import { COLORS } from "../constants/theme";
import AsyncStorage from '@react-native-async-storage/async-storage';


const validationSchema = Yup.object().shape({
  password: Yup.string().min(4, "Password must be at least 8 characters").required("Required"),
  phoneNumber: Yup.string().required("Required"),
});

const LoginPage = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const [obsecureText, setObsecureText] = useState(false);
  const { setLogin } = useContext(LoginContext);

  // const inValidForm = () => {
  //   Alert.alert("Invalid Form", "Please provide all required fields", [
  //     { text: "Cancel", onPress: () => {} },
  //     { text: "Continue", onPress: () => {} },
  //   ]);
  // };
const loginFunc = async (values) => {
  setLoader(true);

  try {
      const endpoint = "http://172.20.10.2:3000/auth/login";
      const response = await axios.post(endpoint, values);

      if (response.status === 200) {
          console.log('Backend response:', response.data);

          const { _id, userToken } = response.data;

          if (_id && userToken) {
              await AsyncStorage.setItem("id", JSON.stringify(_id));
              await AsyncStorage.setItem("token", userToken); // Assuming userToken is a string

              setLogin(true);
              console.log('Login successful:', response.data);
          } else {
              console.error('Error: _id or userToken is missing in response data');
              Alert.alert("Error", "Login failed. Missing user data from server.");
          }
      } else {
          setLogin(false);
          Alert.alert("Error Logging in", "Please provide valid credentials", [
              { text: "Cancel", onPress: () => {} },
              { text: "Continue", onPress: () => {} }
          ]);
      }
  } catch (error) {
      setLogin(false);
      console.error("Error during login:", error);
      Alert.alert("Error", "Oops, Error logging in. Try again with correct credentials", [
          { text: "Cancel", onPress: () => {} },
          { text: "Continue", onPress: () => {} }
      ]);
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
          initialValues={{ phoneNumber: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={loginFunc}
        >
          {({ handleChange, handleBlur, touched, handleSubmit, values, errors, isValid, setFieldTouched }) => (
            <View>
              <View style={styles.wrapper}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputWrapper(touched.phoneNumber ? COLORS.secondary : COLORS.offwhite)}>
                  <MaterialCommunityIcons name="phone" size={20} color={COLORS.gray} style={styles.iconStyle} />
                  <TextInput
                    placeholder="Enter phone number"
                    placeholderTextColor="#3b3b3b"
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
                  <MaterialCommunityIcons name="lock-outline" size={20} color={COLORS.gray} style={styles.iconStyle} />
                  <TextInput
                    secureTextEntry={obsecureText}
                    placeholder="Password"
                    placeholderTextColor="#3b3b3b"
                    onFocus={() => setFieldTouched("password")}
                    onBlur={() => setFieldTouched("password", "")}
                    value={values.password}
                    onChangeText={handleChange("password")}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={{ flex: 1 }}
                  />
                  <TouchableOpacity onPress={() => setObsecureText(!obsecureText)}>
                    <MaterialCommunityIcons name={obsecureText ? "eye-outline" : "eye-off-outline"} size={18} />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && (
                  <Text style={styles.errorMessage}>{errors.password}</Text>
                )}
              </View>

              <Button
                loader={loader}
                title={"L O G I N"}
                onPress={ handleSubmit }
                isValid={isValid}
              />

              <Text
                style={styles.registration}
                onPress={() => navigation.navigate("signUp")}
              >
                Register
              </Text>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default LoginPage;