import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Import JSON data statically
import книга1Data from '../../assets/Книга1.json';
import pharmacyData from '../../assets/pharmacy.json';

const dataSources = {
  'Книга1.json': книга1Data,
  'pharmacy.json': pharmacyData,
};

const SearchComponent = ({ filePath, placeholder, onSelect }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Load data from JSON file
    const jsonData = dataSources[filePath];
    setData(jsonData);
    setFilteredData(jsonData);
  }, [filePath]);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.Address.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, data]);

  const handleItemClick = (item) => {
    onSelect(item);
    setSelectedItem(item);
    setIsVisible(false);
    setSearchText(item.Address);
  };

  const handleInputChange = (text) => {
    setSearchText(text);
    setIsVisible(true);
    setSelectedItem(null);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        value={selectedItem ? selectedItem.Address : searchText}
        onChangeText={handleInputChange}
        style={styles.input}
        onFocus={() => setIsVisible(true)}
      />
      {isVisible && (
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemClick(item)}>
              <Text style={styles.item}>{item.Address}</Text>
            </TouchableOpacity>
          )}
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 10,
    borderRadius: 4,
  },
  list: {
    maxHeight: 200,
  },
  item: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default SearchComponent;
