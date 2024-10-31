import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch,faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Array of image URLs for the boxes
const boxImages = [
  {
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ5QtobNY5VLWxPofydn-LskVa9h2X3N4iOA&s',
    name: 'Pizza',
  },
  {
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ5QtobNY5VLWxPofydn-LskVa9h2X3N4iOA&s',
    name: 'Burgers',
  },
  {
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ5QtobNY5VLWxPofydn-LskVa9h2X3N4iOA&s',
    name: 'Sushi',
  },
  {
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ5QtobNY5VLWxPofydn-LskVa9h2X3N4iOA&s',
    name: 'Pasta',
  },
  {
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ5QtobNY5VLWxPofydn-LskVa9h2X3N4iOA&s',
    name: 'Desserts',
  },
  {
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ5QtobNY5VLWxPofydn-LskVa9h2X3N4iOA&s',
    name: 'Salads',
  },
];

const Home = () => {
  const navigation = useNavigation(); 
  const [profileImage, setProfileImage] = useState(null); // State to store the profile image URL

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

    fetchProfileImage();
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

        {/* Offer Card Section with Background Image */}
        <View style={styles.offercard}>
          <ImageBackground
            source={{ uri: 'https://cdn.grabon.in/gograbon/images/web-images/uploads/1618575517942/food-coupons.jpg' }}
            style={styles.offerImage}
            imageStyle={{ borderRadius: 8 }}  // Ensures the image has rounded corners
          >
          </ImageBackground>
        </View>

        {/* Horizontal Scrolling Component */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.boxContainer}>
          {boxImages.map((item, index) => (
            <View key={index} style={styles.box}>
              <ImageBackground
                source={{ uri: item.image }}
                style={styles.boxImage}
                imageStyle={{ borderRadius: 5 }} // Rounded corners for the image
              >
              </ImageBackground>
              <Text style={styles.boxText}>{item.name}</Text> 
            </View>
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
  },
  offerImage: {
    width: '100%',
    height: "100%",
    justifyContent: 'center', // Center content inside ImageBackground
    alignItems: 'center',
  },
  boxContainer: {
    marginTop: 20,
    flexDirection: 'row', // Aligns the boxes horizontally
  },
  box: {
    height: 80,
    width: 80,
    backgroundColor: 'transparent', // Remove solid background color for image
    marginHorizontal: 5, // Adds space between boxes
    borderRadius: 5, // Optional: Adds rounded corners to boxes
    overflow: 'hidden', // Ensure children are clipped to the border
  },
  boxImage: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    color: 'black',
    fontWeight: 'bold',
    position: 'absolute',
    marginTop:60,
    marginLeft:10 // Position the text over the image
  },
});

export default Home;
