import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';

const Changepassword = () => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    if (!email) {
      ToastAndroid.show("Please enter your email address.", ToastAndroid.SHORT);
      return;
    }
    
    try {
      await auth().sendPasswordResetEmail(email);
      ToastAndroid.show("Password reset link sent to your email!", ToastAndroid.SHORT);
      setEmail('')
    } catch (error) {
      console.error("Error sending password reset email:", error);
      ToastAndroid.show("Failed to send password reset email.", ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your registered email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Changepassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F5',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderColor: '#DDD',
    borderWidth: 1,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
