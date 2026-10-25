import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function HomeScreen({
  theme,
  styles,
  userRole,
  setScreen,
  setSelectedCategory,
  setIsRegisteringDealer,
  setDealerModalVisible,
}) {
  return (
    <ScrollView contentContainerStyle={[styles.page, { backgroundColor: theme.bg }]}>
      {/* Dealer Wholesale Notice Banner */}
      {userRole === 'Dealer' ? (
        <View style={styles.dealerBanner}>
          <Text style={styles.dealerBannerTitle}>🌟 Dealer Wholesale Mode Active</Text>
          <Text style={styles.dealerBannerText}>
            You receive flat 25% wholesale pricing on purifiers, pumps, filters, and spare parts.
          </Text>
        </View>
      ) : null}

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Pure Water, Healthy Life</Text>
        <Text style={styles.heroSubtitle}>
          Certified RO, UV, & UF Water Purifiers, Dispensers, Pumps, and Genuine Spares.
        </Text>

        <View style={styles.heroActions}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => setScreen('products')}
          >
            <Text style={styles.primaryButtonText}>Explore 50+ Products</Text>
          </Pressable>

          <Pressable
            style={[styles.secondaryButton, { marginTop: 8 }]}
            onPress={() => setScreen('service')}
          >
            <Text style={styles.secondaryButtonText}>🛠️ Book a Service</Text>
          </Pressable>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured Categories</Text>

      <View style={styles.categoryGrid}>
        {[
          ['RO Purifiers', 'RO Purifier', '💧'],
          ['Dispensers', 'Dispenser', '🚰'],
          ['Filters', 'Filter', '🧪'],
          ['Pumps & Spares', 'Pump', '⚙️'],
        ].map(([title, cat, emoji]) => (
          <Pressable
            key={cat}
            style={[styles.categoryCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            onPress={() => {
              setSelectedCategory(cat);
              setScreen('products');
            }}
          >
            <Text style={{ fontSize: 28, marginBottom: 6 }}>{emoji}</Text>
            <Text style={[styles.infoTitle, { color: theme.text }]}>{title}</Text>
            <Text style={[styles.infoText, { color: theme.subText }]}>View items →</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 12 }]}>
        Why Choose AquaFlow?
      </Text>

      <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <Text style={[styles.infoTitle, { color: theme.text }]}>💧 100% Genuine Certified Spares</Text>
        <Text style={[styles.infoText, { color: theme.subText }]}>
          High rejection 75/100 GPD membranes, food grade tubing, and copper enriched filters.
        </Text>
      </View>

      <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <Text style={[styles.infoTitle, { color: theme.text }]}>⚡ 24-Hour Doorstep Service</Text>
        <Text style={[styles.infoText, { color: theme.subText }]}>
          Professional technicians for installation, routine maintenance, and membrane replacement.
        </Text>
      </View>

      {userRole !== 'Dealer' && (
        <Pressable
          style={[styles.secondaryButton, { borderColor: '#D97706', marginBottom: 16 }]}
          onPress={() => {
            setIsRegisteringDealer(false);
            setDealerModalVisible(true);
          }}
        >
          <Text style={{ color: '#D97706', fontWeight: 'bold' }}>
            💼 Are you a water purifier dealer? Access Wholesale Pricing →
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
