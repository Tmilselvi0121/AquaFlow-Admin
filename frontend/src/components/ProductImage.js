import React from 'react';
import { Image, Text, View } from 'react-native';

export default function ProductImage({
  source,
  imageUrl,
  large = false,
  styles,
}) {
  const imageStyle = large
    ? styles.detailImage
    : styles.productImage;

  if (source) {
    return (
      <Image
        source={source}
        style={imageStyle}
        resizeMode="contain"
      />
    );
  }

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={imageStyle}
        resizeMode="contain"
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        large && styles.largePlaceholder,
      ]}
    >
      <Text style={styles.placeholderEmoji}>💧</Text>
      <Text style={styles.placeholderText}>
        Image not available
      </Text>
    </View>
  );
}