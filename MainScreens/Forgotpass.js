// ForgotPassword.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = () => {
    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        ToastAndroid.show('Password reset link sent!', ToastAndroid.SHORT);
        navigation.navigate('Login'); // Navigate back to login after sending the email
      })
      .catch(error => {
        console.error("Error sending password reset email:", error);
        ToastAndroid.show('Error: ' + error.message, ToastAndroid.SHORT);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#FF5733',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backText: {
    color: 'gray',
    marginTop: 20,
  },
});

export default ForgotPassword;
