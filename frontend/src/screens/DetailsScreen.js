import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function DetailsScreen({
  theme,
  styles,
  selectedProduct,
  getEffectivePrice,
  userRole,
  renderImage,
  addToCart,
  setScreen,
}) {
  if (!selectedProduct) {
    return (
      <View style={[styles.page, { backgroundColor: theme.bg }]}>
        <Text style={[styles.infoText, { color: theme.subText }]}>Please select a product.</Text>
      </View>
    );
  }

  const effectivePrice = getEffectivePrice(selectedProduct);
  const isWholesale = userRole === 'Dealer';

  return (
    <ScrollView contentContainerStyle={[styles.page, { backgroundColor: theme.bg }]}>
      {renderImage(selectedProduct, true)}

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{selectedProduct.name}</Text>

      <Text style={styles.category}>{selectedProduct.category}</Text>

      <View style={styles.priceRow}>
        <Text style={[styles.price, { fontSize: 26 }]}>
          ₹{effectivePrice.toLocaleString('en-IN')}
        </Text>

        {isWholesale && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={[styles.retailStrikethrough, { fontSize: 18 }]}>
              ₹{Number(selectedProduct.price).toLocaleString('en-IN')}
            </Text>
            <View style={styles.wholesaleBadge}>
              <Text style={styles.wholesaleBadgeText}>DEALER WHOLESALE (25% OFF)</Text>
            </View>
          </View>
        )}
      </View>

      <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.border, marginTop: 12 }]}>
        <Text style={[styles.infoTitle, { color: theme.text }]}>Product Overview</Text>
        <Text style={[styles.description, { color: theme.subText }]}>
          {selectedProduct.description || 'Certified AquaFlow drinking water system and component.'}
        </Text>
        <Text style={[styles.stock, { color: theme.subText, marginTop: 6 }]}>
          Available Warehouse Stock: {selectedProduct.stock ?? 25} units
        </Text>
      </View>

      {/* Dealer Bulk Ordering Options */}
      {isWholesale && (
        <View style={[styles.infoCard, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
          <Text style={[styles.infoTitle, { color: '#1E40AF' }]}>📦 Quick Bulk Ordering</Text>
          <Text style={{ fontSize: 13, color: '#3B82F6', marginBottom: 10 }}>
            Order carton packs at wholesale pricing:
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[5, 10, 25].map((qty) => (
              <Pressable
                key={qty}
                style={[styles.quantityButton, { flex: 1, height: 40, backgroundColor: '#DBEAFE' }]}
                onPress={() => addToCart(selectedProduct, qty)}
              >
                <Text style={{ fontWeight: 'bold', color: '#1E40AF' }}>+{qty} Units</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <Pressable
        style={styles.primaryButton}
        onPress={() => {
          addToCart(selectedProduct, 1);
          setScreen('cart');
        }}
      >
        <Text style={styles.primaryButtonText}>Add to Cart & View Basket</Text>
      </Pressable>

      <Pressable
        style={[styles.secondaryButton, { marginTop: 10 }]}
        onPress={() => setScreen('products')}
      >
        <Text style={styles.secondaryButtonText}>← Back to Products</Text>
      </Pressable>
    </ScrollView>
  );
}
