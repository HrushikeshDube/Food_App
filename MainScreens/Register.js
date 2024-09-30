import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Register = () => {
  return (
    <View>
      <Text style={styles.container}>Register</Text>
    </View>
  )
}

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'red', // Replace with the desired background color
  },
})