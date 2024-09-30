import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const Register = () => {
  const navigation = useNavigation();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');

  const handleRegister = () => {
    // Implement your registration logic here, e.g., API call
    console.log('Registering with:', { username, email, password, address, mobile });
    navigation.navigate('Login');
  };

  return (
    <ImageBackground 
      source={require('../Assests/bb.png')} 
      style={styles.container} 
      resizeMode="cover"
    >
      <View style={styles.box}>
        <Image source={require('../Assests/SAMOSA.png')} style={styles.pic} />
        <Text style={styles.logintext}>Register</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="Username" 
          value={username} 
          onChangeText={setUsername} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          value={email} 
          onChangeText={setEmail} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Address" 
          value={address} 
          onChangeText={setAddress} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Mobile No" 
          value={mobile} 
          onChangeText={setMobile} 
          keyboardType="phone-pad" // Optional: opens numeric keyboard for phone input
        />
        
        <TouchableOpacity style={styles.button} onPress={handleRegister} activeOpacity={0.5} >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.5}>
          <Text style={styles.title}>
            Already Registered? <Text style={styles.signupText}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pic: {
    height: 200,
    width: 200,
    marginTop: -50,
  },
  box: {
    width: "90%",
    height: "70%", 
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  logintext: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: '#FF5733',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    color: 'black',
    marginTop: 15,
  },
  signupText: {
    color: 'gray',
    textDecorationLine: 'underline',
  },
});
