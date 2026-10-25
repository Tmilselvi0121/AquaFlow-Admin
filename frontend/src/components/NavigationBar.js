import React from 'react';
import { Pressable, Text, View } from 'react-native';

export default function NavigationBar({
  theme,
  styles,
  screen,
  setScreen,
  cartCount,
}) {
  const navItems = [
    ['home', 'Home', '🏠'],
    ['products', 'Products', '💧'],
    ['service', 'Service', '🛠️'],
    ['cart', `Cart (${cartCount})`, '🛒'],
    ['history', 'Orders', '📋'],
    ['profile', 'Profile', '👤'],
  ];

  return (
    <View style={[styles.navigation, { backgroundColor: theme.cardBg }]}>
      {navItems.map(([target, label, icon]) => (
        <Pressable
          key={target}
          onPress={() => setScreen(target)}
          style={[
            styles.navItem,
            screen === target && styles.activeNavItem,
          ]}
        >
          <Text style={{ fontSize: 15 }}>{icon}</Text>
          <Text
            style={[
              styles.navText,
              { color: theme.subText },
              screen === target && [styles.activeNavText, { color: theme.primary }],
            ]}
          >
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
