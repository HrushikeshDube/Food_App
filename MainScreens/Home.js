import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Image, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const { width } = Dimensions.get('window');

// Import local images
const breakfastImage = require('../Assests/breakfast.png');
const bhajiImage = require('../Assests/bhaji.png');
const rotiImage = require('../Assests/roti.png');
const riceImage = require('../Assests/rice.png');
const dessertImage = require('../Assests/deserts.png');
const colddrinkImage = require('../Assests/drinks.png');

// Array of image sources for the boxes with target screens
const boxImages = [
  { image: breakfastImage, name: 'Breakfast', screen: 'Breakfast' },
  { image: bhajiImage, name: "Bhaji's", screen: 'Bhaji' },
  { image: rotiImage, name: "Roti's", screen: 'Roti' },
  { image: riceImage, name: 'Rice', screen: 'Rice' },
  { image: dessertImage, name: 'Desserts', screen: 'Desert' },
  { image: colddrinkImage, name: "Drink's", screen: 'Drink' },
];

const Home = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [offerImages, setOfferImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [todaySpecialItems, setTodaySpecialItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredSpecialItems, setFilteredSpecialItems] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState(boxImages);

  useEffect(() => {
    const fetchProfileImage = async () => {
      const user = auth().currentUser;
      if (user) {
        const userDoc = await firestore().collection('Users').doc(user.email).get();
        if (userDoc.exists) {
          const data = userDoc.data();
          if (data.profileImage) {
            setProfileImage(data.profileImage);
          }
        }
      }
    };

    const fetchOfferImages = async () => {
      const offerSnapshot = await firestore().collection('Offer').get();
      const images = offerSnapshot.docs.map(doc => doc.data().Offerimage).filter(Boolean);
      setOfferImages(images);
    };

    const fetchTodaySpecial = async () => {
      try {
        const snapshot = await firestore().collection('TodaySpecial').get();
        const specials = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            Foodname: data.Foodname || "Unknown Item",
            Price: data.Price || "N/A",
            image: data.image || null,
          };
        });
        setTodaySpecialItems(specials);
        setFilteredSpecialItems(specials); // Initialize filtered items
      } catch (error) {
        console.error("Error fetching today's specials:", error);
      }
    };

    fetchProfileImage();
    fetchOfferImages();
    fetchTodaySpecial();
  }, []);

  // Update search results when search text changes
  useEffect(() => {
    if (searchText === '') {
      setFilteredSpecialItems(todaySpecialItems);
      setFilteredCategories(boxImages);
    } else {
      const filteredSpecials = todaySpecialItems.filter(item =>
        item.Foodname.toLowerCase().includes(searchText.toLowerCase())
      );
      const filteredCategories = boxImages.filter(category =>
        category.name.toLowerCase().includes(searchText.toLowerCase())
      );

      setFilteredSpecialItems(filteredSpecials);
      setFilteredCategories(filteredCategories);
    }
  }, [searchText, todaySpecialItems]);

  // Function to handle scroll event
  const handleScroll = (event) => {
    const slideIndex = Math.ceil(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}><FontAwesomeIcon icon={faSearch} size={20} color={"#FF5733"} /></Text>
          </TouchableOpacity>
        </View>

        {/* Offer Card Section */}
        <View style={styles.offercard}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
            {offerImages.length > 0 ? (
              offerImages.map((image, index) => (
                <ImageBackground
                  key={index}
                  source={{ uri: image }}
                  style={[styles.offerImage, { width }]}
                  imageStyle={{ borderRadius: 9 }}
                >
                  {/* Optional content inside the ImageBackground */}
                </ImageBackground>
              ))
            ) : (
              <Text style={styles.loadingText}>Loading offers...</Text>
            )}
          </ScrollView>

          {/* Slide indicator */}
          <View style={styles.indicatorContainer}>
            {offerImages.map((_, index) => (
              <View key={index} style={[styles.indicatorDot, currentSlide === index && styles.activeDot]} />
            ))}
          </View>
        </View>

        <Text style={styles.sectext}>Categories</Text>
        {/* Horizontal Scrolling Component for food categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.boxContainer}>
          {filteredCategories.map((item, index) => (
            <TouchableOpacity key={index} style={styles.box} onPress={() => navigation.navigate(item.screen)}>
              <Image source={item.image} style={styles.boxImage} />
              <View style={styles.textContainer}>
                <Text style={styles.boxText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.todaysspecialbox}>
          <Text style={styles.sectext}>Today's Special</Text>
          <Text style={styles.secsubtext}>Will Make Your Day Special</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sboxContainer}>
            {filteredSpecialItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.todaybox} activeOpacity={0.9}>
                <Image source={{ uri: item.image }} style={styles.spboxImage} />
                <View style={styles.textsign}>
                  <View style={styles.sptextContainer}>
                    <Text style={styles.spboxText}>{item.Foodname}</Text>
                    <Text style={styles.spboxText}>₹ {item.Price}</Text>
                  </View>
                  <TouchableOpacity activeOpacity={0.5} style={styles.addText}>
                    <FontAwesomeIcon icon={faPlus} size={20} color={"#FF5733"} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 10
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
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginLeft: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    width: "96%",

  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,

  },
  offercard: {
    height: 180,
    width: "100%",
    borderRadius: 20,
    marginTop: 5,
    overflow: 'hidden',
    paddingHorizontal: 4
  },
  offerImage: {
    width: width, // Full width of the device
    height: '100%', // Full height of the offercard container
    resizeMode: 'cover', // Ensures the image covers the entire space without distortion
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  loadingText: {
    color: '#FF5733',
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#FF5733',
  },
  boxContainer: {
    marginTop: 20,
    flexDirection: 'row',
    paddingHorizontal: 10
  },
  box: {
    height: 120,
    width: 110,
    marginHorizontal: 5,
    borderRadius: 10,         // Slightly rounder corners
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: "white",
    marginBottom: 10,
    shadowColor: "#000",       // Add shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,              // Elevation for Android shadow
    borderWidth: 1,
    borderColor: "#f0f0f0",    // Light border to distinguish box edges
    padding: 10,               // Padding for inner content
  },
  iconStyle: {
    width: 50,
    height: 50,
    resizeMode: "contain",     // Ensure icons fit well
    marginBottom: 5,
  },
  textStyle: {
    fontSize: 14,
    color: "#333",
    textAlign: 'center',
    fontWeight: '600',
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
  sectext: {
    marginTop: 15,
    left: 3,
    fontWeight: "bold",
    color: "black",
    paddingHorizontal: 10,
    fontSize:20
  },
  secsubtext:{
    fontSize:15,
    color:"white",
    left: 15,
  },
  sboxContainer: {
    marginTop: 20,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  todaysspecialbox: {
    height: 400,
    width: "100%",
    marginBottom: 100,
    marginVertical: 10, // Keep some vertical margin if needed
    backgroundColor: '#FF5733', // Background color set to orange
    paddingBottom: 20,
    marginLeft: 0, // No left margin
    marginRight: 0,  // Changed to orange as requested
  },
  todaybox: {
    height: 290,
    width: 220,
    backgroundColor: "white",
    marginHorizontal: 20,
    marginLeft: 2,
    borderRadius: 20
  },
  spboxImage: {
    height: "75%",
    width: "100%",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  sptextContainer: {
    flexDirection: "column",
    marginTop: 15,
    fontWeight: 'bold'
  },
  spboxText: {
    color: 'black',
    fontWeight: 'bold',
    marginHorizontal: 10
  },
  textsign: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-between"
  },
  addText: {
    marginRight:10,
    top:10,
    height: 30,
    width: 30,
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
  }
});

export default Home;

