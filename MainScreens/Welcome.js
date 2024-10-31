import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const Welcome = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        navigation.replace('Tabnavigation'); 
      } else {
        setLoading(false); // Show Welcome screen if not logged in
      }
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF5733" />
      </View>
    );
  }

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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
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
