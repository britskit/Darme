import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import SearchComponent from '../components/SearchComponent';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const PredictionScreen = () => {
  const route = useRoute();
  const { totalPriceFromCart } = route.params;
  

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    Restaurant_latitude: "",
    Restaurant_longitude: "",
    Delivery_location_latitude: "",
    Delivery_location_longitude: "",
    Delivery_person_Age: "24",
    Delivery_person_Ratings: "4.2"
  });
  const [result, setResult] = useState(null);
  const [showSpan, setShowSpan] = useState(false);
  const [totalPrice, setTotalPrice] = useState(totalPriceFromCart);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  useEffect(() => {
    if (totalPriceFromCart && totalPrice === 0) {
      setTotalPrice(totalPriceFromCart);
    }
  }, [totalPriceFromCart, totalPrice]);

  const handlePredictClick = async () => {
    if (
      !formData.Restaurant_latitude ||
      !formData.Restaurant_longitude ||
      !formData.Delivery_location_latitude ||
      !formData.Delivery_location_longitude
    ) {
      setResult(null);
      setShowSpan(true);
      return;
    }

    const url = "http://172.20.10.2:8080//predict_delivery_time";
    setIsLoading(true);
    const jsonData = JSON.stringify(formData);

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: jsonData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.Prediction || null);

      // Calculate delivery cost
      const deliveryCost = parseFloat(data.Prediction) * 30;
      setDeliveryCost(deliveryCost);

      // Update total price
      setTotalPrice(deliveryCost);
    } catch (error) {
      console.error("Failed to fetch prediction:", error);
      Alert.alert("Error", `Failed to fetch prediction: ${error.message}`);
    } finally {
      setIsLoading(false);
      setShowSpan(true);
    }
  };

  const handleRestaurantSelect = (item) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      Restaurant_latitude: item.lat,
      Restaurant_longitude: item.long,
    }));
  };

  const handleDeliverySelect = (item) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      Delivery_location_latitude: item.lat,
      Delivery_location_longitude: item.long,
    }));
  };

  const handlePaymentClick = () => {
    setIsConfirmationVisible(true);
  };

  const handleConfirmOrder = () => {
    setIsConfirmationVisible(false);
    // Handle navigation to delivery status page or any other action
    console.log("Order confirmed!");
    navigation.navigate('DeliveryStatus'); // Replace with your navigation action
  };

  const handleCancelOrder = () => {
    setIsConfirmationVisible(false);
    
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Time Prediction</Text>
      <View style={styles.inputContainer}>
        <SearchComponent
          filePath="Книга1.json"
          placeholder="Search Your Address..."
          onSelect={handleRestaurantSelect}
        />
        <SearchComponent
          filePath="pharmacy.json"
          placeholder="Search Delivery Address..."
          onSelect={handleDeliverySelect}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#5DC58A' }]}
          onPress={!isLoading ? handlePredictClick : null}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? "Loading..." : "Predict Delivery Time"}</Text>
        </TouchableOpacity>
        {isLoading && <ActivityIndicator size="small" color="#0000ff" />}
      </View>
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          {showSpan && (
            result !== null ? (
              `Your order will be delivered in ${result} minutes`
            ) : (
              "Please select your and delivery addresses"
            )
          )}
        </Text>
        {deliveryCost > 0 && (
          <Text style={styles.resultText}>
            Delivery Cost: {deliveryCost.toFixed(2)}
          </Text>
        )}
        <Text style={styles.resultText}>
          Total Price: {(totalPrice + deliveryCost).toFixed(2)}
        </Text>
        <View style={styles.paymentDetails}>
          <Text style={styles.paymentText}>Payment Method: </Text>
          <FontAwesome name="money" size={24} color="black" style={styles.paymentIcon} />
          <Text>Cash</Text>
        </View>
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 51.147222,
          longitude: 71.422222,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {formData.Restaurant_latitude && formData.Restaurant_longitude && (
          <Marker
            coordinate={{ 
              latitude: parseFloat(formData.Restaurant_latitude), 
              longitude: parseFloat(formData.Restaurant_longitude) 
            }}
            title="Pharmacy"
            description="Pharmacy Location"
          />
        )}
        {formData.Delivery_location_latitude && formData.Delivery_location_longitude && (
          <Marker
            coordinate={{ 
              latitude: parseFloat(formData.Delivery_location_latitude), 
              longitude: parseFloat(formData.Delivery_location_longitude) 
            }}
            title="Delivery Location"
            description="Delivery Location"
          />
        )}
      </MapView>
      <View style={styles.paymentContainer}>
        <TouchableOpacity
          style={[styles.button, styles.paymentButton, { backgroundColor: '#5DC58A' }]}
          onPress={handlePaymentClick}
        >
          <Text style={styles.buttonText}>Confirm to Pay</Text>
        </TouchableOpacity>
      </View>
      <PaymentConfirmation
        isVisible={isConfirmationVisible}
        onClose={() => setIsConfirmationVisible(false)}
        onConfirm={handleConfirmOrder}
        onCancel={handleCancelOrder}
        navigation={useNavigation()} 
        />
    </View>
  );
};

const PaymentConfirmation = ({ isVisible, onClose, onConfirm, onCancel, navigation }) => {
  return (
    <View style={[styles.modalContainer, { display: isVisible ? 'flex' : 'none' }]}>
  <View style={styles.modal}>
    <Text style={styles.deliveryText}>We are delivering your order</Text>
    <Image source={require('../../assets/bike.png')} style={styles.deliveryImage} />
    <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FF6347' }]} onPress={() => navigation.navigate('Profile')}>
      <Text style={styles.actionButtonText}>Close</Text>
    </TouchableOpacity>
  </View>
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: '#C0C0C0',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    fontFamily: 'regular',
  },
  inputContainer: {
    marginBottom: 20,
    width: "100%",
  },
  buttonContainer: {
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  resultContainer: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "#5DC58A",
    padding: 10,
    borderRadius: 20,
    width: "100%", 
  },
  resultText: {
    fontSize: 13,
    color: "#000",
    marginTop: 10,
    textAlign: "center",
    fontFamily: "regular", 
  },
  paymentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  paymentIcon: {
    marginRight: 5,
  },
  paymentText: {
    fontSize: 14,
    color: '#000',
    fontFamily: "regular",
  },
  button: {
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    width: "80%",
  },
  paymentButton: {
    borderRadius: 30,
    width: "80%",
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: 300,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: 18,
    marginBottom: 20,
  },
  actionButton: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deliveryText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default PredictionScreen;
