import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Import local images
const breakfastImage = require('../Assests/breakfast.png');
const bhajiImage = require('../Assests/bhaji.png');
const rotiImage = require('../Assests/roti.png');
const riceImage = require('../Assests/rice.png');
const dessertImage = require('../Assests/deserts.png');
const colddrinkImage = require('../Assests/drinks.png');

// Array of image sources for the boxes with target screens
const boxImages = [
  {
    image: breakfastImage,
    name: 'Breakfast',
    screen: 'Breakfast',
  },
  {
    image: bhajiImage,
    name: 'Bhaji\'s',
    screen: 'Bhaji',
  },
  {
    image: rotiImage,
    name: 'Roti\'s',
    screen: 'Roti',
  },
  {
    image: riceImage,
    name: 'Rice',
    screen: 'Rice',
  },
  {
    image: dessertImage,
    name: 'Desserts',
    screen: 'Desert',
  },
  {
    image: colddrinkImage,
    name: 'Drink\'s',
    screen: 'Drink',
  },
];

const Home = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null); // State to store the profile image URL
  const [offerImages, setOfferImages] = useState([]); // State to store an array of offer images

  useEffect(() => {
    const fetchProfileImage = async () => {
      const user = auth().currentUser; // Get the currently authenticated user
      if (user) {
        const userDoc = await firestore().collection('Users').doc(user.email).get(); // Fetch user data
        if (userDoc.exists) {
          const data = userDoc.data();
          if (data.profileImage) {
            setProfileImage(data.profileImage); // Set the profile image URL from Firestore
          }
        }
      }
    };

    const fetchOfferImages = async () => {
      const offerSnapshot = await firestore().collection('Offer').get(); // Fetch all documents from the Offer collection
      const images = offerSnapshot.docs.map(doc => doc.data().Offerimage).filter(Boolean); // Extract offer images
      setOfferImages(images); // Set the offer images array
    };

    fetchProfileImage();
    fetchOfferImages();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>Order Joy, Your Next Meal Is Just A Tap Away!</Text>
          <TouchableOpacity style={styles.menu} onPress={() => navigation.navigate('Account')}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <FontAwesomeIcon icon={faUser} size={20} color={"#FF5733"} />
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}><FontAwesomeIcon icon={faSearch} size={20} color={"#FF5733"} /></Text>
          </TouchableOpacity>
        </View>

        {/* Offer Card Section with Scrollable Image Background */}
        <View style={styles.offercard}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {offerImages.length > 0 ? (
              offerImages.map((image, index) => (
                <ImageBackground
                  key={index}
                  source={{ uri: image }}
                  style={styles.offerImage}
                  imageStyle={{ borderRadius: 8 }}  // Ensures the image has rounded corners
                >
                  {/* Optionally, you can add content inside the ImageBackground */}
                </ImageBackground>
              ))
            ) : (
              <Text style={styles.loadingText}>Loading offers...</Text>
            )}
          </ScrollView>
        </View>

        {/* Horizontal Scrolling Component for food categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.boxContainer}>
          {boxImages.map((item, index) => (
            <TouchableOpacity key={index} style={styles.box} onPress={() => navigation.navigate(item.screen)}>
              <Image source={item.image} style={styles.boxImage} />
              <View style={styles.textContainer}>
                <Text style={styles.boxText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    fontSize: 22,
    fontWeight: 'bold',
    width: '80%',
    color: "black",
  },
  menu: {
    width: 40,
    height: 40,
    borderRadius: 20, // Optional: Makes the profile image circular
    overflow: 'hidden', // Ensures image fits in the rounded container
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20, // Circular profile image
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
    width: "100%",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  offercard: {
    height: 180,
    width: "100%",
    borderRadius: 10,
    marginTop: 5,
    overflow: 'hidden', // Ensures that images do not overflow outside the card
  },
  offerImage: {
    width:400, // Set width for each offer image
    height: '100%', // Ensure the image fills the height of the offer card
    justifyContent: 'center', // Center content inside ImageBackground
    alignItems: 'center',
    borderRadius: 8,
  },
  loadingText: {
    color: '#FF5733',
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  boxContainer: {
    marginTop: 20,
    flexDirection: 'row',
  },
  box: {
    height: 120,
    width: 101,
    marginHorizontal: 5,
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: "white",
  },
  boxImage: {
    height: '80%',
    width: '100%',
    borderRadius: 5,
  },
  textContainer: {
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    color: 'black',
    fontWeight: 'bold',
    marginTop: -12,
  },
});

export default Home;
