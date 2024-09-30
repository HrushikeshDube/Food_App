import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Logging in with email:', email, 'and password:', password);
    navigation.navigate('Home');
  };

  return (
    <ImageBackground 
      source={require('../Assests/bb.png')} 
      style={styles.container} 
      resizeMode="cover"
    >
      <View style={styles.box}>
        <Image source={require('../Assests/SAMOSA.png')} style={styles.pic} />
        <Text style={styles.logintext}>LOGIN</Text>
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
        <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.5}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.5}>
          <Text style={styles.title}>
            New User? <Text style={styles.signupText}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

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
    height: "60%",
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  logintext: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    marginTop: 20,
    marginBottom: 30,
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

export default Login;
