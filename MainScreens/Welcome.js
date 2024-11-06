import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const Welcome = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true); // State to manage loading status

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        navigation.replace('Tabnavigation'); // Navigate to Tabnavigation if user is logged in
      } else {
        setLoading(false); // Stop loading if user is not logged in
      }
    });

    return unsubscribe; 
  }, [navigation]);

  if (loading) {
    // Show a loader if checking the user's authentication state
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF5733" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FOODIEE</Text>
      <Image source={require('../Assests/Logo1.png')} style={styles.image} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')} activeOpacity={0.5}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF5733', // Orange background
  },
  image: {
    width: '80%',
    height: '60%',
    borderRadius: 10,
    marginBottom: 50,
    marginTop: 30,
    marginRight: 70
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF5733', // Adjusted color to match theme
    marginBottom: 20,
    marginTop: 30,
  },
  button: {
    backgroundColor: '#FF5733',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
