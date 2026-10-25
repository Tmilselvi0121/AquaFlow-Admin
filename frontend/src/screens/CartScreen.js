import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function CartScreen({
  theme,
  styles,
  cart,
  cartCount,
  cartTotal,
  userRole,
  changeQuantity,
  removeFromCart,
  setScreen,
}) {
  return (
    <ScrollView contentContainerStyle={[styles.page, { backgroundColor: theme.bg }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
      </Text>

      {userRole === 'Dealer' && (
        <View style={[styles.dealerBadge, { alignSelf: 'flex-start', marginBottom: 10 }]}>
          <Text style={styles.dealerBadgeText}>DEALER WHOLESALE ORDER APPLIED</Text>
        </View>
      )}

      {cart.length === 0 ? (
        <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Text style={[styles.infoText, { color: theme.subText }]}>Your cart is currently empty.</Text>
          <Pressable
            style={styles.primaryButton}
            onPress={() => setScreen('products')}
          >
            <Text style={styles.primaryButtonText}>Browse Products</Text>
          </Pressable>
        </View>
      ) : (
        <>
          {cart.map((item, index) => (
            <View
              key={item.id || index}
              style={[styles.cartItem, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            >
              <View style={styles.cartItemInfo}>
                <Text style={[styles.productName, { color: theme.text }]}>{item.name}</Text>
                <Text style={styles.price}>
                  ₹{Number(item.price || 0).toLocaleString('en-IN')}
                  {item.isWholesale && (
                    <Text style={{ fontSize: 12, color: '#059669' }}> (Wholesale)</Text>
                  )}
                </Text>
                <Text style={[styles.infoText, { color: theme.subText }]}>
                  Subtotal: ₹{(Number(item.price || 0) * item.quantity).toLocaleString('en-IN')}
                </Text>

                <Pressable onPress={() => removeFromCart(item.id)} style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </Pressable>
              </View>

              <View style={styles.quantityControls}>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => changeQuantity(item.id, -1)}
                >
                  <Text style={styles.quantityText}>−</Text>
                </Pressable>

                <Text style={[styles.quantityText, { color: theme.text }]}>{item.quantity}</Text>

                <Pressable
                  style={styles.quantityButton}
                  onPress={() => changeQuantity(item.id, 1)}
                >
                  <Text style={styles.quantityText}>+</Text>
                </Pressable>
              </View>
            </View>
          ))}

          <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <View style={styles.rowBetween}>
              <Text style={[styles.infoText, { color: theme.subText }]}>Subtotal</Text>
              <Text style={[styles.infoText, { color: theme.text, fontWeight: 'bold' }]}>
                ₹{cartTotal.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={[styles.infoText, { color: theme.subText }]}>Shipping</Text>
              <Text style={{ color: '#059669', fontWeight: 'bold' }}>FREE Delivery</Text>
            </View>
            <View style={[styles.orderDivider, { borderColor: theme.border }]} />
            <View style={styles.rowBetween}>
              <Text style={[styles.total, { color: theme.text }]}>Grand Total</Text>
              <Text style={[styles.total, { color: theme.primary }]}>
                ₹{cartTotal.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.primaryButton}
            onPress={() => setScreen('checkout')}
          >
            <Text style={styles.primaryButtonText}>Proceed to Checkout →</Text>
          </Pressable>

          <Pressable
            style={[styles.secondaryButton, { marginTop: 10 }]}
            onPress={() => setScreen('products')}
          >
            <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}
