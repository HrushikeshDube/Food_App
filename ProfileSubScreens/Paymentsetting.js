import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

// Sample payment methods
const samplePaymentMethods = [
  { id: '1', method: 'Credit Card', last4: '1234', type: 'Visa' },
  { id: '2', method: 'PayPal', last4: 'N/A', type: 'PayPal' },
  { id: '3', method: 'Debit Card', last4: '5678', type: 'MasterCard' },
];

const PaymentDetails = () => {
  const [paymentMethods, setPaymentMethods] = useState(samplePaymentMethods);

  const renderPaymentMethod = ({ item }) => (
    <View style={styles.paymentMethodContainer}>
      <Text style={styles.methodText}>{item.method}</Text>
      <Text style={styles.detailsText}>**** **** **** {item.last4}</Text>
      <Text style={styles.detailsText}>{item.type}</Text>
    </View>
  );

  const addPaymentMethod = () => {
    // Logic to add new payment method (e.g., navigating to another screen)
    console.log('Add new payment method');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Methods</Text>
      <FlatList
        data={paymentMethods}
        renderItem={renderPaymentMethod}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No payment methods added</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={addPaymentMethod}>
        <Text style={styles.addButtonText}>+ Add Payment Method</Text>
      </TouchableOpacity>
      <View style={styles.transactionSummaryContainer}>
        <Text style={styles.transactionSummaryTitle}>Recent Transactions</Text>
        <Text style={styles.transactionSummaryText}>You have no recent transactions.</Text>
      </View>
    </View>
  );
};

export default PaymentDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paymentMethodContainer: {
    padding: 12,
    marginVertical: 4,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  methodText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsText: {
    fontSize: 14,
    color: '#888',
  },
  addButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#FF5733',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionSummaryContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  transactionSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionSummaryText: {
    fontSize: 14,
    color: '#888',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});
