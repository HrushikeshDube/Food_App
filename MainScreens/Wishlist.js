import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';
import i18n from "../services/i18next";
import { useTranslation } from 'react-i18next';
const Wishlist = () => {
  const {t} = useTranslation();
  const [wishlist, setWishlist] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      const unsubscribe = firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('Wishlist')
        .onSnapshot(snapshot => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setWishlist(items);
        });
      return unsubscribe;
    }
  }, []);
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


  const removeFromWishlist = async (itemId) => {
    const user = auth().currentUser;
    if (user) {
      await firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('Wishlist')
        .doc(itemId)
        .delete();
      ToastAndroid.show('Removed From Wishlist', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show('Please Login', ToastAndroid.SHORT);
    }
  };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleItemPress(item)}
      style={styles.card}
    >
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.Foodname}</Text>
        <Text style={styles.price}>₹ {item.Price}</Text>
        <Text style={styles.description}>{item.Description}</Text>
      </View>
      <TouchableOpacity onPress={() => removeFromWishlist(item.id)} style={styles.removeButton}>
        <FontAwesomeIcon icon={faTrash} size={20} color="#FF5733" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('wishlist_label')}</Text>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={wishlist.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={<Text style={styles.emptyMessage}>{t('wish-empty')}</Text>}
      />
    </View>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  list: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    padding: 15,
    marginVertical: 8,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4CAF50',
    marginVertical: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  removeButton: {
    padding: 10,
  },
  emptyMessage: {
    fontSize: 20,
    textAlign: 'center',
    color: '#999',
  },
});
