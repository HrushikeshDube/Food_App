import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faCartPlus } from '@fortawesome/free-solid-svg-icons';

const ItemDesc = ({ route }) => {
  const { itemId, Foodname = null, Price = "10", image = null, desc = "Delicious Food with fresh ingredients" } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async () => {
    const user = auth().currentUser;
    if (user) {
      await firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('Cart')
        .doc(itemId)
        .set({
          Foodname,
          Price,
          image,
          quantity,
        });
      ToastAndroid.show('Added to Cart', ToastAndroid.SHORT);
    } else {
      alert('Please log in to add items to your cart');
    }
  };

  const handleAddToWishlist = async () => {
    const user = auth().currentUser;
    if (user) {
      const wishlistRef = firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('Wishlist')
        .doc(itemId);

      if (isWishlisted) {
        await wishlistRef.delete();
        setIsWishlisted(false);
        ToastAndroid.show('Item Removed from Wishlist', ToastAndroid.SHORT);
      } else {
        await wishlistRef.set({
          Foodname,
          Price,
          image,
          Description: desc,
        });
        setIsWishlisted(true);
        ToastAndroid.show('Item Wishlisted', ToastAndroid.SHORT);
      }
    } else {
      alert('Please log in to add items to your wishlist');
    }
  };

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={handleAddToWishlist} style={styles.wishlistButton}>
          <FontAwesomeIcon 
            icon={faHeart} 
            size={30} 
            color={isWishlisted ? "#FF5733" : "#333"} 
          />
        </TouchableOpacity>
        <Image source={{ uri: image || 'https://via.placeholder.com/150' }} style={styles.image} />
        <Text style={styles.name}>{Foodname}</Text>
        <Text style={styles.price}>₹ {Price}</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.descriptionLabel}>Description:</Text>
        <Text style={styles.description}>{desc}</Text>

        <TouchableOpacity onPress={handleAddToCart} style={styles.addToCartButton}>
          <FontAwesomeIcon icon={faCartPlus} size={20} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ItemDesc;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f8f8', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  card: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  wishlistButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  image: { 
    width: 150, 
    height: 150, 
    borderRadius: 75, 
    marginBottom: 20,
  },
  name: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 5 
  },
  price: { 
    fontSize: 20, 
    color: '#4CAF50', 
    marginBottom: 10 
  },
  quantityContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 20,
    borderRadius: 10,
    padding: 10,
  },
  quantityButton: {
    width: 40, 
    height: 40, 
    backgroundColor: '#FF5733', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  quantityText: { 
    fontSize: 18, 
    color: '#333' 
  },
  descriptionLabel: {
    fontSize: 16, 
    color: '#333', 
    marginTop: 10,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
    textAlign: 'center',
  },
  addToCartButton: { 
    marginTop: 20, 
    backgroundColor: '#FF5733', 
    paddingVertical: 15, 
    paddingHorizontal: 60, 
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addToCartText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
