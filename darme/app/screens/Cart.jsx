import React, { useContext, useState } from 'react'; 
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Modal } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { Ionicons } from '@expo/vector-icons'; 
import HomeHeader from '../components/HomeHeader'; 
import { useNavigation } from '@react-navigation/native';
import { CartContext } from '../context/CartCountContext'; 
import { COLORS, SIZES } from '../constants/theme'; 
 
const Cart = () => { 
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext); 
  const [modalVisible, setModalVisible] = useState(false); 
  const navigation = useNavigation();

 
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); 

  const handleProceed = () => {
    setModalVisible(false);
    navigation.navigate('PredictionScreen', { totalPriceFromCart: totalAmount });
  };
  
 
  const renderCartItem = ({ item }) => ( 
    <View style={styles.itemContainer}> 
      <Image source={{ uri: item.image }} style={styles.itemImage} /> 
      <View style={styles.itemDetails}> 
        <Text style={styles.itemName}>{item.title}</Text> 
        <Text style={styles.itemPrice}>₸{item.price}</Text> 
        <View style={styles.itemControls}> 
          <TouchableOpacity 
            style={styles.circleButton} 
            onPress={() => updateQuantity(item._id, item.quantity - 1)} 
          > 
            <Text style={styles.buttonText}>-</Text> 
          </TouchableOpacity> 
          <Text style={styles.itemQuantity}>{item.quantity}</Text> 
          <TouchableOpacity 
            style={styles.circleButton} 
            onPress={() => updateQuantity(item._id, item.quantity + 1)} 
          > 
            <Text style={styles.buttonText}>+</Text> 
          </TouchableOpacity> 
        </View> 
      </View> 
      <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item._id)}> 
        <Ionicons name="close-circle" size={40} color="#368C72" /> 
      </TouchableOpacity> 
    </View> 
  ); 
 
  return ( 
    <SafeAreaView style={styles.safeArea}> 
      <HomeHeader /> 
      <View style={styles.container}> 
        <FlatList 
          data={cart} 
          renderItem={renderCartItem} 
          keyExtractor={item => item._id} 
          ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty.</Text>} 
          contentContainerStyle={styles.listContainer} 
        /> 
        {cart.length > 0 && ( 
          <View style={styles.orderContainer}> 
            <View style={styles.totalAmountContainer}> 
              <Text style={styles.totalAmountText}>Total: ₸{totalAmount.toFixed(2)}</Text> 
            </View> 
            <TouchableOpacity style={styles.orderButton} onPress={() => setModalVisible(true)}> 
              <Text style={styles.orderButtonText}>Order</Text> 
            </TouchableOpacity> 
          </View> 
        )} 
        <Modal 
          animationType="slide" 
          transparent={true} 
          visible={modalVisible} 
          onRequestClose={() => setModalVisible(false)} 
        > 
          <View style={styles.modalContainer}> 
            <View style={styles.modalContent}> 
              <Text style={styles.modalTitle}>Order Summary</Text> 
              <FlatList 
                data={cart} 
                renderItem={({ item }) => ( 
                  <View style={styles.modalItem}> 
                    <View style={styles.modalItemRow}> 
                      <Text style={styles.modalItemText}>{item.title}</Text> 
                      <Text style={styles.modalItemText}>{item.quantity} x ₸{item.price.toFixed(2)}</Text> 
                    </View> 
                    <View style={styles.modalSeparator} /> 
                  </View> 
                )} 
                keyExtractor={item => item._id} 
              /> 
              <Text style={styles.modalTotal}>Total: ₸{totalAmount.toFixed(2)}</Text> 
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}> 
                <Text style={styles.closeButtonText}>Close</Text> 
              </TouchableOpacity> 
              <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
            <Text style={styles.proceedButtonText}>Proceed</Text>
          </TouchableOpacity>
            </View> 
          </View> 
        </Modal> 
      </View> 
    </SafeAreaView> 
  ); 
}; 
 
export default Cart; 
 
const styles = StyleSheet.create({ 
  safeArea: { 
    flex: 1, 
    backgroundColor: '#C0C0C0', 
  }, 
  container: { 
    flex: 1, 
    padding: SIZES.padding, 
    alignItems: 'center', 
  }, 
  listContainer: { 
    paddingBottom: SIZES.padding, 
  }, 
  itemContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#5DC58A', 
    padding: 8, 
    marginVertical: 10, 
    borderRadius: 20, 
    width: 400, 
    height: 163, 
    alignSelf: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 2, 
    elevation: 2, 
  }, 
  itemImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 10, 
  }, 
  itemDetails: { 
    flex: 1, 
    marginLeft: 10, 
  }, 
  itemName: { 
    fontSize: 18, 
    fontFamily: 'medium', 
    color: COLORS.text, 
  }, 
  itemPrice: { 
    fontSize: 16, 
    color: COLORS.text, 
    marginVertical: 5, 
  }, 
  itemControls: { 
    flexDirection: 'row', 
    alignItems: 'center', 
  }, 
  circleButton: { 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    backgroundColor: '#5DC58A', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginHorizontal: 5, 
    borderWidth: 1, 
    borderColor: '#000000', 
  }, 
  buttonText: { 
    color: '#000', 
    fontSize: 18, 
  }, 
  itemQuantity: { 
    fontSize: 16, 
    color: COLORS.text, 
    marginHorizontal: 10, 
  }, 
  removeButton: { 
    marginLeft: 10, 
  }, 
  orderContainer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    marginTop: SIZES.margin,
    width: 429,
    height: 120,
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalAmountContainer: { 
    backgroundColor: COLORS.white, 
    borderRadius: 20, 
    paddingVertical: 10, 
    paddingHorizontal: 60, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 10, // Spacing between total amount and order button 
  }, 
  totalAmountText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.black, 
    textAlign: 'center', 
  }, 
  orderButton: { 
    paddingVertical: 20, 
    paddingHorizontal: 100, 
    backgroundColor: COLORS.primary, 
    borderRadius: 50, 
    alignItems: 'center', 
  }, 
  orderButtonText: { 
    fontSize: 18, 
    fontFamily: 'medium', 
    color: COLORS.text, 
  }, 
  emptyText: { 
    textAlign: 'center', 
    color: COLORS.gray, 
    marginTop: SIZES.padding, 
    fontSize: 18, 
    fontFamily: 'medium', 
    color: COLORS.text, 
  }, 
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  }, 
  modalContent: { 
    width: '80%', 
    maxWidth: '90%', 
    backgroundColor: COLORS.white, 
    padding: SIZES.padding, 
    borderRadius: 20, 
  }, 
  modalTitle: { 
    fontSize: SIZES.h1, 
    marginBottom: SIZES.base, 
    textAlign: 'center', 
    fontFamily: 'medium', 
    color: COLORS.text, 
  }, 
  modalItem: { 
    marginBottom: SIZES.base, 
  }, 
  modalItemRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 5, // Adjust vertical padding if necessary 
  }, 
  modalItemText: { 
    fontSize: 16, 
    color: COLORS.text, 
  }, 
  modalSeparator: { 
    height: 1, 
    backgroundColor: COLORS.gray, 
    marginVertical: 5, 
  }, 
  modalTotal: { 
    fontSize: 16, 
    marginVertical: SIZES.base, 
    textAlign: 'center', 
    fontWeight: 'bold', 
    color: COLORS.text, 
  }, 
  closeButton: {
    paddingVertical: 20,
    paddingHorizontal: 60,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: SIZES.base,
  },
  closeButtonText: { 
    fontSize: 18, // Increased font size 
    fontFamily: 'medium', // Consistent font style 
    color: COLORS.text, 
  }, 
  proceedButton: {
    paddingVertical: 20,
    paddingHorizontal: 60,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 10, // Add margin to create space between buttons
  },
  proceedButtonText: {
    fontSize: 18, // Increased font size 
    fontFamily: 'medium', // Consistent font style 
    color: COLORS.text, 
  }
});
