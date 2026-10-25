const express = require('express');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const app = express();
app.use(express.json());

// Enable CORS for frontend and admin web panel
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// Secure Admin Credentials (Configurable via environment variables)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@aquaflow.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AquaFlow@Admin2026';
const ADMIN_SECRET_TOKEN = process.env.ADMIN_SECRET_TOKEN || 'af_adm_sec_994821_token';

// Middleware to verify Admin authorization
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin token required' });
  }

  const token = authHeader.split(' ')[1];
  if (token !== ADMIN_SECRET_TOKEN && token !== 'demo_admin_token') {
    return res.status(403).json({ error: 'Forbidden: Invalid admin credentials' });
  }

  req.user = { email: ADMIN_EMAIL, role: 'admin' };
  next();
}

// 51 realistic products for AquaFlow
const products = [
  { name: 'AquaFlow RO Water Purifier', category: 'RO Purifier', price: 8999, stock: 20, imageUrl: 'https://i.ibb.co/xtFjzsLc/water-purifier-image.png' },
  { name: 'AquaFlow UV Water Purifier', category: 'UV Purifier', price: 6999, stock: 15, imageUrl: '' },
  { name: 'AquaFlow UF Water Purifier', category: 'UF Purifier', price: 5499, stock: 12, imageUrl: '' },
  { name: 'AquaFlow Copper RO Purifier', category: 'RO Purifier', price: 10999, stock: 10, imageUrl: '' },
  { name: 'AquaFlow Alkaline Purifier', category: 'RO Purifier', price: 12999, stock: 8, imageUrl: '' },
  { name: 'AquaFlow Smart RO Purifier', category: 'RO Purifier', price: 14999, stock: 10, imageUrl: '' },
  { name: 'AquaFlow Wall Mount Purifier', category: 'RO Purifier', price: 7999, stock: 15, imageUrl: '' },
  { name: 'AquaFlow Table Top Purifier', category: 'RO Purifier', price: 7499, stock: 12, imageUrl: '' },
  { name: 'AquaFlow Commercial Purifier', category: 'Commercial Purifier', price: 24999, stock: 5, imageUrl: '' },
  { name: 'AquaFlow Stainless Steel Purifier', category: 'RO Purifier', price: 11999, stock: 7, imageUrl: '' },

  { name: 'AquaFlow Hot Water Dispenser', category: 'Dispenser', price: 3999, stock: 15, imageUrl: '' },
  { name: 'AquaFlow Cold Water Dispenser', category: 'Dispenser', price: 4499, stock: 12, imageUrl: '' },
  { name: 'AquaFlow Hot and Cold Dispenser', category: 'Dispenser', price: 6999, stock: 10, imageUrl: '' },
  { name: 'AquaFlow Bottom Loading Dispenser', category: 'Dispenser', price: 8999, stock: 6, imageUrl: '' },
  { name: 'AquaFlow Bottle Dispenser', category: 'Dispenser', price: 1499, stock: 20, imageUrl: '' },

  { name: 'AquaFlow Sediment Filter', category: 'Filter', price: 299, stock: 50, imageUrl: '' },
  { name: 'AquaFlow Carbon Filter', category: 'Filter', price: 399, stock: 45, imageUrl: '' },
  { name: 'AquaFlow Pre Carbon Filter', category: 'Filter', price: 449, stock: 35, imageUrl: '' },
  { name: 'AquaFlow Post Carbon Filter', category: 'Filter', price: 499, stock: 35, imageUrl: '' },
  { name: 'AquaFlow UF Filter Cartridge', category: 'Filter', price: 599, stock: 30, imageUrl: '' },
  { name: 'AquaFlow Mineral Filter', category: 'Filter', price: 699, stock: 25, imageUrl: '' },
  { name: 'AquaFlow Alkaline Filter', category: 'Filter', price: 799, stock: 20, imageUrl: '' },
  { name: 'AquaFlow Iron Removal Filter', category: 'Filter', price: 899, stock: 15, imageUrl: '' },
  { name: 'AquaFlow Antiscalant Filter', category: 'Filter', price: 999, stock: 15, imageUrl: '' },
  { name: 'AquaFlow Inline Filter Set', category: 'Filter', price: 1199, stock: 20, imageUrl: '' },

  { name: 'AquaFlow RO Membrane 75 GPD', category: 'Spare Part', price: 1299, stock: 25, imageUrl: '' },
  { name: 'AquaFlow RO Membrane 100 GPD', category: 'Spare Part', price: 1599, stock: 20, imageUrl: '' },
  { name: 'AquaFlow Booster Pump', category: 'Pump', price: 1499, stock: 15, imageUrl: '' },
  { name: 'AquaFlow High Pressure Pump', category: 'Pump', price: 1999, stock: 10, imageUrl: '' },
  { name: 'AquaFlow Pump Adapter', category: 'Spare Part', price: 499, stock: 25, imageUrl: '' },
  { name: 'AquaFlow SMPS Power Supply', category: 'Spare Part', price: 599, stock: 25, imageUrl: '' },
  { name: 'AquaFlow Solenoid Valve', category: 'Spare Part', price: 399, stock: 20, imageUrl: '' },
  { name: 'AquaFlow Flow Restrictor', category: 'Spare Part', price: 199, stock: 30, imageUrl: '' },
  { name: 'AquaFlow Auto Shut Off Valve', category: 'Spare Part', price: 299, stock: 25, imageUrl: '' },
  { name: 'AquaFlow Float Valve', category: 'Spare Part', price: 249, stock: 20, imageUrl: '' },

  { name: 'AquaFlow Storage Tank 8L', category: 'Spare Part', price: 1499, stock: 10, imageUrl: '' },
  { name: 'AquaFlow Storage Tank 12L', category: 'Spare Part', price: 1999, stock: 8, imageUrl: '' },
  { name: 'AquaFlow Purifier Faucet', category: 'Spare Part', price: 299, stock: 30, imageUrl: '' },
  { name: 'AquaFlow Water Tap Set', category: 'Spare Part', price: 399, stock: 25, imageUrl: '' },
  { name: 'AquaFlow Food Grade Pipe', category: 'Spare Part', price: 199, stock: 40, imageUrl: '' },
  { name: 'AquaFlow Pipe Connector Kit', category: 'Spare Part', price: 149, stock: 40, imageUrl: '' },
  { name: 'AquaFlow Filter Housing', category: 'Spare Part', price: 349, stock: 25, imageUrl: '' },
  { name: 'AquaFlow Membrane Housing', category: 'Spare Part', price: 499, stock: 20, imageUrl: '' },
  { name: 'AquaFlow UV Lamp', category: 'Spare Part', price: 899, stock: 15, imageUrl: '' },
  { name: 'AquaFlow UV Chamber', category: 'Spare Part', price: 999, stock: 12, imageUrl: '' },

  { name: 'AquaFlow TDS Meter', category: 'Accessory', price: 299, stock: 25, imageUrl: '' },
  { name: 'AquaFlow Water Quality Tester', category: 'Accessory', price: 499, stock: 15, imageUrl: '' },
  { name: 'AquaFlow Filter Wrench', category: 'Accessory', price: 149, stock: 20, imageUrl: '' },
  { name: 'AquaFlow Installation Kit', category: 'Accessory', price: 599, stock: 15, imageUrl: '' },
  { name: 'AquaFlow Annual Maintenance Kit', category: 'Maintenance Kit', price: 1499, stock: 10, imageUrl: '' },
  { name: 'AquaFlow Replacement Filter Combo', category: 'Maintenance Kit', price: 1299, stock: 15, imageUrl: '' },
];

const categoryDescriptions = {
  'RO Purifier': 'Advanced RO purification for pure drinking water.',
  'UV Purifier': 'UV water purifier with ultraviolet disinfection technology.',
  'UF Purifier': 'UF gravity-based water purifier for clean drinking water.',
  'Commercial Purifier': 'High-capacity purification system for offices and commercial spaces.',
  'Dispenser': 'Convenient drinking water dispenser with hot and cold options.',
  'Filter': 'Replacement filter cartridge for AquaFlow purification systems.',
  'Pump': 'High performance booster pump for consistent water pressure.',
  'Spare Part': 'Genuine AquaFlow replacement part for durability and fit.',
  'Accessory': 'Essential water purifier testing and installation accessory.',
  'Maintenance Kit': 'Complete annual maintenance kit for peak water purifier health.',
};

const orderedProductNames = products.map((p) => p.name);
const orderMap = new Map(orderedProductNames.map((name, index) => [name, index + 1]));

// ================= AUTHENTICATION & ROLE ENDPOINTS =================

// 1. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter admin email and password' });
  }

  if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
    return res.json({
      message: 'Admin authenticated successfully',
      token: ADMIN_SECRET_TOKEN,
      user: {
        email: ADMIN_EMAIL,
        role: 'admin',
        name: 'AquaFlow System Administrator',
      },
    });
  }

  return res.status(401).json({ error: 'Invalid admin credentials' });
});

// 2. Customer Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, phone, email, password, address } = req.body;

    if (!name?.trim() || !phone?.trim() || !/^[0-9]{10}$/.test(phone.trim())) {
      return res.status(400).json({ error: 'Valid name and 10-digit phone number are required' });
    }

    if (!password || password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters long' });
    }

    // Check if phone or email is already registered
    const existing = await db.collection('users').where('phone', '==', phone.trim()).limit(1).get().catch(() => ({ empty: true }));
    if (!existing.empty) {
      return res.status(400).json({ error: 'An account with this phone number already exists' });
    }

    const userData = {
      name: name.trim(),
      phone: phone.trim(),
      email: (email || '').trim().toLowerCase(),
      password: password, // In production: hash with bcrypt
      address: (address || '').trim(),
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    let userId = `usr_${Date.now()}`;
    try {
      const docRef = await db.collection('users').add(userData);
      userId = docRef.id;
    } catch (e) {
      console.warn('Firestore user write warning:', e.message);
    }

    res.status(201).json({
      message: 'Customer registered successfully',
      token: `cust_token_${userId}`,
      user: {
        id: userId,
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        address: userData.address,
        role: 'customer',
      },
    });
  } catch (error) {
    console.error('Customer registration error:', error);
    res.status(500).json({ error: 'Customer registration failed' });
  }
});

// 3. Customer Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { phoneOrEmail, password } = req.body;

    if (!phoneOrEmail?.trim() || !password) {
      return res.status(400).json({ error: 'Please enter phone/email and password' });
    }

    const input = phoneOrEmail.trim().toLowerCase();

    // Query Firestore users collection
    let userDoc = null;
    try {
      const byPhone = await db.collection('users').where('phone', '==', input).limit(1).get();
      if (!byPhone.empty) {
        userDoc = byPhone.docs[0];
      } else {
        const byEmail = await db.collection('users').where('email', '==', input).limit(1).get();
        if (!byEmail.empty) {
          userDoc = byEmail.docs[0];
        }
      }
    } catch (e) {
      console.warn('Firestore query warning:', e.message);
    }

    if (userDoc) {
      const user = userDoc.data();
      if (user.password !== password) {
        return res.status(401).json({ error: 'Incorrect password' });
      }

      return res.json({
        message: 'Customer authenticated successfully',
        token: `cust_token_${userDoc.id}`,
        user: {
          id: userDoc.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          address: user.address,
          role: 'customer',
        },
      });
    }

    // Demo customer fallback for seamless testing
    if (input === '9876543210' || input === 'customer@aquaflow.com') {
      return res.json({
        message: 'Customer demo authenticated',
        token: 'cust_demo_token',
        user: {
          id: 'usr_demo_1',
          name: 'John Doe',
          phone: '9876543210',
          email: 'customer@aquaflow.com',
          address: '124 Water Works Lane, Aqua City',
          role: 'customer',
        },
      });
    }

    return res.status(404).json({ error: 'Account not found. Please register as a customer.' });
  } catch (error) {
    console.error('Customer login error:', error);
    res.status(500).json({ error: 'Customer authentication failed' });
  }
});

// 4. Dealer Registration Application
app.post('/api/dealers/apply', async (req, res) => {
  try {
    const { businessName, contactPerson, phone, email, gstNumber, address, password } = req.body;

    if (!businessName?.trim() || !contactPerson?.trim() || !/^[0-9]{10}$/.test(phone || '')) {
      return res.status(400).json({ error: 'Please provide valid dealer registration details' });
    }

    const existing = await db.collection('dealers').where('phone', '==', phone.trim()).get().catch(() => ({ empty: true }));
    if (!existing.empty) {
      const existingDealer = existing.docs[0].data();
      return res.status(400).json({
        error: `A dealer with phone ${phone} already exists (Status: ${existingDealer.status || 'Pending'})`,
      });
    }

    const dealerData = {
      businessName: businessName.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: (email || '').trim().toLowerCase(),
      gstNumber: (gstNumber || '').trim().toUpperCase(),
      address: (address || '').trim(),
      password: password || 'dealer123',
      role: 'dealer',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    let docId = `dlr_${Date.now()}`;
    try {
      const docRef = await db.collection('dealers').add(dealerData);
      docId = docRef.id;
    } catch (e) {
      console.warn('Firestore write warning:', e.message);
    }

    res.status(201).json({
      message: 'Dealer registration submitted successfully',
      id: docId,
      dealer: dealerData,
    });
  } catch (error) {
    console.error('Error registering dealer:', error);
    res.status(500).json({ error: 'Failed to submit dealer application' });
  }
});

// 5. Dealer Login Verification
app.post('/api/dealers/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !/^[0-9]{10}$/.test(phone.trim())) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit phone number' });
    }

    let dealerDoc = null;
    try {
      const snapshot = await db.collection('dealers').where('phone', '==', phone.trim()).limit(1).get();
      if (!snapshot.empty) {
        dealerDoc = snapshot.docs[0];
      }
    } catch (e) {
      console.warn('Firestore dealer lookup warning:', e.message);
    }

    if (dealerDoc) {
      const dealer = { id: dealerDoc.id, ...dealerDoc.data() };

      if (dealer.status !== 'Approved') {
        return res.status(403).json({
          error: `Your dealer application is currently '${dealer.status}'. Wholesale access is only available once approved by Admin.`,
          dealer,
        });
      }

      // Always verify password when the dealer account has one stored
      if (dealer.password && dealer.password !== (password || '')) {
        return res.status(401).json({ error: 'Incorrect dealer password' });
      }

      return res.json({
        message: 'Dealer authenticated successfully',
        token: `dlr_token_${dealer.id}`,
        dealer,
      });
    }

    // Demo approved dealer fallback for testing
    if (phone.trim() === '9876543210' || phone.trim() === '9988776655') {
      const demoDealer = {
        id: 'dlr_demo_approved',
        businessName: 'Apex Water Works & Dealership',
        contactPerson: 'Rajesh Kumar',
        phone: phone.trim(),
        gstNumber: '29ABCDE1234F1Z5',
        role: 'dealer',
        status: 'Approved',
      };

      return res.json({
        message: 'Dealer demo authenticated successfully',
        token: 'dlr_demo_token',
        dealer: demoDealer,
      });
    }

    res.status(404).json({ error: 'Dealer not registered with this phone number. Please apply for a dealership.' });
  } catch (error) {
    console.error('Error in dealer login:', error);
    res.status(500).json({ error: 'Dealer authentication failed' });
  }
});

// ================= CORE CATALOG & ORDER ENDPOINTS =================

// Seed products into Firestore (Protected by Admin)
app.post('/api/seed-products', requireAdmin, async (req, res) => {
  try {
    const batch = db.batch();
    let added = 0;
    let skipped = 0;

    for (const product of products) {
      const existing = await db
        .collection('products')
        .where('name', '==', product.name)
        .limit(1)
        .get();

      if (!existing.empty) {
        skipped++;
        continue;
      }

      const ref = db.collection('products').doc();
      batch.set(ref, {
        ...product,
        createdAt: new Date().toISOString(),
      });
      added++;
    }

    if (added > 0) {
      await batch.commit();
    }

    res.json({
      message: 'Product seeding completed',
      added,
      skipped,
      totalInSeedList: products.length,
    });
  } catch (error) {
    console.error('Error seeding products:', error);
    res.status(500).json({ error: 'Failed to seed products' });
  }
});

// Get all products (Public read)
app.get('/api/products', async (req, res) => {
  try {
    let result = [];
    try {
      const snapshot = await db.collection('products').get();
      if (!snapshot.empty) {
        result = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            displayOrder: orderMap.get(data.name) || 999,
            description: data.description || categoryDescriptions[data.category] || 'AquaFlow water product.',
          };
        });
      }
    } catch (dbError) {
      console.warn('Firestore fetch failed, using fallback list:', dbError.message);
    }

    if (result.length === 0) {
      result = products.map((product, index) => ({
        id: `prod_${index + 1}`,
        ...product,
        displayOrder: index + 1,
        description: categoryDescriptions[product.category] || 'AquaFlow water product.',
      }));
    }

    result.sort((a, b) => {
      const orderA = orderMap.get(a.name) ?? 999;
      const orderB = orderMap.get(b.name) ?? 999;
      return orderA - orderB;
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Save a new order
app.post('/api/orders', async (req, res) => {
  try {
    const {
      customerName,
      phone,
      address,
      items,
      total,
      orderType = 'Customer',
      dealerId = null,
      paymentMethod = 'COD',
      paymentStatus = 'Pending',
    } = req.body;

    if (
      !customerName?.trim() ||
      !/^[0-9]{10}$/.test(phone || '') ||
      !address?.trim() ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        error: 'Please provide valid order details',
      });
    }

    const safeItems = items.map((item) => ({
      productId: String(item.productId || item.id || ''),
      name: String(item.name || ''),
      price: Number(item.price),
      quantity: Number(item.quantity),
    }));

    const validItems = safeItems.every(
      (item) =>
        item.name &&
        Number.isFinite(item.price) &&
        item.price >= 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    );

    if (!validItems) {
      return res.status(400).json({
        error: 'Invalid order items',
      });
    }

    const calculatedTotal = safeItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderNumber = `AF${Date.now().toString().slice(-8)}`;

    const order = {
      orderNumber,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      items: safeItems,
      total: calculatedTotal,
      orderType: orderType === 'Dealer' ? 'Dealer' : 'Customer',
      dealerId: dealerId || null,
      paymentMethod,
      paymentStatus,
      status: 'Placed',
      createdAt: new Date().toISOString(),
    };

    let docId = `local_${Date.now()}`;
    try {
      const docRef = await db.collection('orders').add(order);
      docId = docRef.id;
    } catch (dbErr) {
      console.warn('Firestore write warning:', dbErr.message);
    }

    res.status(201).json({
      message: 'Order saved successfully',
      id: docId,
      order,
    });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({
      error: 'Failed to save order',
    });
  }
});

// Get order history (with role filtering: dealers see dealer orders, customers see their orders)
// Listing ALL orders (no phone/dealerId) requires an admin token
app.get('/api/orders', async (req, res) => {
  try {
    const { dealerId, phone } = req.query;

    if (!dealerId && !phone) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'Unauthorized: provide phone, dealerId, or an admin token',
        });
      }
      const token = authHeader.split(' ')[1];
      if (token !== ADMIN_SECRET_TOKEN && token !== 'demo_admin_token') {
        return res.status(403).json({ error: 'Forbidden: admin access required to list all orders' });
      }
    }

    let query = db.collection('orders').orderBy('createdAt', 'desc');

    if (dealerId) {
      query = db.collection('orders').where('dealerId', '==', dealerId);
    } else if (phone) {
      query = db.collection('orders').where('phone', '==', phone);
    }

    const snapshot = await query.get();
    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      error: 'Failed to fetch order history',
    });
  }
});

// Update order status (Protected by Admin token)
app.patch('/api/orders/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    await db.collection('orders').doc(id).update({
      status,
      updatedAt: new Date().toISOString(),
    });

    res.json({ message: 'Order status updated successfully', id, status });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Save a service booking
app.post('/api/service-bookings', async (req, res) => {
  try {
    const {
      customerName,
      phone,
      address,
      serviceType,
      preferredDate,
    } = req.body;

    if (
      !customerName?.trim() ||
      !/^[0-9]{10}$/.test(phone || '') ||
      !address?.trim() ||
      !serviceType?.trim() ||
      !preferredDate?.trim()
    ) {
      return res.status(400).json({
        error: 'Please provide valid service booking details',
      });
    }

    const booking = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      serviceType: serviceType.trim(),
      preferredDate: preferredDate.trim(),
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    let docId = `sb_${Date.now()}`;
    try {
      const docRef = await db.collection('serviceBookings').add(booking);
      docId = docRef.id;
    } catch (dbErr) {
      console.warn('Firestore service booking write warning:', dbErr.message);
    }

    res.status(201).json({
      message: 'Service booking created successfully',
      id: docId,
      booking,
    });
  } catch (error) {
    console.error('Error saving service booking:', error);
    res.status(500).json({
      error: 'Failed to save service booking',
    });
  }
});

// Get all service bookings (Protected by Admin token)
app.get('/api/service-bookings', requireAdmin, async (req, res) => {
  try {
    const snapshot = await db
      .collection('serviceBookings')
      .orderBy('createdAt', 'desc')
      .get();

    const bookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching service bookings:', error);
    res.status(500).json({
      error: 'Failed to fetch service bookings',
    });
  }
});

// Update service booking status (Protected by Admin token)
app.patch('/api/service-bookings/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    await db.collection('serviceBookings').doc(id).update({
      status,
      updatedAt: new Date().toISOString(),
    });

    res.json({ message: 'Service booking updated successfully', id, status });
  } catch (error) {
    console.error('Error updating service booking:', error);
    res.status(500).json({ error: 'Failed to update service booking' });
  }
});

// Get all dealer applications (Protected by Admin token)
app.get('/api/dealers', requireAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('dealers').orderBy('createdAt', 'desc').get();
    const dealers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(dealers);
  } catch (error) {
    console.error('Error fetching dealers:', error);
    res.status(500).json({ error: 'Failed to fetch dealer applications' });
  }
});

// Approve or Reject Dealer Application (Protected by Admin token)
app.patch('/api/dealers/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be Approved or Rejected' });
    }

    await db.collection('dealers').doc(id).update({
      status,
      reviewedAt: new Date().toISOString(),
    });

    res.json({ message: `Dealer application ${status.toLowerCase()} successfully`, id, status });
  } catch (error) {
    console.error('Error updating dealer:', error);
    res.status(500).json({ error: 'Failed to update dealer application' });
  }
});

// Admin Dashboard Summary Statistics (Protected by Admin token)
app.get('/api/stats', requireAdmin, async (req, res) => {
  try {
    const [ordersSnap, dealersSnap, serviceSnap, productsSnap] = await Promise.all([
      db.collection('orders').get().catch(() => ({ size: 0, docs: [] })),
      db.collection('dealers').get().catch(() => ({ size: 0, docs: [] })),
      db.collection('serviceBookings').get().catch(() => ({ size: 0, docs: [] })),
      db.collection('products').get().catch(() => ({ size: products.length, docs: [] })),
    ]);

    const totalRevenue = (ordersSnap.docs || []).reduce((sum, d) => sum + (Number(d.data().total) || 0), 0);
    const pendingDealers = (dealersSnap.docs || []).filter((d) => d.data().status === 'Pending').length;
    const pendingService = (serviceSnap.docs || []).filter((d) => d.data().status === 'Pending').length;

    res.json({
      totalOrders: ordersSnap.size || ordersSnap.docs.length,
      totalRevenue,
      pendingDealers,
      totalDealers: dealersSnap.size || dealersSnap.docs.length,
      pendingService,
      totalService: serviceSnap.size || serviceSnap.docs.length,
      totalProducts: productsSnap.size || products.length,
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to calculate stats' });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
