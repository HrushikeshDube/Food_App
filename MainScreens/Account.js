import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions, ToastAndroid } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faLock, faCreditCard, faBell, faInfoCircle, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import firebase from '@react-native-firebase/app';

const { width } = Dimensions.get('window');

const Profile = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [userData, setUserData] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/100');

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
        fetchUserData(user.email);
      } else {
        setUserEmail(null);
        setUserData(null);
      }
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (email) => {
    try {
      const userDoc = await firestore().collection('Users').doc(email).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        setUserData(userData);
        if (userData.profileImage) {
          setProfileImage(userData.profileImage);
        }
      } else {
        console.log("User data not found in Firestore");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleImagePicker = async () => {
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const source = response.assets[0].uri;
        setProfileImage(source);

        const user = auth().currentUser;
        const reference = storage().ref(`profileImages/${user.email}.jpg`);
        
        try {
          await reference.putFile(source);
          const url = await reference.getDownloadURL();

          await firestore().collection('Users').doc(user.email).set(
            { profileImage: url },
            { merge: true }
          );

          ToastAndroid.show('Profile Image Updated', ToastAndroid.SHORT);
        } catch (error) {
          console.error('Error uploading image: ', error);
          ToastAndroid.show('Error uploading image', ToastAndroid.SHORT);
        }
      }
    });
  };

  const handleSignOut = () => {
    auth().signOut().then(() => {
      ToastAndroid.show('Successfully Signed Out', ToastAndroid.SHORT);
      navigation.navigate("Login");
    }).catch((error) => {
      console.error(error);
    });
  };

  if (initializing) {
    return <View><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={handleImagePicker}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          </TouchableOpacity>
          <Text style={styles.name}>{userData && userData.username}</Text>
          <Text style={styles.phoneNumber}>{userData && userData.mobile}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {[
            { title: 'My Profile', icon: faUser, screen: 'Myprofile' },
            { title: 'Change Password', icon: faLock, screen: 'Changepassword' },
            { title: 'Payment Settings', icon: faCreditCard, screen: 'Paymentsetting' },
            { title: 'Notification', icon: faBell, screen: 'Notifications' },
            { title: 'About Us', icon: faInfoCircle, screen: 'Aboutus' },
          ].map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => navigation.navigate(option.screen)}
            >
              <FontAwesomeIcon icon={option.icon} size={20} color="#FF6347" style={styles.optionIcon} />
              <Text style={styles.optionText}>{option.title}</Text>
              <FontAwesomeIcon icon={faChevronRight} size={16} color="#aaa" style={styles.chevronIcon} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  phoneNumber: {
    fontSize: 16,
    color: '#666',
  },
  optionsContainer: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  chevronIcon: {
    color: '#aaa',
  },
  signOutButton: {
    width: width * 0.9,
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6347',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#aaa',
  },
});
