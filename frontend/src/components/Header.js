import React from 'react';
import { Pressable, Text, View } from 'react-native';

export default function Header({
  theme,
  styles,
  setScreen,
  cartCount,
  userRole,
  darkMode,
  setDarkMode,
  currentUser,
  onOpenAuth,
}) {
  return (
    <View style={[styles.header, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
      <Pressable onPress={() => setScreen('home')}>
        <Text style={styles.logo}>💧 AquaFlow</Text>
      </Pressable>

      <View style={styles.headerRight}>
        {/* Role / Auth Status Indicator */}
        {userRole === 'Dealer' ? (
          <Pressable onPress={() => setScreen('profile')}>
            <View style={styles.dealerBadge}>
              <Text style={styles.dealerBadgeText}>DEALER (25% OFF)</Text>
            </View>
          </Pressable>
        ) : currentUser ? (
          <Pressable onPress={() => setScreen('profile')}>
            <View style={[styles.statusPill, { backgroundColor: theme.primaryLight }]}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: theme.primary }}>
                👤 {currentUser.name ? currentUser.name.split(' ')[0] : 'Customer'}
              </Text>
            </View>
          </Pressable>
        ) : (
          <Pressable onPress={onOpenAuth}>
            <View style={[styles.statusPill, { backgroundColor: theme.primaryLight }]}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: theme.primary }}>
                Sign In
              </Text>
            </View>
          </Pressable>
        )}

        {/* Dark Mode Toggle */}
        <Pressable
          style={[styles.iconButton, { backgroundColor: theme.primaryLight }]}
          onPress={() => setDarkMode(!darkMode)}
        >
          <Text style={{ fontSize: 16 }}>{darkMode ? '☀️' : '🌙'}</Text>
        </Pressable>

        {/* Cart Button */}
        <Pressable
          style={[styles.cartButton, { backgroundColor: theme.primaryLight }]}
          onPress={() => setScreen('cart')}
        >
          <Text style={styles.cartButtonText}>🛒 ({cartCount})</Text>
        </Pressable>
      </View>
    </View>
  );
}
