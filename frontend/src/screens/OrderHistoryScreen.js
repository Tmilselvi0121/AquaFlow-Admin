import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

export default function OrderHistoryScreen({
  theme,
  styles,
  orders,
  ordersLoading,
  historyFilter,
  setHistoryFilter,
}) {
  const displayedOrders = orders.filter((o) => {
    if (historyFilter === 'customer') return o.orderType !== 'Dealer';
    if (historyFilter === 'dealer') return o.orderType === 'Dealer';
    return true;
  });

  return (
    <ScrollView contentContainerStyle={[styles.page, { backgroundColor: theme.bg }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Order History ({displayedOrders.length})
      </Text>

      {/* History Filter Tabs */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        {[
          ['all', 'All Orders'],
          ['customer', 'Customer Orders'],
          ['dealer', 'Dealer Wholesale'],
        ].map(([key, label]) => (
          <Pressable
            key={key}
            style={[
              styles.categoryChip,
              { backgroundColor: theme.cardBg, borderColor: theme.border },
              historyFilter === key && styles.activeCategoryChip,
            ]}
            onPress={() => setHistoryFilter(key)}
          >
            <Text
              style={[
                styles.categoryChipText,
                { color: theme.subText },
                historyFilter === key && styles.activeCategoryChipText,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      {ordersLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#087E8B" />
          <Text style={[styles.infoText, { color: theme.subText, marginTop: 8 }]}>
            Loading orders...
          </Text>
        </View>
      ) : displayedOrders.length === 0 ? (
        <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Text style={[styles.infoText, { color: theme.subText }]}>
            No orders found in this category.
          </Text>
        </View>
      ) : (
        displayedOrders.map((order, index) => (
          <View
            key={order.id || index}
            style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
          >
            <View style={styles.rowBetween}>
              <Text style={[styles.infoTitle, { color: theme.text }]}>
                Order: {order.orderNumber}
              </Text>
              <View
                style={[
                  styles.statusPill,
                  {
                    backgroundColor:
                      order.status === 'Delivered'
                        ? '#D1FAE5'
                        : order.status === 'Dispatched'
                        ? '#E0E7FF'
                        : '#FEF3C7',
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color:
                      order.status === 'Delivered'
                        ? '#065F46'
                        : order.status === 'Dispatched'
                        ? '#3730A3'
                        : '#92400E',
                  }}
                >
                  {order.status || 'Placed'}
                </Text>
              </View>
            </View>

            <Text style={[styles.infoText, { color: theme.subText }]}>
              Date: {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recent'}
            </Text>

            {order.orderType === 'Dealer' && (
              <View style={[styles.dealerBadge, { alignSelf: 'flex-start', marginVertical: 4 }]}>
                <Text style={styles.dealerBadgeText}>WHOLESALE ORDER</Text>
              </View>
            )}

            <Text style={[styles.infoText, { color: theme.subText }]}>
              Payment: {order.paymentMethod || 'COD'} ({order.paymentStatus || 'Confirmed'})
            </Text>

            <View style={[styles.orderDivider, { borderColor: theme.border }]} />

            <Text style={[styles.infoTitle, { fontSize: 14, color: theme.text }]}>Items:</Text>
            {(order.items || []).map((item, itemIdx) => (
              <Text key={itemIdx} style={[styles.infoText, { color: theme.subText }]}>
                • {item.name} × {item.quantity} — ₹
                {(Number(item.price) * item.quantity).toLocaleString('en-IN')}
              </Text>
            ))}

            <Text style={[styles.total, { color: theme.primary, marginTop: 6 }]}>
              Total: ₹{Number(order.total || 0).toLocaleString('en-IN')}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}
