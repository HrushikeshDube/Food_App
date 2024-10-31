import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';

const AboutUs = () => {
  const handleContactPress = () => {
    Linking.openURL('mailto:hrushidube9779@gmail.com');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../Assests/food.png')} style={styles.logo} />
      
      <Text style={styles.title}>About Us</Text>
      
      <Text style={styles.description}>
        Welcome to FoodOrder App! We are dedicated to providing a seamless dining experience, allowing you to order from your favorite restaurants directly from your table.
        With FoodOrder, you can skip the wait and enjoy hassle-free, contactless ordering and payments.
      </Text>
      
      <Text style={styles.subheading}>Our Mission</Text>
      <Text style={styles.description}>
        Our mission is to revolutionize the dining experience by connecting customers to restaurants effortlessly. 
        We aim to improve service speed and reduce human contact, making your dining safer, faster, and more enjoyable.
      </Text>
      
      <Text style={styles.subheading}>Contact Us</Text>
      <Text style={styles.description}>
        For any questions or support, feel free to reach out to us at:
      </Text>
      
      <TouchableOpacity onPress={handleContactPress}>
        <Text style={styles.contactText}>hrushidube9779@gmail.com</Text>
      </TouchableOpacity>
      
      <Text style={styles.footer}>© 2024 FoodOrder Inc. All rights reserved.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F8F8F8',
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6347',
    marginBottom: 15,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  contactText: {
    fontSize: 16,
    color: '#FF6347',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginVertical: 5,
  },
  footer: {
    fontSize: 12,
    color: '#AAA',
    textAlign: 'center',
    marginTop: 30,
  },
});

export default AboutUs;
