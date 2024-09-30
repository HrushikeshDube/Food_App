import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const Welcome = () => {
  const navigation = useNavigation(); // Move this line inside the component

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
    backgroundColor: '#FF5733', // Replace with the desired background color
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
    color: '#FFFFFF', // Replace with the desired text color
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
    color: '#FF5733', // Replace with the desired button text color
  },
});
