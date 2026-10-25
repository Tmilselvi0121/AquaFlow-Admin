import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function AuthScreen({
  theme,
  styles,
  onLoginSuccess,
  onClose,
  DEFAULT_API_URL,
}) {
  const [authRole, setAuthRole] = useState('Customer'); // 'Customer' or 'Dealer'
  const [isRegistering, setIsRegistering] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Customer Form Fields
  const [customerPhoneOrEmail, setCustomerPhoneOrEmail] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Dealer Form Fields
  const [dealerPhone, setDealerPhone] = useState('');
  const [dealerPassword, setDealerPassword] = useState('');
  const [dealerBusinessName, setDealerBusinessName] = useState('');
  const [dealerContactPerson, setDealerContactPerson] = useState('');
  const [dealerGst, setDealerGst] = useState('');
  const [dealerAddress, setDealerAddress] = useState('');

  // 1. Submit Customer Login / Registration
  async function handleCustomerAuth() {
    if (isRegistering) {
      if (!customerName.trim() || !customerPhoneOrEmail.trim() || !customerPassword.trim()) {
        Alert.alert('Required', 'Please fill in your name, 10-digit phone, and password.');
        return;
      }

      setSubmitting(true);
      try {
        const res = await fetch(`${DEFAULT_API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: customerName.trim(),
            phone: customerPhoneOrEmail.trim(),
            email: customerPhoneOrEmail.includes('@') ? customerPhoneOrEmail.trim() : '',
            password: customerPassword.trim(),
            address: customerAddress.trim(),
          }),
        }).catch(() => null);

        if (res && res.ok) {
          const data = await res.json();
          Alert.alert('Welcome!', 'Registration successful. Signed in as customer.');
          onLoginSuccess({
            ...data.user,
            role: 'Customer',
            token: data.token,
          });
        } else if (res) {
          // Server replied with an error — do not invent a customer session
          const data = await res.json().catch(() => ({}));
          Alert.alert('Registration Failed', data.error || 'Could not create customer account.');
        } else {
          Alert.alert(
            'Connection Error',
            'Cannot reach the server. Start the backend, or use Customer Demo for offline evaluation.'
          );
        }
      } catch (err) {
        Alert.alert('Connection Error', 'Customer registration requires the backend server.');
      } finally {
        setSubmitting(false);
      }
    } else {
      // Customer Login
      if (!customerPhoneOrEmail.trim() || !customerPassword.trim()) {
        Alert.alert('Required', 'Please enter your phone/email and password.');
        return;
      }

      setSubmitting(true);
      try {
        const res = await fetch(`${DEFAULT_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneOrEmail: customerPhoneOrEmail.trim(),
            password: customerPassword.trim(),
          }),
        }).catch(() => null);

        if (res && res.ok) {
          const data = await res.json();
          Alert.alert('Signed In', `Welcome back, ${data.user.name}!`);
          onLoginSuccess({
            ...data.user,
            role: 'Customer',
            token: data.token,
          });
        } else if (res) {
          // Rejected by server — never promote user to Customer without verification
          const data = await res.json().catch(() => ({}));
          Alert.alert('Sign In Failed', data.error || 'Invalid customer credentials.');
        } else {
          Alert.alert(
            'Connection Error',
            'Cannot reach the server. Start the backend, or use Customer Demo for offline evaluation.'
          );
        }
      } catch (e) {
        Alert.alert('Connection Error', 'Customer login requires the backend server.');
      } finally {
        setSubmitting(false);
      }
    }
  }

  // 2. Submit Dealer Login / Application
  async function handleDealerAuth() {
    if (isRegistering) {
      // Dealer Registration Application
      if (!dealerBusinessName.trim() || !dealerContactPerson.trim() || !dealerPhone.trim()) {
        Alert.alert('Required', 'Please enter business name, contact person, and phone.');
        return;
      }

      setSubmitting(true);
      try {
        const res = await fetch(`${DEFAULT_API_URL}/api/dealers/apply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessName: dealerBusinessName.trim(),
            contactPerson: dealerContactPerson.trim(),
            phone: dealerPhone.trim(),
            gstNumber: dealerGst.trim(),
            address: dealerAddress.trim(),
            password: dealerPassword.trim() || 'dealer123',
          }),
        }).catch(() => null);

        if (res && res.ok) {
          Alert.alert(
            'Application Submitted',
            'Your dealer partner registration has been submitted for Admin approval. Wholesale access activates upon verification.',
            [{ text: 'OK', onPress: () => setIsRegistering(false) }]
          );
        } else if (res) {
          const data = await res.json().catch(() => ({}));
          Alert.alert('Application Failed', data.error || 'Could not submit dealer application.');
        } else {
          Alert.alert(
            'Connection Error',
            'Cannot reach the server. Start the backend to submit a real dealer application.'
          );
        }
      } catch (e) {
        Alert.alert('Connection Error', 'Dealer application requires the backend server.');
      } finally {
        setSubmitting(false);
      }
    } else {
      // Dealer Login
      if (!dealerPhone.trim()) {
        Alert.alert('Required', 'Please enter your registered dealer phone number.');
        return;
      }

      if (!dealerPassword.trim()) {
        Alert.alert('Required', 'Please enter your dealer password.');
        return;
      }

      setSubmitting(true);
      try {
        const res = await fetch(`${DEFAULT_API_URL}/api/dealers/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: dealerPhone.trim(),
            password: dealerPassword.trim(),
          }),
        }).catch(() => null);

        if (res && res.ok) {
          const data = await res.json();
          Alert.alert('Dealer Verified', `Welcome ${data.dealer.businessName}! Wholesale pricing (25% off) is active.`);
          onLoginSuccess({
            ...data.dealer,
            role: 'Dealer',
            name: data.dealer.businessName,
            token: data.token,
          });
        } else if (res) {
          // Pending / rejected / wrong password — never unlock wholesale locally
          const data = await res.json().catch(() => ({}));
          Alert.alert(
            'Dealer Access Denied',
            data.error || 'Only Admin-approved dealers can use wholesale pricing.'
          );
        } else {
          Alert.alert(
            'Connection Error',
            'Cannot reach the server. Start the backend, or use Dealer Demo for offline evaluation.'
          );
        }
      } catch (e) {
        Alert.alert('Connection Error', 'Dealer login requires the backend server.');
      } finally {
        setSubmitting(false);
      }
    }
  }

  // 1-Click Demo Logins
  function handleCustomerDemo() {
    onLoginSuccess({
      id: 'usr_demo_cust',
      name: 'John Doe',
      phone: '9876543210',
      email: 'customer@aquaflow.com',
      address: '124 Water Works Lane, Aqua City',
      role: 'Customer',
    });
    Alert.alert('Customer Access', 'Logged in as Customer (John Doe). Standard retail pricing.');
  }

  function handleDealerDemo() {
    onLoginSuccess({
      id: 'dlr_demo_approved',
      businessName: 'Apex Water Works & Dealership',
      contactPerson: 'Rajesh Kumar',
      phone: '9988776655',
      gstNumber: '29ABCDE1234F1Z5',
      role: 'Dealer',
      status: 'Approved',
    });
    Alert.alert('Dealer Wholesale Access', 'Logged in as Verified Dealer. Flat 25% wholesale pricing active.');
  }

  return (
    <ScrollView contentContainerStyle={[styles.page, { backgroundColor: theme.bg }]}>
      <View style={{ alignItems: 'center', marginVertical: 14 }}>
        <Text style={{ fontSize: 44 }}>💧</Text>
        <Text style={[styles.heroTitle, { textAlign: 'center', marginBottom: 4 }]}>
          AquaFlow Account
        </Text>
        <Text style={[styles.infoText, { textAlign: 'center', color: theme.subText }]}>
          Sign in to access your orders, services, or dealer wholesale pricing
        </Text>
      </View>

      {/* Role Selector Tabs (Customer vs Dealer) */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
        <Pressable
          style={[
            styles.categoryChip,
            { flex: 1, alignItems: 'center', backgroundColor: theme.cardBg, borderColor: theme.border },
            authRole === 'Customer' && styles.activeCategoryChip,
          ]}
          onPress={() => {
            setAuthRole('Customer');
            setIsRegistering(false);
          }}
        >
          <Text
            style={[
              styles.categoryChipText,
              { color: theme.subText },
              authRole === 'Customer' && styles.activeCategoryChipText,
            ]}
          >
            👤 Customer
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.categoryChip,
            { flex: 1, alignItems: 'center', backgroundColor: theme.cardBg, borderColor: theme.border },
            authRole === 'Dealer' && styles.activeCategoryChip,
          ]}
          onPress={() => {
            setAuthRole('Dealer');
            setIsRegistering(false);
          }}
        >
          <Text
            style={[
              styles.categoryChipText,
              { color: theme.subText },
              authRole === 'Dealer' && styles.activeCategoryChipText,
            ]}
          >
            💼 Dealer Wholesale
          </Text>
        </Pressable>
      </View>

      {/* CUSTOMER AUTHENTICATION VIEW */}
      {authRole === 'Customer' && (
        <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Text style={[styles.infoTitle, { color: theme.text, fontSize: 18 }]}>
            {isRegistering ? 'Create Customer Account' : 'Customer Sign In'}
          </Text>
          <Text style={[styles.infoText, { color: theme.subText }]}>
            {isRegistering
              ? 'Register to place water purifier orders and book maintenance.'
              : 'Sign in to access your order history and saved delivery addresses.'}
          </Text>

          {isRegistering && (
            <>
              <Text style={[styles.inputLabel, { color: theme.subText }]}>Full Name</Text>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                placeholder="e.g. John Doe"
                placeholderTextColor={theme.subText}
                value={customerName}
                onChangeText={setCustomerName}
              />
            </>
          )}

          <Text style={[styles.inputLabel, { color: theme.subText }]}>Mobile Number / Email</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            placeholder="10-digit phone or email"
            placeholderTextColor={theme.subText}
            value={customerPhoneOrEmail}
            onChangeText={setCustomerPhoneOrEmail}
            autoCapitalize="none"
          />

          <Text style={[styles.inputLabel, { color: theme.subText }]}>Password</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            placeholder="Enter password"
            placeholderTextColor={theme.subText}
            secureTextEntry
            value={customerPassword}
            onChangeText={setCustomerPassword}
          />

          {isRegistering && (
            <>
              <Text style={[styles.inputLabel, { color: theme.subText }]}>Delivery Address</Text>
              <TextInput
                style={[styles.input, styles.addressInput, { color: theme.text, borderColor: theme.border }]}
                placeholder="Delivery address"
                placeholderTextColor={theme.subText}
                value={customerAddress}
                onChangeText={setCustomerAddress}
                multiline
              />
            </>
          )}

          <Pressable
            style={[styles.primaryButton, { marginTop: 10 }]}
            onPress={handleCustomerAuth}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isRegistering ? 'Register as Customer' : 'Sign In'}
              </Text>
            )}
          </Pressable>

          <Pressable
            style={{ marginTop: 14, alignItems: 'center' }}
            onPress={() => setIsRegistering(!isRegistering)}
          >
            <Text style={{ color: '#087E8B', fontWeight: 'bold' }}>
              {isRegistering
                ? 'Already have an account? Sign In here →'
                : 'New to AquaFlow? Create an Account →'}
            </Text>
          </Pressable>
        </View>
      )}

      {/* DEALER WHOLESALE AUTHENTICATION VIEW */}
      {authRole === 'Dealer' && (
        <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <View style={[styles.dealerBadge, { alignSelf: 'flex-start', marginBottom: 8 }]}>
            <Text style={styles.dealerBadgeText}>DEALER PARTNER PORTAL</Text>
          </View>

          <Text style={[styles.infoTitle, { color: theme.text, fontSize: 18 }]}>
            {isRegistering ? 'Apply for Dealership' : 'Dealer Wholesale Sign In'}
          </Text>
          <Text style={[styles.infoText, { color: theme.subText }]}>
            {isRegistering
              ? 'Submit your water purifier business details for 25% wholesale pricing.'
              : 'Enter your 10-digit registered phone number to access wholesale pricing.'}
          </Text>

          {isRegistering && (
            <>
              <Text style={[styles.inputLabel, { color: theme.subText }]}>Business Name</Text>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                placeholder="e.g. Apex Water Solutions"
                placeholderTextColor={theme.subText}
                value={dealerBusinessName}
                onChangeText={setDealerBusinessName}
              />

              <Text style={[styles.inputLabel, { color: theme.subText }]}>Contact Person Name</Text>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                placeholder="e.g. Rajesh Kumar"
                placeholderTextColor={theme.subText}
                value={dealerContactPerson}
                onChangeText={setDealerContactPerson}
              />

              <Text style={[styles.inputLabel, { color: theme.subText }]}>GST / Tax ID</Text>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                placeholder="e.g. 29ABCDE1234F1Z5"
                placeholderTextColor={theme.subText}
                value={dealerGst}
                onChangeText={setDealerGst}
              />

              <Text style={[styles.inputLabel, { color: theme.subText }]}>Business Address</Text>
              <TextInput
                style={[styles.input, styles.addressInput, { color: theme.text, borderColor: theme.border }]}
                placeholder="Office or warehouse address"
                placeholderTextColor={theme.subText}
                value={dealerAddress}
                onChangeText={setDealerAddress}
                multiline
              />
            </>
          )}

          <Text style={[styles.inputLabel, { color: theme.subText }]}>Registered Dealer Phone</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            placeholder="10-digit registered phone"
            placeholderTextColor={theme.subText}
            value={dealerPhone}
            onChangeText={(val) => setDealerPhone(val.replace(/[^0-9]/g, '').slice(0, 10))}
            keyboardType="phone-pad"
            maxLength={10}
          />

          <Text style={[styles.inputLabel, { color: theme.subText }]}>Dealer PIN / Password</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            placeholder="Enter dealer passcode"
            placeholderTextColor={theme.subText}
            secureTextEntry
            value={dealerPassword}
            onChangeText={setDealerPassword}
          />

          <Pressable
            style={[styles.primaryButton, { backgroundColor: '#0284C7', marginTop: 10 }]}
            onPress={handleDealerAuth}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isRegistering ? 'Submit Dealership Application' : 'Authenticate Dealer'}
              </Text>
            )}
          </Pressable>

          <Pressable
            style={{ marginTop: 14, alignItems: 'center' }}
            onPress={() => setIsRegistering(!isRegistering)}
          >
            <Text style={{ color: '#0284C7', fontWeight: 'bold' }}>
              {isRegistering
                ? 'Already an approved dealer? Sign In →'
                : 'New partner? Apply for Dealership →'}
            </Text>
          </Pressable>
        </View>
      )}

      {/* QUICK 1-CLICK DEMO ACCESS BUTTONS */}
      <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <Text style={[styles.infoTitle, { color: theme.text, fontSize: 14 }]}>
          ⚡ Fast 1-Click Evaluation Logins
        </Text>
        <Text style={[styles.infoText, { color: theme.subText, fontSize: 12 }]}>
          Test role-based pricing and privileges instantly:
        </Text>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <Pressable
            style={[styles.secondaryButton, { flex: 1, marginTop: 0, paddingVertical: 10 }]}
            onPress={handleCustomerDemo}
          >
            <Text style={[styles.secondaryButtonText, { fontSize: 12 }]}>
              👤 Customer Demo
            </Text>
          </Pressable>

          <Pressable
            style={[styles.secondaryButton, { flex: 1, marginTop: 0, paddingVertical: 10, borderColor: '#0284C7' }]}
            onPress={handleDealerDemo}
          >
            <Text style={[styles.secondaryButtonText, { fontSize: 12, color: '#0284C7' }]}>
              💼 Dealer Demo
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Guest bypass only when parent provides onClose (login is required at app start) */}
      {typeof onClose === 'function' && (
        <Pressable
          style={[styles.secondaryButton, { borderColor: theme.border, marginTop: 4 }]}
          onPress={onClose}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.subText }]}>
            Continue as Guest Customer →
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
