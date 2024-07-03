import {StyleSheet, Text, View} from 'react-native';
import React, { useContext, useEffect } from 'react';
import AssetImage from './AssetImage';
import { UserReversedGeoCode } from '../context/UserReversedGeoCode';
import { UserLocationContext } from '../context/UserLocationContext';
import * as Location from 'expo-location';

import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const HomeHeader = () => {

    const {address, setAddress} = useContext(UserReversedGeoCode);
    const {location, setLocation} = useContext(UserLocationContext);

    useEffect(() => {
        if(location !== null) {
            reverseGeoCode(location.coords.latitude, location.coords.longitude)
        }
    },[location]);

    const reverseGeoCode = async (latitude, longitude) => {
        const reversedGeoCodedAddress = await Location.reverseGeocodeAsync({
            longitude: longitude,
            latitude: latitude
        });
        console.log(reversedGeoCodedAddress);
       //  setAddress()
    }

    return (
        <View style= {styles.header}>
            <View style={styles.outerStyle}>
                <AssetImage data={require("../../assets/logo_1.jpg")}
                width = {100}
                height = {100}
                radius = {50}
                mode = {"cover"}
                />
            </View>
            <View style={styles.headerStyle}>
                <Text style = {styles.logo}>Darme</Text>
                <Text style = {styles.heading}>Delivering to {`${address.city} ${address.name}`}</Text>
            </View>
        </View>
    )
}

export default HomeHeader

const styles = StyleSheet.create({
    outerStyle: {
        marginBottom: 10,
        marginHorizontal: 0,
        marginVertical: 10,
        flexDirection: 'row'
    },
    headerStyle:{
       
        justifyContent:"center",
        marginHorizontal: 70
         
    },
    logo: {
        marginVertical: 5,
        marginHorizontal: 0,
        fontFamily: "bold",
        fontSize: 25,
        color: COLORS.primary,
    },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'center', // Center the profileContainer 
        alignItems: 'center', 
        padding: 10, 
      }, 
      profileContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: COLORS.lightWhite, 
        padding: 15, // Increased padding for larger rectangle 
        borderRadius: 10, 
        width: '90%', // Expand to almost full width 
      }, 
      profileTextContainer: { 
        marginLeft: 15, // Increased margin for spacing 
        flex: 1, 
      }, 
      profileText: { 
        fontSize: 16, // Slightly larger font size 
        fontFamily: 'regular', 
        color: COLORS.text, 
      }, 
      locationContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 5,
      },
      locationText: { 
        marginLeft: 5, 
        fontSize: 16, // Slightly larger font size 
        fontFamily: 'medium', 
        color: '#000', 
      }, 
})
