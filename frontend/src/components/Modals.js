import React from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

export function OpenStreetMapModal({
  visible,
  onClose,
  theme,
  styles,
  osmSearchCity,
  setOsmSearchCity,
  selectOsmLocation,
}) {
  const popularLocations = [
    { name: 'Bangalore Electronic City', lat: '12.8399', lon: '77.6770' },
    { name: 'Mumbai Andheri West', lat: '19.1363', lon: '72.8277' },
    { name: 'Delhi Connaught Place', lat: '28.6315', lon: '77.2167' },
    { name: 'Chennai Anna Nagar', lat: '13.0850', lon: '80.2101' },
    { name: 'Hyderabad HITEC City', lat: '17.4435', lon: '78.3772' },
    { name: 'Pune Kothrud', lat: '18.5074', lon: '73.8077' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            🗺️ OpenStreetMap Address Finder
          </Text>
          <Text style={[styles.infoText, { color: theme.subText }]}>
            Select your delivery locality or coordinates using free OpenStreetMap geodata:
          </Text>

          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            placeholder="Filter cities..."
            placeholderTextColor={theme.subText}
            value={osmSearchCity}
            onChangeText={setOsmSearchCity}
          />

          <ScrollView style={{ maxHeight: 220 }}>
            {popularLocations
              .filter((l) =>
                l.name.toLowerCase().includes(osmSearchCity.toLowerCase())
              )
              .map((loc, idx) => (
                <Pressable
                  key={idx}
                  style={[styles.osmItem, { borderColor: theme.border }]}
                  onPress={() => selectOsmLocation(loc.name, loc.lat, loc.lon)}
                >
                  <Text style={{ fontWeight: 'bold', color: theme.text }}>{loc.name}</Text>
                  <Text style={{ fontSize: 12, color: theme.subText }}>
                    Lat: {loc.lat}, Lon: {loc.lon}
                  </Text>
                </Pressable>
              ))}
          </ScrollView>

          <Pressable
            style={[styles.secondaryButton, { marginTop: 12 }]}
            onPress={onClose}
          >
            <Text style={styles.secondaryButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export function RazorpayModal({
  visible,
  onClose,
  cartTotal,
  styles,
  onCompletePayment,
}) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: '#FFFFFF' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Text style={{ fontSize: 24 }}>💳</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#0C2340' }}>
              Razorpay Checkout (Test Mode)
            </Text>
          </View>

          <View style={styles.testBadge}>
            <Text style={styles.testBadgeText}>
              TEST CREDENTIALS • KEY: rzp_test_aquaFlow2026
            </Text>
          </View>

          <Text style={{ fontSize: 14, color: '#334155', marginVertical: 12 }}>
            Simulate payment for AquaFlow Order. No real card will be charged.
          </Text>

          <View style={[styles.infoCard, { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }]}>
            <Text style={{ color: '#64748B', fontSize: 13 }}>Payable Amount:</Text>
            <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#0F172A' }}>
              ₹{cartTotal.toLocaleString('en-IN')}
            </Text>
            <Text style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
              Beneficiary: AquaFlow Purifiers Ltd (Test)
            </Text>
          </View>

          <Pressable
            style={[styles.primaryButton, { backgroundColor: '#0284C7' }]}
            onPress={onCompletePayment}
          >
            <Text style={styles.primaryButtonText}>
              ✓ Complete Test Payment (₹{cartTotal.toLocaleString('en-IN')})
            </Text>
          </Pressable>

          <Pressable
            style={[styles.secondaryButton, { marginTop: 10 }]}
            onPress={onClose}
          >
            <Text style={styles.secondaryButtonText}>Cancel & Choose COD</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export function DealerAuthModal({
  visible,
  onClose,
  theme,
  styles,
  isRegisteringDealer,
  setIsRegisteringDealer,
  dealerBusinessInput,
  setDealerBusinessInput,
  dealerContactInput,
  setDealerContactInput,
  dealerGstInput,
  setDealerGstInput,
  dealerPhoneInput,
  setDealerPhoneInput,
  handleDealerAuth,
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {isRegisteringDealer ? '💼 Dealer Partner Registration' : '💼 Dealer Partner Login'}
          </Text>

          <Text style={[styles.infoText, { color: theme.subText, marginBottom: 10 }]}>
            {isRegisteringDealer
              ? 'Register your water purification business to receive 25% wholesale pricing.'
              : 'Enter your 10-digit registered phone number to unlock wholesale pricing.'}
          </Text>

          {isRegisteringDealer && (
            <>
              <Text style={[styles.inputLabel, { color: theme.subText }]}>Business / Enterprise Name</Text>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                placeholder="e.g. Apex Water Solutions"
                placeholderTextColor={theme.subText}
                value={dealerBusinessInput}
                onChangeText={setDealerBusinessInput}
              />

              <Text style={[styles.inputLabel, { color: theme.subText }]}>Contact Person Name</Text>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                placeholder="e.g. Rajesh Kumar"
                placeholderTextColor={theme.subText}
                value={dealerContactInput}
                onChangeText={setDealerContactInput}
              />

              <Text style={[styles.inputLabel, { color: theme.subText }]}>GST / Registration Number (Optional)</Text>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                placeholder="e.g. 29ABCDE1234F1Z5"
                placeholderTextColor={theme.subText}
                value={dealerGstInput}
                onChangeText={setDealerGstInput}
              />
            </>
          )}

          <Text style={[styles.inputLabel, { color: theme.subText }]}>Dealer Phone Number</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            placeholder="10-digit phone number"
            placeholderTextColor={theme.subText}
            value={dealerPhoneInput}
            onChangeText={(val) => setDealerPhoneInput(val.replace(/[^0-9]/g, '').slice(0, 10))}
            keyboardType="phone-pad"
            maxLength={10}
          />

          <Pressable style={styles.primaryButton} onPress={handleDealerAuth}>
            <Text style={styles.primaryButtonText}>
              {isRegisteringDealer ? 'Submit Application' : 'Authenticate Dealer'}
            </Text>
          </Pressable>

          <Pressable
            style={{ marginTop: 12, alignItems: 'center' }}
            onPress={() => setIsRegisteringDealer(!isRegisteringDealer)}
          >
            <Text style={{ color: '#0284C7', fontWeight: 'bold' }}>
              {isRegisteringDealer
                ? 'Already registered? Login here →'
                : 'New partner? Apply for dealership →'}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.secondaryButton, { marginTop: 10 }]}
            onPress={onClose}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export function ZoomModal({ zoomedImage, onClose, styles }) {
  return (
    <Modal visible={!!zoomedImage} animationType="fade" transparent>
      <View style={styles.zoomOverlay}>
        <Pressable style={styles.zoomClose} onPress={onClose}>
          <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' }}>✕</Text>
        </Pressable>

        {zoomedImage && typeof zoomedImage === 'number' ? (
          <Image source={zoomedImage} style={styles.zoomedImage} resizeMode="contain" />
        ) : zoomedImage ? (
          <Image source={{ uri: zoomedImage }} style={styles.zoomedImage} resizeMode="contain" />
        ) : null}
      </View>
    </Modal>
  );
}
