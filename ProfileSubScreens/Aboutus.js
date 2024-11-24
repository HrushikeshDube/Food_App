import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import i18n from "../services/i18next";
import { useTranslation } from 'react-i18next';

const AboutUs = () => {
  const {t} = useTranslation();
  const handleContactPress = () => {
    Linking.openURL('mailto:hrushidube9779@gmail.com');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../Assests/Logo1.png')} style={styles.logo} />
      
      <Text style={styles.title}>{t('about_us_label')}</Text>
      
      <Text style={styles.description}>
      {t('ourMission')}
      </Text>
      
      <Text style={styles.subheading}>{t('mission')}</Text>
      <Text style={styles.description}>
      {t('ourMission')}
      </Text>
      
      <Text style={styles.subheading}>{t('cont')}</Text>
      <Text style={styles.description}>
      {t('contactUs')}
      </Text>
      
      <TouchableOpacity onPress={handleContactPress}>
        <Text style={styles.contactText}>hrushidube9779@gmail.com</Text>
        <Text style={styles.contactText}>sarthakac10@gmail.com</Text>
        <Text style={styles.contactText}>dangerushi@gmail.com</Text>
        <Text style={styles.contactText}>kohakalekrishna@gmail.com</Text>
      </TouchableOpacity>
      
      <Text style={styles.footer}>© 2024 FoodOrder Inc. All rights reserved.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F8F8F8',
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 60,
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6347',
    marginBottom: 15,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  contactText: {
    fontSize: 16,
    color: '#FF6347',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginVertical: 5,
  },
  footer: {
    fontSize: 12,
    color: '#AAA',
    textAlign: 'center',
    marginTop: 30,
  },
});

export default AboutUs;
