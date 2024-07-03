import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import HomeHeader from "../components/HomeHeader";
import Carousel from 'react-native-snap-carousel';
import { COLORS, SIZES } from "../constants/theme";

const products = [ 
  { id: '1', name: 'Paracetamol', image: require('../../assets/paracetamol.jpg') }, 
  { id: '2', name: 'Ibuprofen', image: require('../../assets/ibuprofen.jpg') }, 
  { id: '3', name: 'Fromilid', image: require('../../assets/fromolod.jpg') }, 
  { id: '4', name: 'Ketorol', image: require('../../assets/ketorol.jpg') }, 
  { id: '5', name: 'Suprastin', image: require('../../assets/suprastin.jpg') }, 
  { id: '6', name: 'Nurofen', image: require('../../assets/nurofen.jpg') }, 
];

const { width: viewportWidth } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://172.20.10.2:3000/product/categories');
        console.log('API Response:', response.data);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again later.');
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryPress = (category) => {
    console.log('Navigating to ProductsScreen with categoryId:', category._id);
    navigation.navigate('ProductsScreen', { categoryId: category._id });
  };

  const renderCategoryItem = ({ item }) => {
    const imageUrl = item.file && item.file.length > 0 ? `http://172.20.10.2:3000/${item.file[0].replace('public/', '')}` : null;

    return (
      <TouchableOpacity
        style={[styles.category, { backgroundColor: item.color || '#F1BBC1' }]}
        onPress={() => handleCategoryPress(item)}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.categoryImage} />
        ) : (
          <Text style={styles.noImageText}>No Image</Text>
        )}
        <Text style={styles.categoryText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={item.image} style={styles.productImage} />
      <Text style={styles.productText}>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader />
      <View style={styles.container}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={item => item._id}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
          />
        )}
        <Text style={styles.slideshowTitle}>The Frequently Used</Text>
        <Carousel
          data={products}
          renderItem={renderProductItem}
          sliderWidth={viewportWidth}
          itemWidth={viewportWidth * 0.3} // Adjusted width to fit 3 products
          loop={true}
          autoplay={true}
          autoplayDelay={500}
          autoplayInterval={3000}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#C0C0C0',
  },
  container: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingBottom: 220,
  },
  listContainer: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  category: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    borderRadius: SIZES.radius,
    width: '45%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  categoryImage: {
    width: 50,
    height: 50,
    marginBottom: SIZES.margin,
  },
  categoryText: {
    color: '#000',
    fontFamily: 'regular',
    fontSize: 17,
  },
  noImageText: {
    color: '#999',
    fontSize: 14,
    marginTop: SIZES.margin,
  },
  slideshowTitle: {
    fontSize: 18,
    fontFamily: 'medium',
    marginVertical: 5,
    marginLeft: 10,
    marginBottom: 30,
    color: COLORS.text,
  },
  productContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  productText: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: 'regular',
    color: COLORS.text,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
});
