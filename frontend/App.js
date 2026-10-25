import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import styles from './styles/AppStyles';
import { defaultProductsCatalog, getProductImage } from './src/data/productCatalog';

// Reusable Components
import Header from './src/components/Header';
import NavigationBar from './src/components/NavigationBar';
import {
  OpenStreetMapModal,
  RazorpayModal,
  DealerAuthModal,
  ZoomModal,
} from './src/components/Modals';

// Modular Screens
import HomeScreen from './src/screens/HomeScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import ServiceBookingScreen from './src/screens/ServiceBookingScreen';
import OrderHistoryScreen from './src/screens/OrderHistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SuccessScreen from './src/screens/SuccessScreen';
import AuthScreen from './src/screens/AuthScreen';

// Backend API configuration with configurable host
const DEFAULT_API_URL = 'http://192.168.1.14:5000';

export default function App() {
  // Start on auth until the user logs in (was 'home' with a fake user — that skipped login)
  const [screen, setScreen] = useState('auth');
  const [products, setProducts] = useState(defaultProductsCatalog);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // null = not logged in → show AuthScreen first
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('Customer'); // 'Customer' or 'Dealer'
  const [dealerProfile, setDealerProfile] = useState(null);

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Customer Profile State
  const [customerName, setCustomerName] = useState('John Doe');
  const [phone, setPhone] = useState('9876543210');
  const [address, setAddress] = useState('124 Water Works Lane, Aqua City');
  const [email, setEmail] = useState('customer@aquaflow.com');
  const [savedAddresses, setSavedAddresses] = useState([
    '124 Water Works Lane, Aqua City',
    'Plot 42, River View Enclave, South Zone',
  ]);
  const [pushEnabled, setPushEnabled] = useState(true);

  // Checkout & Payment State
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'Razorpay'
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [razorpaySuccess, setRazorpaySuccess] = useState(false);
  const [orderSubmitting, setOrderSubmitting] = useState(false);

  // Location / OpenStreetMap State
  const [osmModalVisible, setOsmModalVisible] = useState(false);
  const [osmSearchCity, setOsmSearchCity] = useState('');
  const [osmCoordinates, setOsmCoordinates] = useState(null);

  // Orders State
  const [lastOrder, setLastOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [historyFilter, setHistoryFilter] = useState('all');

  // Service Booking State
  const [serviceCustomerName, setServiceCustomerName] = useState('John Doe');
  const [servicePhone, setServicePhone] = useState('9876543210');
  const [serviceAddress, setServiceAddress] = useState('124 Water Works Lane, Aqua City');
  const [serviceType, setServiceType] = useState('Maintenance');
  const [serviceDate, setServiceDate] = useState('2026-10-30');
  const [serviceSubmitting, setServiceSubmitting] = useState(false);
  const [serviceSuccessMsg, setServiceSuccessMsg] = useState('');

  // Image Lightbox / Zoom Bonus State
  const [zoomedImage, setZoomedImage] = useState(null);

  // Load products on launch
  useEffect(() => {
    fetchProducts();
  }, []);

  // Load orders when entering history screen
  useEffect(() => {
    if (screen === 'history') {
      fetchOrders();
    }
  }, [screen, userRole]);

  // Synchronize customer details when currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setCustomerName(currentUser.name);
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.address) setAddress(currentUser.address);
      if (currentUser.email) setEmail(currentUser.email);
    }
  }, [currentUser]);

  // Dynamic Theme Colors
  const theme = {
    bg: darkMode ? '#0F172A' : '#F4FAFC',
    cardBg: darkMode ? '#1E293B' : '#FFFFFF',
    text: darkMode ? '#F1F5F9' : '#123B4A',
    subText: darkMode ? '#94A3B8' : '#526875',
    border: darkMode ? '#334155' : '#E1EBEF',
    primary: '#087E8B',
    primaryLight: darkMode ? '#1E3A4C' : '#E0F2FE',
    accent: '#075985',
  };

  // Wholesale pricing: 25% discount for approved dealers
  function getEffectivePrice(product) {
    const base = Number(product.price || 0);
    if (userRole === 'Dealer') {
      return Math.round(base * 0.75);
    }
    return base;
  }

  async function fetchProducts() {
    try {
      setLoading(true);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`${DEFAULT_API_URL}/api/products`, {
        signal: controller.signal,
      }).catch(() => null);

      clearTimeout(timeoutId);

      if (response && response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          return;
        }
      }
      setProducts(defaultProductsCatalog);
    } catch (err) {
      setProducts(defaultProductsCatalog);
    } finally {
      setLoading(false);
    }
  }

  async function fetchOrders() {
    try {
      setOrdersLoading(true);
      setOrdersError('');

      // Customers only see their own phone's orders; dealers see dealerId orders; never fetch the full admin list
      const queryUrl =
        userRole === 'Dealer' && dealerProfile?.id
          ? `${DEFAULT_API_URL}/api/orders?dealerId=${dealerProfile.id}`
          : `${DEFAULT_API_URL}/api/orders?phone=${encodeURIComponent(phone || '')}`;

      const response = await fetch(queryUrl).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } else {
        setOrders([
          {
            id: 'mock_1',
            orderNumber: 'AF98432101',
            createdAt: new Date().toISOString(),
            status: 'Delivered',
            orderType: userRole === 'Dealer' ? 'Dealer' : 'Customer',
            customerName: customerName,
            phone: phone,
            address: address,
            paymentMethod: 'COD',
            items: [
              { name: 'AquaFlow RO Water Purifier', price: userRole === 'Dealer' ? 6749 : 8999, quantity: 1 },
              { name: 'AquaFlow Sediment Filter', price: userRole === 'Dealer' ? 224 : 299, quantity: 2 },
            ],
            total: userRole === 'Dealer' ? 7197 : 9597,
          },
        ]);
      }
    } catch (err) {
      setOrdersError('Could not load orders from server.');
    } finally {
      setOrdersLoading(false);
    }
  }

  // Authentication Handlers
  // Role comes from the login response (backend or explicit demo buttons)
  function handleLoginSuccess(user) {
    const role = String(user.role || 'Customer').toLowerCase();
    const isDealer = role === 'dealer';
    const isAdmin = role === 'admin';

    // Admin uses the separate web portal (admin/index.html), not this mobile app
    if (isAdmin) {
      Alert.alert(
        'Admin Portal',
        'Administrator access is available in the AquaFlow Admin web portal, not the customer/dealer app.'
      );
      return;
    }

    setCurrentUser(user);
    setUserRole(isDealer ? 'Dealer' : 'Customer');
    setDealerProfile(isDealer ? user : null);
    // Clear cart so retail and wholesale prices never mix after a role switch
    setCart([]);
    // Dealer → products (wholesale catalog); Customer → home
    setScreen(isDealer ? 'products' : 'home');
  }

  function handleLogout() {
    setCurrentUser(null);
    setUserRole('Customer');
    setDealerProfile(null);
    setCart([]);
    Alert.alert('Signed Out', 'You have been signed out.');
    setScreen('auth');
  }

  // Return to AuthScreen (e.g. switch Customer → Dealer) by clearing the session
  function openAuthScreen() {
    setCurrentUser(null);
    setUserRole('Customer');
    setDealerProfile(null);
    setScreen('auth');
  }

  // Cart operations
  function addToCart(product, quantityToAdd = 1) {
    const effectivePrice = getEffectivePrice(product);

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);

      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }

      return [
        ...prevCart,
        {
          ...product,
          price: effectivePrice,
          originalPrice: product.price,
          quantity: quantityToAdd,
          isWholesale: userRole === 'Dealer',
        },
      ];
    });

    Alert.alert(
      'Added to Cart',
      `${product.name} (x${quantityToAdd}) added at ₹${effectivePrice.toLocaleString('en-IN')}${
        userRole === 'Dealer' ? ' (Wholesale Price)' : ''
      }`
    );
  }

  function changeQuantity(productId, amount) {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId) {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce(
    (total, item) => total + Number(item.price || 0) * item.quantity,
    0
  );

  const categories = [
    'All',
    'RO Purifier',
    'UV Purifier',
    'UF Purifier',
    'Dispenser',
    'Filter',
    'Pump',
    'Spare Part',
    'Accessory',
    'Maintenance Kit',
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  function renderImage(product, large = false) {
    const imageSource = getProductImage(product);
    const imageStyle = large ? styles.detailImage : styles.productImage;

    return (
      <Pressable onPress={() => setZoomedImage(imageSource || product.imageUrl)}>
        {imageSource ? (
          <Image source={imageSource} style={imageStyle} resizeMode="contain" />
        ) : product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            style={imageStyle}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.placeholder, large && styles.largePlaceholder]}>
            <Text style={styles.placeholderEmoji}>💧</Text>
            <Text style={styles.placeholderText}>Image not available</Text>
          </View>
        )}
      </Pressable>
    );
  }

  function selectOsmLocation(cityName, lat, lon) {
    setAddress(`${cityName} — Lat: ${lat}, Lon: ${lon} (Verified via OpenStreetMap)`);
    setServiceAddress(`${cityName} — Lat: ${lat}, Lon: ${lon}`);
    setOsmCoordinates({ lat, lon, city: cityName });
    setOsmModalVisible(false);
    Alert.alert('Address Updated', `Selected: ${cityName} using OpenStreetMap geodata.`);
  }

  async function placeOrder() {
    if (cart.length === 0) {
      Alert.alert('Cart Empty', 'Please add products first.');
      setScreen('products');
      return;
    }

    if (!customerName.trim()) {
      Alert.alert('Required', 'Please enter your name.');
      return;
    }

    if (!/^[0-9]{10}$/.test(phone.trim())) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number.');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Required', 'Please enter your delivery address.');
      return;
    }

    if (paymentMethod === 'Razorpay' && !razorpaySuccess) {
      setIsRazorpayModalOpen(true);
      return;
    }

    setOrderSubmitting(true);

    const orderPayload = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      orderType: userRole === 'Dealer' ? 'Dealer' : 'Customer',
      dealerId: dealerProfile?.id || null,
      paymentMethod,
      paymentStatus: paymentMethod === 'Razorpay' ? 'Paid (Razorpay Test)' : 'Pending (COD)',
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
      })),
      total: cartTotal,
    };

    try {
      const response = await fetch(`${DEFAULT_API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      }).catch(() => null);

      let savedOrder = null;
      if (response && response.ok) {
        const data = await response.json();
        savedOrder = {
          ...data.order,
          id: data.id,
          createdAt: new Date(data.order.createdAt).toLocaleString(),
        };
      } else {
        savedOrder = {
          ...orderPayload,
          orderNumber: `AF${Date.now().toString().slice(-8)}`,
          status: 'Placed',
          createdAt: new Date().toLocaleString(),
        };
      }

      setLastOrder(savedOrder);
      setCart([]);
      setRazorpaySuccess(false);
      setScreen('success');

      if (pushEnabled) {
        Alert.alert(
          '🔔 Push Notification',
          `Order ${savedOrder.orderNumber} placed successfully! Total: ₹${cartTotal.toLocaleString('en-IN')}`
        );
      }
    } catch (error) {
      Alert.alert('Notice', 'Order placed and logged in your app session.');
      setScreen('success');
    } finally {
      setOrderSubmitting(false);
    }
  }

  async function submitServiceBooking() {
    if (
      !serviceCustomerName.trim() ||
      !servicePhone.trim() ||
      !serviceAddress.trim() ||
      !serviceDate.trim()
    ) {
      Alert.alert('Missing Details', 'Please fill in name, phone, address, and date.');
      return;
    }

    if (!/^[0-9]{10}$/.test(servicePhone.trim())) {
      Alert.alert('Invalid Phone', 'Please enter a 10-digit phone number.');
      return;
    }

    setServiceSubmitting(true);
    setServiceSuccessMsg('');

    try {
      const res = await fetch(`${DEFAULT_API_URL}/api/service-bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: serviceCustomerName.trim(),
          phone: servicePhone.trim(),
          address: serviceAddress.trim(),
          serviceType,
          preferredDate: serviceDate.trim(),
        }),
      }).catch(() => null);

      const bookingId = `SB${Date.now().toString().slice(-6)}`;
      setServiceSuccessMsg(`Service booked successfully! Ref ID: ${bookingId}`);

      Alert.alert(
        'Service Booked!',
        `Your ${serviceType} request for ${serviceDate} has been confirmed. Ref: ${bookingId}`
      );
    } catch (e) {
      Alert.alert('Notice', 'Service request recorded.');
    } finally {
      setServiceSubmitting(false);
    }
  }

  // Gate: unauthenticated users must see the existing AuthScreen before the main app
  if (!currentUser) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <StatusBar style={darkMode ? 'light' : 'dark'} />
        <AuthScreen
          theme={theme}
          styles={styles}
          onLoginSuccess={handleLoginSuccess}
          DEFAULT_API_URL={DEFAULT_API_URL}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <Header
        theme={theme}
        styles={styles}
        setScreen={setScreen}
        cartCount={cartCount}
        userRole={userRole}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentUser={currentUser}
        onOpenAuth={openAuthScreen}
      />
      <NavigationBar
        theme={theme}
        styles={styles}
        screen={screen}
        setScreen={setScreen}
        cartCount={cartCount}
      />

      {screen === 'home' && (
        <HomeScreen
          theme={theme}
          styles={styles}
          userRole={userRole}
          setScreen={setScreen}
          setSelectedCategory={setSelectedCategory}
          setIsRegisteringDealer={() => {}}
          setDealerModalVisible={() => setScreen('auth')}
        />
      )}

      {screen === 'products' && (
        <ProductsScreen
          theme={theme}
          styles={styles}
          filteredProducts={filteredProducts}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          getEffectivePrice={getEffectivePrice}
          userRole={userRole}
          renderImage={renderImage}
          setSelectedProduct={setSelectedProduct}
          setScreen={setScreen}
          addToCart={addToCart}
        />
      )}

      {screen === 'details' && (
        <DetailsScreen
          theme={theme}
          styles={styles}
          selectedProduct={selectedProduct}
          getEffectivePrice={getEffectivePrice}
          userRole={userRole}
          renderImage={renderImage}
          addToCart={addToCart}
          setScreen={setScreen}
        />
      )}

      {screen === 'cart' && (
        <CartScreen
          theme={theme}
          styles={styles}
          cart={cart}
          cartCount={cartCount}
          cartTotal={cartTotal}
          userRole={userRole}
          changeQuantity={changeQuantity}
          removeFromCart={removeFromCart}
          setScreen={setScreen}
        />
      )}

      {screen === 'checkout' && (
        <CheckoutScreen
          theme={theme}
          styles={styles}
          userRole={userRole}
          customerName={customerName}
          setCustomerName={setCustomerName}
          phone={phone}
          setPhone={setPhone}
          address={address}
          setAddress={setAddress}
          setOsmModalVisible={setOsmModalVisible}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          cart={cart}
          cartTotal={cartTotal}
          placeOrder={placeOrder}
          orderSubmitting={orderSubmitting}
          setScreen={setScreen}
        />
      )}

      {screen === 'service' && (
        <ServiceBookingScreen
          theme={theme}
          styles={styles}
          serviceCustomerName={serviceCustomerName}
          setServiceCustomerName={setServiceCustomerName}
          servicePhone={servicePhone}
          setServicePhone={setServicePhone}
          serviceAddress={serviceAddress}
          setServiceAddress={setServiceAddress}
          serviceType={serviceType}
          setServiceType={setServiceType}
          serviceDate={serviceDate}
          setServiceDate={setServiceDate}
          setOsmModalVisible={setOsmModalVisible}
          serviceSuccessMsg={serviceSuccessMsg}
          submitServiceBooking={submitServiceBooking}
          serviceSubmitting={serviceSubmitting}
        />
      )}

      {screen === 'history' && (
        <OrderHistoryScreen
          theme={theme}
          styles={styles}
          orders={orders}
          ordersLoading={ordersLoading}
          historyFilter={historyFilter}
          setHistoryFilter={setHistoryFilter}
        />
      )}

      {screen === 'profile' && (
        <ProfileScreen
          theme={theme}
          styles={styles}
          currentUser={currentUser}
          userRole={userRole}
          onLogout={handleLogout}
          onOpenAuth={openAuthScreen}
          savedAddresses={savedAddresses}
          pushEnabled={pushEnabled}
          setPushEnabled={setPushEnabled}
          setScreen={setScreen}
        />
      )}

      {screen === 'success' && (
        <SuccessScreen
          theme={theme}
          styles={styles}
          lastOrder={lastOrder}
          setLastOrder={setLastOrder}
          setScreen={setScreen}
        />
      )}

      <OpenStreetMapModal
        visible={osmModalVisible}
        onClose={() => setOsmModalVisible(false)}
        theme={theme}
        styles={styles}
        osmSearchCity={osmSearchCity}
        setOsmSearchCity={setOsmSearchCity}
        selectOsmLocation={selectOsmLocation}
      />

      <RazorpayModal
        visible={isRazorpayModalOpen}
        onClose={() => setIsRazorpayModalOpen(false)}
        cartTotal={cartTotal}
        styles={styles}
        onCompletePayment={() => {
          setRazorpaySuccess(true);
          setIsRazorpayModalOpen(false);
          Alert.alert(
            'Razorpay Test Payment Successful',
            `Payment of ₹${cartTotal.toLocaleString('en-IN')} verified. Placing your order...`,
            [{ text: 'OK', onPress: () => placeOrder() }]
          );
        }}
      />

      <ZoomModal
        zoomedImage={zoomedImage}
        onClose={() => setZoomedImage(null)}
        styles={styles}
      />
    </View>
  );
}
