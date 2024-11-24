import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image, ScrollView, Alert,BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import i18n from "../services/i18next";
import { useTranslation } from 'react-i18next';
const Register = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const validateInputs = () => {
    if (!username || !email || !password || !address || !mobile) {
      Alert.alert('Error', 'Please fill in all fields.');
      return false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{7,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Error',
        'Password must be at least 7 characters long, with one uppercase letter, one number, and one special symbol.'
      );
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      await firestore().collection('Users').doc(email).set({
        username,
        email,
        address,
        mobile,
        rememberMe
      });

      Alert.alert('Success', 'Registration successful!');
      setUsername('');
      setEmail('');
      setPassword('');
      setAddress('');
      setMobile('');
      setRememberMe(false);

      navigation.navigate('Login');
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Database Error');
    }
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
    <ScrollView>
      <ImageBackground
        source={require('../Assests/bb.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.box}>
          <Image source={require('../Assests/SAMOSA.png')} style={styles.pic} />
          <Text style={styles.logintext}>{t('register')}</Text>

          <TextInput
            style={styles.input}
            placeholder={t('username')}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder={t('email')}
            value={email}
            onChangeText={setEmail}
          />

          {/* Password Input with Show/Hide Toggle */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder={t('password')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <FontAwesomeIcon icon={isPasswordVisible ? faEye : faEyeSlash} size={20} color="gray" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder={t('adress')}
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            style={styles.input}
            placeholder={t('mobile_number')}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
          />
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.rememberMeText}>{t('remember_me')}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleRegister} activeOpacity={0.5}>
            <Text style={styles.buttonText}>{t('register')}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.5}>
            <Text style={styles.title}>
              Already Registered? <Text style={styles.signupText}>{t('signin')}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScrollView>
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
    marginTop: -90,
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
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    paddingHorizontal: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  forgotText: {
    color: 'gray',
    textDecorationLine: 'underline',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'gray',
    marginRight: 5,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FF5733',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
  },
  rememberMeText: {
    color: 'black',
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
