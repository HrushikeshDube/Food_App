import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ToastAndroid, ScrollView } from 'react-native';
import { firebase } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen = () => {
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    profileImage: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth().currentUser;
      if (user) {
        const userEmail = user.email;
        try {
          const userDoc = await firebase.firestore().collection('Users').doc(userEmail).get();
          if (userDoc.exists) {
            setUserData(userDoc.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    const user = auth().currentUser;
    if (user) {
      try {
        await firebase.firestore().collection('Users').doc(user.email).update(userData);
        ToastAndroid.show("Profile updated successfully!", ToastAndroid.SHORT);
      } catch (error) {
        console.error("Error updating document:", error);
        ToastAndroid.show("Error updating profile!", ToastAndroid.SHORT);
      }
    }
  };

  const handleImagePick = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });

    if (result.assets && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      uploadImage(imageUri);
    }
  };

  const uploadImage = async (uri) => {
    const user = auth().currentUser;
    if (!user) return;

    const filename = user.email + '_profile.jpg';
    const storageRef = storage().ref(`profileImages/${filename}`);

    try {
      await storageRef.putFile(uri);
      const downloadURL = await storageRef.getDownloadURL();
      
      setUserData((prevData) => ({ ...prevData, profileImage: downloadURL }));

      // Update Firestore with new profile image URL
      await firebase.firestore().collection('Users').doc(user.email).update({
        profileImage: downloadURL,
      });
      ToastAndroid.show("Profile image updated successfully!", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error uploading image:", error);
      ToastAndroid.show("Error updating profile image!", ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            style={styles.avatar}
            source={{ uri: userData.profileImage || 'https://via.placeholder.com/100' }} // Placeholder image if none exists
          />
          <Text style={styles.name}>{userData.name || 'Your Name'}</Text>
          <TouchableOpacity onPress={handleImagePick}>
            <Text style={styles.changePhotoText}>Change photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>My Name</Text>
          <TextInput
            style={styles.input}
            value={userData.username}
            onChangeText={(text) => setUserData({ ...userData, name: text })}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={userData.mobile}
            onChangeText={(text) => setUserData({ ...userData, phone: text })}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={userData.email}
            editable={false} // Email should be non-editable
          />

          <Text style={styles.label}>My Address</Text>
          <TextInput
            style={styles.input}
            value={userData.address}
            onChangeText={(text) => setUserData({ ...userData, address: text })}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F5',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderColor: '#FF6347',
    borderWidth: 2,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  changePhotoText: {
    color: '#FF6347',
    fontSize: 14,
    marginTop: 5,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
