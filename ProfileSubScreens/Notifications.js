import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from Firestore's "Notifications" collection
    const unsubscribe = firestore()
      .collection('Notifications')
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          message: doc.data().Message,
          timestamp: doc.data().Timestamp, // Fetch the timestamp
        }));

        // Get the current time for comparison
        const now = moment();
        const recent = [];
        const yesterday = [];

        data.forEach((notification) => {
          const notificationTime = moment(notification.timestamp.toDate());
          const hoursDiff = now.diff(notificationTime, 'hours');

          if (hoursDiff < 24) {
            recent.push(notification); // Less than 24 hours
          } else if (hoursDiff > 24 && hoursDiff < 48) {
            yesterday.push(notification); // Between 24 and 48 hours
          } else {
            // Delete notification from Firestore if older than 48 hours
            firestore().collection('Notifications').doc(notification.id).delete();
          }
        });

        // Combine both notifications with section titles
        const combinedNotifications = [
          { title: 'Recent', data: recent },
          { title: 'Yesterday', data: yesterday },
        ];

        setNotifications(combinedNotifications);
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.notificationContainer}>
      <View style={styles.iconContainer}>
        <FontAwesomeIcon icon={faUtensils} size={24} color="#FF5733" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.timeText}>
          {moment(item.timestamp.toDate()).fromNow()}
        </Text>
      </View>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          item.data.length > 0 ? (
            <FlatList
              data={item.data}
              renderItem={renderItem}
              keyExtractor={(notification) => notification.id}
              ListHeaderComponent={renderSectionHeader({ section: item })}
              ListEmptyComponent={<Text style={styles.emptyText}>No notifications available</Text>}
            />
          ) : null
        )}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No notifications available</Text>}
      />
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Allow the container to fill the screen
    padding: 16,
    backgroundColor: '#fff', // Set the desired background color for the entire screen
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4, 
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  iconContainer: {
    backgroundColor: '#fff', 
    padding: 8,
    borderRadius: 50, // Circular shape
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    color: 'black',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});
