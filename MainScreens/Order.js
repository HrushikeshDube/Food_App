import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity,ToastAndroid } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import RazorpayCheckout from 'react-native-razorpay';
import i18n from "../services/i18next";
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/langsel';
const Order = () => {
  const {t} = useTranslation();
  const [Cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      const unsubscribe = firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('Cart')
        .onSnapshot(snapshot => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCart(items);
        });
      return unsubscribe;
    }
  }, []);

  useEffect(() => {
    const total = Cart.reduce((acc, item) => acc + item.Price * item.quantity, 0);
    setTotalAmount(total);
  }, [Cart]);

  const removeFromCart = async (itemId) => {
    const user = auth().currentUser;
    if (user) {
      await firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('Cart')
        .doc(itemId)
        .delete();
        ToastAndroid.show('Removed From Cart', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show('Login Please', ToastAndroid.SHORT);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    const user = auth().currentUser;
    if (user) {
      if (newQuantity > 0) {
        await firestore()
          .collection('Users')
          .doc(user.uid)
          .collection('Cart')
          .doc(itemId)
          .update({ quantity: newQuantity });
      } else {
        // If quantity is zero, remove the item from the cart
        removeFromCart(itemId);
      }
    }
  };
  const logo = Image.resolveAssetSource(require('../Assests/Logo1.png')).uri;
  const Paymentrazor = ()=>{
    var options = {
      description: 'Pay and have fun',
      image: logo,
      currency: 'INR',
      key: 'rzp_test_uY5O09cEm1oquM',
      amount:  totalAmount * 100,
      name: 'Foodiee',
      prefill: {
        email: '',
        contact: '',
        name: ''
      },
      theme: {color: '#FF5733'}
    }
    RazorpayCheckout.open(options).then((data) => {
      // handle success
      ToastAndroid.show('Successfull Payment', ToastAndroid.SHORT);
    }).catch((error) => {
      // handle failure
      ToastAndroid.show('Transaction Cancelled', ToastAndroid.SHORT);
    });
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.Foodname}</Text>
        <Text style={styles.price}>₹ {item.Price}</Text>
        {item.additionalNotes ? (
        <View style={styles.noteContainer}>
          <Text style={styles.noteLabel}>Note:</Text>
          <Text style={styles.noteText}>{item.additionalNotes}</Text>
        </View>
      ) : null}
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)}>
          <FontAwesomeIcon icon={faMinus} size={18} color="#FF5733" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)}>
          <FontAwesomeIcon icon={faPlus} size={18} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeButton}>
          <FontAwesomeIcon icon={faTrash} size={18} color="#FF5733" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('cart_label')}</Text>
      <FlatList
        data={Cart}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={Cart.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={<Text style={styles.emptyMessage}>{t('cart-empty')}</Text>}
      />
      {Cart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalSection}>
            <Text style={styles.totalAmount}>Total: ₹ {totalAmount}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={()=>Paymentrazor()}>
            <Text style={styles.checkoutButtonText}>Pay and Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Order;

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
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 10,
  },
  removeButton: {
    paddingLeft: 10,
  },
  emptyMessage: {
    fontSize: 20,
    textAlign: 'center',
    color: '#999',
  },
  footer: {
    padding: 20,
    paddingBottom: 100,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  totalSection: {
    marginBottom: 20,
  },
  totalText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  checkoutButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  noteContainer: {
    padding: 8,
   
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF5733',
  },
  noteText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
});
