// ForgotPassword.js
import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid , BackHandler} from 'react-native';
import auth from '@react-native-firebase/auth';
import i18n from "../services/i18next";
import { useTranslation } from 'react-i18next';
const ForgotPassword = ({ navigation }) => {
  const {t} = useTranslation();
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
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('Login'); // Navigate to Login screen on back press
      return true; // Prevent default back behavior (exit app)
    });

    return () => {
      backHandler.remove(); // Cleanup back handler on component unmount
    };
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('reset_password_label')}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>{t('registered_email_instruction')}</Text>
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
