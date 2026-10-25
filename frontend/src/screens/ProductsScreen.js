import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function ProductsScreen({
  theme,
  styles,
  filteredProducts,
  loading,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  getEffectivePrice,
  userRole,
  renderImage,
  setSelectedProduct,
  setScreen,
  addToCart,
}) {
  return (
    <ScrollView contentContainerStyle={[styles.page, { backgroundColor: theme.bg }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Water Purifiers & Spares ({filteredProducts.length})
      </Text>

      {/* Search Input Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <Text style={{ fontSize: 18, marginRight: 8 }}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search by product name, category, or part..."
          placeholderTextColor={theme.subText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Text style={{ color: '#EF4444', fontWeight: 'bold', padding: 4 }}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Category Horizontal Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={{ gap: 8, paddingBottom: 6 }}
      >
        {categories.map((cat) => (
          <Pressable
            key={cat}
            style={[
              styles.categoryChip,
              { backgroundColor: theme.cardBg, borderColor: theme.border },
              selectedCategory === cat && styles.activeCategoryChip,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryChipText,
                { color: theme.subText },
                selectedCategory === cat && styles.activeCategoryChipText,
              ]}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#087E8B" />
          <Text style={[styles.infoText, { color: theme.subText, marginTop: 10 }]}>
            Loading products...
          </Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>No products found</Text>
          <Text style={[styles.infoText, { color: theme.subText }]}>
            Try searching with another keyword or resetting the category filter.
          </Text>
          <Pressable
            style={styles.primaryButton}
            onPress={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            <Text style={styles.primaryButtonText}>Reset Filters</Text>
          </Pressable>
        </View>
      ) : (
        filteredProducts.map((product, index) => {
          const effectivePrice = getEffectivePrice(product);
          const isWholesale = userRole === 'Dealer';

          return (
            <View
              key={product.id || index}
              style={[styles.productCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            >
              {renderImage(product)}

              <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: theme.text }]}>{product.name}</Text>

                <Text style={styles.category}>{product.category || 'Water Product'}</Text>

                {/* Pricing with Dealer Wholesale indicator */}
                <View style={styles.priceRow}>
                  <Text style={styles.price}>
                    ₹{effectivePrice.toLocaleString('en-IN')}
                  </Text>

                  {isWholesale && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.retailStrikethrough}>
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </Text>
                      <View style={styles.wholesaleBadge}>
                        <Text style={styles.wholesaleBadgeText}>WHOLESALE</Text>
                      </View>
                    </View>
                  )}
                </View>

                <Text style={[styles.stock, { color: theme.subText }]}>
                  In Stock: {product.stock ?? 20} units
                </Text>

                <View style={styles.cardActions}>
                  <Pressable
                    style={[styles.secondaryButton, { flex: 1, marginTop: 0 }]}
                    onPress={() => {
                      setSelectedProduct(product);
                      setScreen('details');
                    }}
                  >
                    <Text style={styles.secondaryButtonText}>Details</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.primaryButton, { flex: 1, marginTop: 0 }]}
                    onPress={() => addToCart(product, 1)}
                  >
                    <Text style={styles.primaryButtonText}>+ Add to Cart</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}
