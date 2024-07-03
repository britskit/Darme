import React, { useState } from 'react'; 
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ScrollView } from 'react-native'; 
import { Feather } from '@expo/vector-icons'; 
 
const PredictScreen = () => { 
  const [symptoms, setSymptoms] = useState(''); 
  const [result, setResult] = useState({ 
    disease: '', 
    description: '', 
    precautions: '', 
    medications: '', 
  }); 
 
  const handlePredict = async () => { 
    console.log('handlePredict called with:', symptoms); 
    try { 
      const symptomsArray = symptoms.split(',').map(s => s.trim()); 
      const response = await fetch('http://172.20.10.2:5000/predict', { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json' 
        }, 
        body: JSON.stringify({ symptoms: symptomsArray }) 
      }); 
 
      console.log('Response status:', response.status); // Log status code 
      console.log('Response headers:', response.headers); // Log headers 
 
      if (!response.ok) { 
        const errorText = await response.text(); 
        console.error('Error:', errorText); 
        Alert.alert('An error occurred while fetching the prediction. Please try again.'); 
        return; 
      } 
 
      const text = await response.text(); 
      console.log('Response text:', text); // Log full response text 
 
      const contentType = response.headers.get("content-type"); 
      if (contentType && contentType.indexOf("application/json") !== -1) { 
        const data = JSON.parse(text); // Parse JSON manually 
        if (data.error) { 
          console.error('Backend Error:', data.error); 
          Alert.alert('An error occurred:', data.error); 
          return; 
        } 
        console.log('Prediction response data:', data); // Log for debugging 
        const { disease, description, precautions, medications } = data; 
        setResult({ 
          disease, 
          description, 
          precautions: precautions.join(', '),  // Convert array to string 
          medications: medications.join(', '),  // Convert array to string 
        }); 
      } else { 
        console.error('Expected JSON but got:', text); 
        Alert.alert('An error occurred while fetching the prediction. Please try again.'); 
      } 
    } catch (error) { 
      console.error('Error:', error.message); 
      Alert.alert('An error occurred while fetching the prediction. Please try again.'); 
    } 
  }; 
 
  return ( 
    <SafeAreaView style={styles.container}> 
      <Text style={styles.title}>Medication Prediction</Text> 
      <View style={styles.searchContainer}> 
        <View style={styles.searchWrapper}> 
          <TextInput 
            style={styles.input} 
            placeholder="Enter your symptoms (comma-separated)" 
            placeholderTextColor="#3b3b3b"
            value={symptoms} 
            onChangeText={setSymptoms} 
          /> 
        </View> 
        <TouchableOpacity style={styles.searchBtn} onPress={() => { 
          console.log('TouchableOpacity pressed'); // Debugging 
          handlePredict(); 
        }}> 
          <Feather name='search' size={24} color='#5DC58A' /> 
        </TouchableOpacity> 
      </View> 
      <ScrollView contentContainerStyle={styles.scrollView}> 
        <View style={styles.result}> 
          <Text style={styles.label}><Text style={styles.bold}>Disease:</Text> {result.disease}</Text> 
          <Text style={styles.label}><Text style={styles.bold}>Description:</Text> {result.description}</Text> 
          <Text style={styles.label}><Text style={styles.bold}>Precautions:</Text> {result.precautions}</Text> 
          <Text style={styles.label}><Text style={styles.bold}>Medications:</Text> {result.medications}</Text> 
        </View> 
      </ScrollView> 
    </SafeAreaView> 
  ); 
}; 
 
const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#C0C0C0',
    paddingTop: 250, // Ensure the scroll view content starts below the fixed elements 
  }, 
  scrollView: { 
    flexGrow: 1, 
    paddingTop: 16, // Add padding to avoid overlapping with fixed elements 
  }, 
  title: { 
    paddingTop: 100,
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 16, 
    textAlign: 'center', 
    position: 'absolute', 
    top: 20, 
    left: 0, 
    right: 0, 
    color: '#000',
    fontFamily: 'regular',
  }, 
  searchContainer: { 
    paddingTop: 130,
    flexDirection: 'row', 
    alignItems: 'center', 
    position: 'absolute',  
    top: 60,  
    left: 16,  
    right: 16, 
  }, 
  searchWrapper: { 
    flex: 1, 
  }, 
  input: { 
    backgroundColor: '#ffffff', // White background color 
    borderRadius: 8,  
    padding: 10,  
    height: 50,  
    borderColor: 'gray',  
    borderWidth: 1, 
  }, 
  searchBtn: { 
    marginLeft: 10, 
  }, 
  result: { 
    marginTop: 16,  
    backgroundColor: '#5DC58A', // Darker container color  
    padding: 16,  
    borderRadius: 8, 
  }, 
  label: { 
    fontSize: 18,  
    color: '#000', // White text color for better contrast  
    marginBottom: 8, 
    fontFamily: 'regular',
  }, 
  bold: { 
    fontWeight: 'bold', 
  }, 
}); 
 
export default PredictScreen;