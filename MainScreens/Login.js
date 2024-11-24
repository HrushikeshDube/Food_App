import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image, ToastAndroid, ActivityIndicator, ScrollView, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import auth from '@react-native-firebase/auth';
import LanguageSelector from '../components/langsel';
import i18n from "../services/i18next";
import { useTranslation } from 'react-i18next';
const Login = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [backPressCount, setBackPressCount] = useState(0);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        navigation.replace('Tabnavigation', { userEmail: user.email });
      } else {
        setLoading(false);
      }
    });

    // Handle double back press for exit
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (backPressCount === 0) {
        setBackPressCount(1);
        ToastAndroid.show('Press again to exit', ToastAndroid.SHORT);
        
        setTimeout(() => {
          setBackPressCount(0);
        }, 2000); // Reset back press count after 2 seconds

        return true; // Prevent default back behavior
      } else if (backPressCount === 1) {
        BackHandler.exitApp();
        return true;
      }
    });

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, [navigation, backPressCount]);

  const handleLogin = () => {
    setLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        ToastAndroid.show('Successfully Logged In', ToastAndroid.SHORT);
        setEmail('');
        setPassword('');
        navigation.replace('Tabnavigation', { userEmail: email });
      })
      .catch(() => {
        ToastAndroid.show('Invalid Credentials', ToastAndroid.SHORT);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF5733" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../Assests/bb.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.box}>
          <Image source={require('../Assests/SAMOSA.png')} style={styles.pic} />
          <Text style={styles.logintext}>{t('login')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('email')}
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputPassword}
              placeholder={t('password')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} size={20} color="gray" />
            </TouchableOpacity>
          </View>
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
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotText}>{t('forgot_password')}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.5}>
            <Text style={styles.buttonText}>{t('login')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.5}>
            <Text style={styles.title}>
            {t('new_user')} <Text style={styles.signupText}>{t('sign_up')}</Text>
            </Text>
          </TouchableOpacity>
          <LanguageSelector/>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  pic: {
    height: 200,
    width: 200,
    marginTop: -50,
  },
  box: {
    width: "90%",
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  inputPassword: {
    flex: 1,
    height: 40,
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
  signupText: {
    color: 'gray',
    textDecorationLine: 'underline',
  },
});

export default Login;
