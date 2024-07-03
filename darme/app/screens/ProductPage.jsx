import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { COLORS } from '../constants/theme';

const ProductPage = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.0.16:3000/product/products/${productId}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = () => {
    // Add your logic for adding the product to the cart here
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  const imageUrl = `http://192.168.0.16:3000/${product.file[0].replace('public/', '')}`;

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.productImage} />
      <Text style={styles.productPrice}>Price: {product.price}</Text>
      <Text style={styles.productName}>{product.name}</Text>
      <View style={styles.descriptionContainer}>
        <Text style={styles.aboutText}>About the Product</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back to Products</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#C0C0C0',
    padding: 20,
     marginTop: 90,
  },
  productImage: {
    width: 200,
    height: 200,
    marginTop: 20,
    alignSelf: 'center',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 20,
    fontFamily: 'regular',
    marginBottom: 10,
  },
  descriptionContainer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  aboutText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'regular',
  },
  productDescription: {
    fontSize: 16,
    textAlign: 'justify',
    fontFamily: 'regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 220,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'regular',
  },
  backButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 25,
    width: '45%',
    alignItems: 'center',
  },
  addToCartButton: {
    backgroundColor: COLORS.secondary,
    padding: 12,
    borderRadius: 25,
    width: '45%',
    alignItems: 'center',
    marginHorizontal: 20
  },
});

export default ProductPage;
