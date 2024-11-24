import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity ,Image} from 'react-native';
import i18next from '../services/i18next';

const LanguageSelector = () => {
  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Hindi', value: 'hin' },
    { label: 'Marathi', value: 'mara' },
    { label: 'Japanese', value: 'jap' },
    { label: 'Spanish', value: 'span' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLanguageToggle = () => {
    const nextIndex = (currentIndex + 1) % languages.length;
    setCurrentIndex(nextIndex);
    const selectedLanguage = languages[nextIndex].value;
    i18next.changeLanguage(selectedLanguage); // Change language dynamically
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toggleButton} onPress={handleLanguageToggle}>
        <View style={styles.languageContainer}>
          <Image source={require('../Assests/languages.png')} style={styles.languageIcon} />
          <Text style={styles.toggleButtonText}>{languages[currentIndex].label}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  toggleButton: {
    backgroundColor: '#FF5733',
    padding: 10,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#FFF',
  },
});

export default LanguageSelector;
