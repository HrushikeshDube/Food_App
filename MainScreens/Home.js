import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';

const popularDishes = [
  {
    id: '1',
    name: 'Salmon With Vegetables in Soy Sauce',
    price: '$30.00',
    image: 'https://example.com/salmon.jpg', // Replace with actual image link
  },
  {
    id: '2',
    name: 'Grilled Chicken with Rice',
    price: '$25.00',
    image: 'https://example.com/chicken.jpg', // Replace with actual image link
  }
];

const categories = [
  'European',
  'Mediterranean',
  'Asian',
  'American',
];

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>UTOSIA</Text>
          <TouchableOpacity>
            <Text style={styles.menu}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Dishes Section */}
        <Text style={styles.sectionTitle}>Popular Dishes</Text>
        <FlatList
          data={popularDishes}
          horizontal
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardPrice}>{item.price}</Text>
              <TouchableOpacity style={styles.addToCartButton}>
                <Text style={styles.addToCartText}>Add To Cart</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Categories Section */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoryContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryButton}>
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  brand: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  menu: {
    fontSize: 28,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  filterButton: {
    padding: 8,
  },
  filterText: {
    fontSize: 24,
    color: '#FFA500',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  cardPrice: {
    fontSize: 14,
    color: '#888',
  },
  addToCartButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  addToCartText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    backgroundColor: '#FFA500',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 5,
    flexBasis: '48%',
  },
  categoryText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Home;
