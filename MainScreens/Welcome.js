import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const Welcome = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        navigation.replace('Tabnavigation'); // Navigate to Tabnavigation if user is logged in
      }
      // If the user is not logged in, the welcome screen will be displayed
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FOODIEE</Text>
      <Image source={require('../Assests/food.png')} style={styles.image} />
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
    backgroundColor: '#FF5733',
  },
  image: {
    width: '80%',
    height: '60%',
    borderRadius: 10,
    marginBottom: 50,
    marginTop: 30,
    marginLeft: 25,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    marginTop: 30,
  },
  button: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5733',
  },
});
