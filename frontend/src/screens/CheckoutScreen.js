import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function CheckoutScreen({
  theme,
  styles,
  userRole,
  customerName,
  setCustomerName,
  phone,
  setPhone,
  address,
  setAddress,
  setOsmModalVisible,
  paymentMethod,
  setPaymentMethod,
  cart,
  cartTotal,
  placeOrder,
  orderSubmitting,
  setScreen,
}) {
  return (
    <ScrollView contentContainerStyle={[styles.page, { backgroundColor: theme.bg }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Checkout</Text>

      <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <Text style={[styles.infoTitle, { color: theme.text }]}>
          {userRole === 'Dealer' ? 'Dealer Delivery Details' : 'Delivery Information'}
        </Text>

        <Text style={[styles.inputLabel, { color: theme.subText }]}>Full Name</Text>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          placeholder="Enter recipient full name"
          placeholderTextColor={theme.subText}
          value={customerName}
          onChangeText={setCustomerName}
        />

        <Text style={[styles.inputLabel, { color: theme.subText }]}>10-Digit Mobile Phone</Text>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          placeholder="Enter 10-digit mobile number"
          placeholderTextColor={theme.subText}
          value={phone}
          onChangeText={(val) => setPhone(val.replace(/[^0-9]/g, '').slice(0, 10))}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <View style={styles.rowBetween}>
          <Text style={[styles.inputLabel, { color: theme.subText }]}>Delivery Address</Text>
          <Pressable onPress={() => setOsmModalVisible(true)}>
            <Text style={{ color: '#0284C7', fontWeight: 'bold', fontSize: 13 }}>
              📍 OpenStreetMap Address Finder
            </Text>
          </Pressable>
        </View>

        <TextInput
          style={[styles.input, styles.addressInput, { color: theme.text, borderColor: theme.border }]}
          placeholder="House/Plot No, Street, City, Pincode"
          placeholderTextColor={theme.subText}
          value={address}
          onChangeText={setAddress}
          multiline
        />
      </View>

      {/* Payment Method Selection */}
      <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <Text style={[styles.infoTitle, { color: theme.text }]}>Payment Option</Text>

        {/* COD */}
        <Pressable
          style={[
            styles.paymentOption,
            paymentMethod === 'COD' && styles.selectedPaymentOption,
          ]}
          onPress={() => setPaymentMethod('COD')}
        >
          <Text style={{ fontSize: 20, marginRight: 10 }}>💵</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.paymentTitle, { color: theme.text }]}>
              Cash on Delivery (COD)
            </Text>
            <Text style={[styles.paymentDesc, { color: theme.subText }]}>
              Pay upon safe arrival and installation
            </Text>
          </View>
          <Text style={{ fontSize: 18 }}>{paymentMethod === 'COD' ? '🔘' : '⚪'}</Text>
        </Pressable>

        {/* Razorpay Test Mode */}
        <Pressable
          style={[
            styles.paymentOption,
            paymentMethod === 'Razorpay' && styles.selectedPaymentOption,
            { marginTop: 10 },
          ]}
          onPress={() => setPaymentMethod('Razorpay')}
        >
          <Text style={{ fontSize: 20, marginRight: 10 }}>💳</Text>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[styles.paymentTitle, { color: theme.text }]}>
                Razorpay Payment
              </Text>
              <View style={styles.testBadge}>
                <Text style={styles.testBadgeText}>TEST MODE</Text>
              </View>
            </View>
            <Text style={[styles.paymentDesc, { color: theme.subText }]}>
              Simulate UPI, Card, or NetBanking test payment
            </Text>
          </View>
          <Text style={{ fontSize: 18 }}>{paymentMethod === 'Razorpay' ? '🔘' : '⚪'}</Text>
        </Pressable>
      </View>

      {/* Order Summary */}
      <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <Text style={[styles.infoTitle, { color: theme.text }]}>Order Summary</Text>
        {cart.map((item, index) => (
          <Text key={item.id || index} style={[styles.infoText, { color: theme.subText }]}>
            {item.name} × {item.quantity} = ₹
            {(Number(item.price || 0) * item.quantity).toLocaleString('en-IN')}
          </Text>
        ))}
        <View style={[styles.orderDivider, { borderColor: theme.border }]} />
        <Text style={[styles.total, { color: theme.primary }]}>
          Total: ₹{cartTotal.toLocaleString('en-IN')}
        </Text>
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={placeOrder}
        disabled={orderSubmitting}
      >
        {orderSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.primaryButtonText}>
            {paymentMethod === 'Razorpay' ? 'Launch Razorpay Test Pay →' : 'Confirm Order (COD) →'}
          </Text>
        )}
      </Pressable>

      <Pressable
        style={[styles.secondaryButton, { marginTop: 10 }]}
        onPress={() => setScreen('cart')}
      >
        <Text style={styles.secondaryButtonText}>Back to Cart</Text>
      </Pressable>
    </ScrollView>
  );
}
