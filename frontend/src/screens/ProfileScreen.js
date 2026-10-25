import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

export default function ProfileScreen({
  theme,
  styles,
  currentUser,
  userRole,
  onLogout,
  onOpenAuth,
  savedAddresses,
  pushEnabled,
  setPushEnabled,
  setScreen,
}) {
  return (
    <ScrollView contentContainerStyle={[styles.page, { backgroundColor: theme.bg }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>My Profile</Text>

      {/* User Info Card */}
      <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 32 }}>{userRole === 'Dealer' ? '💼' : '👤'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoTitle, { color: theme.text, fontSize: 18 }]}>
              {currentUser?.name || (userRole === 'Dealer' ? 'AquaFlow Dealer Partner' : 'AquaFlow Customer')}
            </Text>
            <Text style={[styles.infoText, { color: theme.subText }]}>
              {currentUser?.email || (userRole === 'Dealer' ? 'dealer@aquaflow.com' : 'customer@aquaflow.com')}
            </Text>
            <Text style={[styles.infoText, { color: theme.subText }]}>
              📱 +91 {currentUser?.phone || '9876543210'}
            </Text>

            <View
              style={[
                styles.statusPill,
                {
                  alignSelf: 'flex-start',
                  backgroundColor: userRole === 'Dealer' ? '#DBEAFE' : '#E0F2FE',
                  marginTop: 4,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: userRole === 'Dealer' ? '#1D4ED8' : '#0369A1',
                }}
              >
                Role: {userRole === 'Dealer' ? 'Verified Dealer (Wholesale Active)' : 'Retail Customer'}
              </Text>
            </View>
          </View>
        </View>

        {currentUser ? (
          <Pressable
            style={[styles.secondaryButton, { borderColor: '#EF4444', marginTop: 14 }]}
            onPress={onLogout}
          >
            <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>Sign Out</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.primaryButton, { marginTop: 14 }]}
            onPress={onOpenAuth}
          >
            <Text style={styles.primaryButtonText}>Sign In / Register Account</Text>
          </Pressable>
        )}
      </View>

      {/* Dealer Wholesale Program Status */}
      <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <Text style={[styles.infoTitle, { color: theme.text }]}>💼 Dealer Wholesale Program</Text>
        <Text style={[styles.infoText, { color: theme.subText }]}>
          Authorized water purifier dealers enjoy 25% lower wholesale pricing and bulk packaging.
        </Text>

        {userRole === 'Dealer' ? (
          <View style={{ marginTop: 8 }}>
            <View style={[styles.dealerBanner, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
              <Text style={[styles.dealerBannerTitle, { color: '#065F46' }]}>
                ✓ Active Dealer Status: Verified & Approved
              </Text>
              <Text style={[styles.dealerBannerText, { color: '#047857' }]}>
                Wholesale discounts (25% off) and bulk order packs are automatically applied.
              </Text>
            </View>

            <Pressable
              style={[styles.secondaryButton, { borderColor: '#0284C7' }]}
              onPress={() => setScreen('products')}
            >
              <Text style={{ color: '#0284C7', fontWeight: 'bold' }}>
                Browse Wholesale Products →
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={[styles.primaryButton, { backgroundColor: '#0284C7', marginTop: 10 }]}
            onPress={onOpenAuth}
          >
            <Text style={styles.primaryButtonText}>
              Switch to Dealer Wholesale Mode →
            </Text>
          </Pressable>
        )}
      </View>

      {/* Saved Addresses */}
      <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <Text style={[styles.infoTitle, { color: theme.text }]}>📍 Saved Delivery Addresses</Text>
        {savedAddresses.map((addr, idx) => (
          <View key={idx} style={{ paddingVertical: 6 }}>
            <Text style={[styles.infoText, { color: theme.text, fontWeight: '500' }]}>
              {idx === 0 ? 'Home (Default)' : 'Secondary / Office'}:
            </Text>
            <Text style={[styles.infoText, { color: theme.subText }]}>{addr}</Text>
          </View>
        ))}
      </View>

      {/* Push Notification Controls */}
      <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={[styles.infoTitle, { color: theme.text }]}>🔔 Push Notifications</Text>
            <Text style={[styles.infoText, { color: theme.subText }]}>
              Order status updates & service alerts
            </Text>
          </View>
          <Pressable
            style={[styles.statusPill, { backgroundColor: pushEnabled ? '#D1FAE5' : '#F1F5F9' }]}
            onPress={() => {
              setPushEnabled(!pushEnabled);
              Alert.alert(
                'Notifications',
                !pushEnabled ? 'Push notifications enabled.' : 'Push notifications disabled.'
              );
            }}
          >
            <Text style={{ fontWeight: 'bold', color: pushEnabled ? '#065F46' : '#64748B' }}>
              {pushEnabled ? 'ACTIVE ✓' : 'MUTED'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Referral System Bonus */}
      <View style={[styles.infoCard, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
        <Text style={[styles.infoTitle, { color: '#166534' }]}>🎁 AquaFlow Referral Bonus</Text>
        <Text style={{ fontSize: 13, color: '#15803D' }}>
          Share your referral code with friends to get ₹250 wallet credit on their first order!
        </Text>
        <View style={styles.referralBox}>
          <Text style={styles.referralCode}>AQUA-FLOW-50</Text>
        </View>
      </View>

      {/* Customer Support */}
      <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <Text style={[styles.infoTitle, { color: theme.text }]}>📞 Customer Support & Helpdesk</Text>
        <Text style={[styles.infoText, { color: theme.subText }]}>
          Toll-Free Helpline: 1800-419-AQUA (2782)
        </Text>
        <Text style={[styles.infoText, { color: theme.subText }]}>
          Email: support@aquaflowwater.com
        </Text>
        <Text style={[styles.infoText, { color: theme.subText }]}>
          Hours: Monday – Saturday, 9:00 AM – 8:00 PM
        </Text>
      </View>
    </ScrollView>
  );
}
