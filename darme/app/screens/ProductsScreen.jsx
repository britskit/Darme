import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { COLORS, SIZES } from '../constants/theme';
import HomeHeader from '../components/HomeHeader';
import { CartContext } from '../context/CartCountContext';
import { useNavigation } from '@react-navigation/native';


const ProductsScreen = ({ route }) => {
  const { categoryId } = route.params;
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  const handleProductPress = (productId) => {
    // Navigate to the details screen with the productId
    navigation.navigate('ProductPage', { productId });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://172.20.10.2:3000/product/products');
        console.log('Products fetched:', response.data);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(`Failed to fetch products. Error: ${error.message}`);
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchProducts();
    } else {
      setError('Category ID not provided');
      setLoading(false);
    }
  }, [categoryId]);

  const renderProductItem = ({ item }) => {
    // Adjust the image URL to remove "public" from the path
    const imageUrl = `http://172.20.10.2:3000/${item.file[0].replace('public/', '')}`;

    return (
      <TouchableOpacity onPress={() => handleProductPress(item._id)}>
        <View style={styles.productContainer}>
          <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.productImage} />
          </View>
          <Text style={styles.productTitle}>{item.title}</Text>
          <Text style={styles.productPrice}>₸{item.price}</Text>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => addToCart(item)}
          >
            <Text>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader />
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Medication</Text>
      </View>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
      />
      <View></View>
    </SafeAreaView>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: SIZES.padding,
  },
  headerContainer: {
    padding: SIZES.padding,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 35,
    color: COLORS.black,
  },
  productContainer: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 20,
    marginBottom: SIZES.padding,
    padding: SIZES.padding,
    backgroundColor: '#5DC58A',
    alignItems: 'center',
    borderRadius: 30,
    width: '90%',
  },
  imageContainer: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 20,
    marginBottom: SIZES.padding,
    padding: SIZES.padding,
    backgroundColor: 'white', // Corrected background color value
    alignItems: 'center',
    borderRadius: 30,
    width: '90%',
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: SIZES.margin,
  },
  productTitle: {
    fontSize: 18,
    color: COLORS.black,
    marginTop: 0,
  },
  productPrice: {
    fontSize: 20,
    color: COLORS.black,
    marginLeft: 250,
  },
  addToCartButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 18,
    marginTop: 8,
    marginLeft: 250,
    marginBottom: 20,
  },
});
