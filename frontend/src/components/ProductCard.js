import React from 'react';
import { Pressable, Text, View } from 'react-native';
import ProductImage from './ProductImage';

export default function ProductCard({
  product,
  imageSource,
  styles,
  onViewDetails,
}) {
  return (
    <View style={styles.productCard}>
      <ProductImage
        source={imageSource}
        imageUrl={product.imageUrl}
        styles={styles}
      />

      <View style={styles.productInfo}>
        <Text style={styles.productName}>
          {product.name}
        </Text>

        <Text style={styles.category}>
          {product.category || 'Water Products'}
        </Text>

        <Text style={styles.price}>
          ₹{Number(product.price || 0).toLocaleString('en-IN')}
        </Text>

        <Text style={styles.stock}>
          Stock: {product.stock ?? 'Check availability'}
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => onViewDetails(product)}
        >
          <Text style={styles.primaryButtonText}>
            View Details
          </Text>
        </Pressable>
      </View>
    </View>
  );
}