import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import firestore from '@react-native-firebase/firestore'; // Ensure this import is correct

const Bhaji = () => {
  const [bhajiItems, setBhajiItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [searchQuery, setSearchQuery] = useState(''); // State for search input

  useEffect(() => {
    const fetchBhaji = async () => {
      try {
        const snapshot = await firestore().collection('Bhaji').get();
        const specials = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            Foodname: data.Foodname || "Unknown Item",
            Price: data.Price || "N/A",
            image: data.image || null,
          };
        });
        setBhajiItems(specials); // Set fetched items in state
        setFilteredItems(specials); // Initialize filtered items
      } catch (error) {
        console.error("Error fetching bhaji items:", error);
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchBhaji();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filteredData = bhajiItems.filter(item => 
        item.Foodname.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filteredData);
    } else {
      setFilteredItems(bhajiItems); // Reset to original list if search is empty
    }
  };

  const renderBhajiItem = ({ item }) => (
    <View style={styles.card}>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
      <View style={styles.infoContainer}>
        <Text style={styles.itemName}>{item.Foodname}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.itemPrice}>₹ {item.Price}</Text>
          <TouchableOpacity style={styles.addButton}>
            <FontAwesomeIcon icon={faPlus} size={20} color="#FF5733" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5733" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bhaji Menu</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={handleSearch} // Update search input
        />
        <TouchableOpacity style={styles.filterButton}>
          <FontAwesomeIcon icon={faSearch} size={20} color="#FF5733" />
        </TouchableOpacity>
      </View>
      {filteredItems.length === 0 ? ( // Check if no items found
        <Text style={styles.noContentText}>No related content found.</Text>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderBhajiItem}
          keyExtractor={item => item.id}
          numColumns={2} // Display items in two columns
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default Bhaji;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
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
    shadowRadius: 10,
    elevation: 4,
    width: '96%',
    alignSelf: 'center',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  noContentText: {
    fontSize: 18,
    color: '#FF5733',
    textAlign: 'center',
    marginTop: 20,
  },
  list: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoContainer: {
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  priceContainer: {
    flexDirection: 'row', // Arrange children in a row
    alignItems: 'center', // Center items vertically
    marginTop: 8, // Add margin as needed
  },
  itemPrice: {
    fontSize: 16,
    color: '#777',
    marginRight: 10, // Space between price and button
  },
  addButton: {
    padding: 5,
    backgroundColor: "white",
    borderRadius: 20, // Fully circular shape
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    borderWidth: 1,
    borderColor: "#FF5733"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#FF5733',
  },
});
