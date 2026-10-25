import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function SuccessScreen({
  theme,
  styles,
  lastOrder,
  setLastOrder,
  setScreen,
}) {
  if (!lastOrder) {
    return (
      <View style={[styles.page, { backgroundColor: theme.bg }]}>
        <Text style={[styles.infoText, { color: theme.subText }]}>No order details available.</Text>
        <Pressable style={styles.primaryButton} onPress={() => setScreen('products')}>
          <Text style={styles.primaryButtonText}>Shop Products</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.page, { backgroundColor: theme.bg }]}>
      <View style={[styles.successCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <Text style={styles.successEmoji}>✓</Text>
        <Text style={styles.successTitle}>Order Placed Successfully!</Text>

        <Text style={[styles.infoText, { textAlign: 'center', color: theme.subText }]}>
          Thank you, {lastOrder.customerName}. Your order is confirmed.
        </Text>

        <View style={[styles.orderDivider, { borderColor: theme.border }]} />

        <Text style={[styles.infoTitle, { color: theme.text }]}>Order No: {lastOrder.orderNumber}</Text>
        <Text style={[styles.infoText, { color: theme.subText }]}>Date: {lastOrder.createdAt}</Text>
        <Text style={[styles.infoText, { color: theme.subText }]}>Phone: {lastOrder.phone}</Text>
        <Text style={[styles.infoText, { color: theme.subText }]}>
          Delivery Address: {lastOrder.address}
        </Text>
        <Text style={[styles.infoText, { color: theme.subText }]}>
          Payment Method: {lastOrder.paymentMethod} ({lastOrder.paymentStatus})
        </Text>

        <View style={[styles.orderDivider, { borderColor: theme.border }]} />

        <Text style={[styles.infoTitle, { color: theme.text }]}>Items Ordered:</Text>
        {(lastOrder.items || []).map((item, idx) => (
          <Text key={idx} style={[styles.infoText, { color: theme.subText }]}>
            {item.name} × {item.quantity} — ₹
            {(Number(item.price || 0) * item.quantity).toLocaleString('en-IN')}
          </Text>
        ))}

        <Text style={[styles.total, { color: theme.primary, marginTop: 10 }]}>
          Total Amount: ₹{Number(lastOrder.total || 0).toLocaleString('en-IN')}
        </Text>
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() => {
          setLastOrder(null);
          setScreen('products');
        }}
      >
        <Text style={styles.primaryButtonText}>Continue Shopping</Text>
      </Pressable>

      <Pressable
        style={[styles.secondaryButton, { marginTop: 10 }]}
        onPress={() => setScreen('history')}
      >
        <Text style={styles.secondaryButtonText}>View Order in History</Text>
      </Pressable>
    </ScrollView>
  );
}
