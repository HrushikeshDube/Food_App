import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const Dal = () => {
  const [DalItems, setDalItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDal = async () => {
      try {
        const snapshot = await firestore().collection('Dal').get();
        const items = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            Foodname: data.Foodname || "Unknown Item",
            Price: data.Price || "N/A",
            image: data.image || null,
            Description: data.Description || "No description available",
          };
        });
        setDalItems(items);
        setFilteredItems(items);
      } catch (error) {
        console.error("Error fetching Dal items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDal();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filteredData = DalItems.filter(item => 
        item.Foodname.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filteredData);
    } else {
      setFilteredItems(DalItems);
    }
  };

  const handleItemPress = (item) => {
    const user = auth().currentUser;
    if (user) {
      navigation.navigate('Itemdesc', {
        userId: user.uid,
        itemId: item.id,
        Foodname: item.Foodname,
        Price: item.Price,
        image: item.image,
        desc: item.Description,
      });
    } else {
      console.error("User not logged in");
    }
  };

  const renderDalItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.card} onPress={() => handleItemPress(item)}>
        {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
        <View style={styles.infoContainer}>
          <Text style={styles.itemName}>{item.Foodname}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.itemPrice}>₹ {item.Price}</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => handleItemPress(item)}>
              <FontAwesomeIcon icon={faPlus} size={20} color="#FF5733" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPlaceholder = () => {
    return (
      <View style={[styles.card, styles.invisibleCard]} />
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5733" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Calculate the number of placeholders needed for an even layout
  const numPlaceholders = filteredItems.length % 2 === 1 ? 1 : 0;
  const dataWithPlaceholders = [...filteredItems, ...Array(numPlaceholders).fill({ empty: true })];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dal Menu</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.filterButton}>
          <FontAwesomeIcon icon={faSearch} size={20} color="#FF5733" />
        </TouchableOpacity>
      </View>
      <Text style={styles.noteText}>Note: You can increase the quantity in the cart</Text>
      {filteredItems.length === 0 ? (
        <Text style={styles.noContentText}>No related content found.</Text>
      ) : (
        <FlatList
          data={dataWithPlaceholders}
          renderItem={item => item.item.empty ? renderPlaceholder() : renderDalItem(item)}
          keyExtractor={(item, index) => item.empty ? index.toString() : item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default Dal;

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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 16,
    color: '#777',
    marginRight: 10,
  },
  addButton: {
    padding: 5,
    backgroundColor: "white",
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
  invisibleCard: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
  },
  noteText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginVertical: 5,
  },
});
