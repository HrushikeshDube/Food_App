import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Image, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faSearch, faUser, faArrowRight } from '@fortawesome/free-solid-svg-icons';
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
const Dal = require("../Assests/Dal.png");
const Starter = require("../Assests/manch.png");

const boxImages = [
  { image: breakfastImage, name: 'Breakfast', screen: 'Breakfast' },
  { image: Starter, name: "Starter's", screen: 'Starter' },
  { image: bhajiImage, name: "Bhaji's", screen: 'Bhaji' },
  { image: rotiImage, name: "Roti's", screen: 'Roti' },
  { image: Dal, name: "Dal's", screen: 'Dal' },
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
  const [thingstryitem, setThingstryitem] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredSpecialItems, setFilteredSpecialItems] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState(boxImages);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    const fetchOfferImages = async () => {
      try {
        const offerSnapshot = await firestore().collection('Offer').get();
        const images = offerSnapshot.docs.map(doc => doc.data().Offerimage).filter(Boolean);
        setOfferImages(images);
      } catch (error) {
        console.error("Error fetching offer images:", error);
      }
    };

    const fetchTodaySpecial = async () => {
      try {
        const snapshot = await firestore().collection('TodaySpecial').get();
        const specials = snapshot.docs.map(doc => ({
          id: doc.id,
          Foodname: doc.data().Foodname || "Unknown Item",
          Price: doc.data().Price || "N/A",
          image: doc.data().image || null,
          description: doc.data().description || "", // Provide default value for description
        }));
        setTodaySpecialItems(specials);
        setFilteredSpecialItems(specials);
      } catch (error) {
        console.error("Error fetching today's specials:", error);
      }
    };

    const fetchThingsmusttry = async () => {
      try {
        const snapshot = await firestore().collection('ThingsMusttry').get();
        const musttry = snapshot.docs.map(doc => ({
          id: doc.id,
          Foodname: doc.data().Foodname || "Unknown Item",
          Price: doc.data().Price || "N/A",
          image: doc.data().image || null,
        }));
        setThingstryitem(musttry);
      } catch (error) {
        console.error("Error fetching Things You Must Try items:", error);
      }
    };

    fetchProfileImage();
    fetchOfferImages();
    fetchTodaySpecial();
    fetchThingsmusttry();
  }, []);

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

        <Text style={styles.ssectext}>Categories</Text>
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
          <Text style={styles.ssectext}>Today's Special</Text>
          <Text style={styles.secsubtext}>Will Make Your Day Special</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sboxContainer}>
            {filteredSpecialItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.todaybox}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Itemdesc', {
                  Foodname: item.Foodname,
                  Price: item.Price,
                  description: item.Description, // if available in item
                  image: item.image,
                })}
              >
                <Image source={{ uri: item.image }} style={styles.spboxImage} />
                <View style={styles.textsign}>
                  <View style={styles.sptextContainer}>
                    <Text style={styles.spboxText}>{item.Foodname}</Text>
                    <Text style={styles.spboxText}>₹ {item.Price}</Text>
                  </View>
                  <TouchableOpacity activeOpacity={0.5} style={styles.addText} onPress={() => navigation.navigate('Itemdesc', {
                    Foodname: item.Foodname,
                    Price: item.Price,
                    description: item.Description, // if available in item
                    image: item.image,
                  })}>
                    <FontAwesomeIcon icon={faPlus} size={20} color={"#FF5733"} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.stodaysspecialbox}>
  <Text style={styles.ssectext}>Things You Must Try!</Text>
  <Text style={styles.ssecsubtext}>Don't miss out on these mouth-watering dishes.</Text>
  <TouchableOpacity style={styles.arrowButton} onPress={() => navigation.navigate('Thingsmusttry')}>
    <FontAwesomeIcon icon={faArrowRight} size={20} color={"#FF5733"} />
  </TouchableOpacity>
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sboxContainer}>
    {thingstryitem.slice(0, 3).map((item, index) => (
      <TouchableOpacity
        key={index}
        style={styles.todaybox}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Itemdesc', {
          Foodname: item.Foodname,
          Price: item.Price,
          image: item.image,
          description: item.Description
        })}
      >
        <Image source={{ uri: item.image }} style={styles.spboxImage} />
        <View style={styles.textsign}>
          <View style={styles.sptextContainer}>
            <Text style={styles.spboxText}>{item.Foodname}</Text>
            <Text style={styles.spboxText}>₹ {item.Price}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.5} style={styles.addText} onPress={() => navigation.navigate('Itemdesc', {
            Foodname: item.Foodname,
            Price: item.Price,
            image: item.image,
            description: item.Description
          })}>
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
    paddingHorizontal: 1
  },
  box: {
    height: 120,
    width: 110,
    marginHorizontal: 7,
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
    marginTop: 8
  },
  boxText: {
    color: 'black',
    fontWeight: 'bold',
    marginTop: -12,
  },
  sectext: {
    marginTop: 15,
    right: 100,
    fontWeight: "bold",
    color: "black",
    paddingHorizontal: 10,
    fontSize: 20
  },
  ssectext: {
    marginTop: 15,
    right: 1,
    fontWeight: "bold",
    color: "black",
    paddingHorizontal: 10,
    fontSize: 20
  },
  secsubtext: {
    fontSize: 15,
    color: "white",
    left: 15,
  },
  ssecsubtext: {
    left: 10,
  },
  sboxContainer: {
    marginTop: 20,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  todaysspecialbox: {
    height: 400,
    width: "100%",
    marginTop: 20,
    backgroundColor: '#FF5733', // Background color set to orange
    marginLeft: 0, // No left margin
    marginRight: 0,  // Changed to orange as requested
  },
  stodaysspecialbox: {
    marginBottom: 20,
    position: 'relative', 
    marginBottom:100// Make sure the parent view is positioned
  },
  arrowButton: {
    position: 'absolute', // Position it absolutely
    right: 15, // Adjust this value as needed
    top: 15, // Adjust this value as needed
    backgroundColor: 'transparent', // Make the background transparent
    padding: 5, // Add some padding for better touch response
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
    justifyContent: "space-between"
  },
  addText: {
    marginRight: 10,
    top: 10,
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
  },
  ThingsYouMustTrybox: {
    height: 400,
    width: "100%",
    backgroundColor: '#f5f5f5', // Background color set to orange
    marginLeft: 0, // No left margin
    marginRight: 0,  // Changed to orange as requested
    marginBottom: 80
  },
  thingsecsubtext: {
    color: 'gray',
    left: 15
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 15,
  },
  sectext: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20,
  },
});

export default Home;

