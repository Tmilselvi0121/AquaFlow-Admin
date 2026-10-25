import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function ServiceBookingScreen({
  theme,
  styles,
  serviceCustomerName,
  setServiceCustomerName,
  servicePhone,
  setServicePhone,
  serviceAddress,
  setServiceAddress,
  serviceType,
  setServiceType,
  serviceDate,
  setServiceDate,
  setOsmModalVisible,
  serviceSuccessMsg,
  submitServiceBooking,
  serviceSubmitting,
}) {
  return (
    <ScrollView contentContainerStyle={[styles.page, { backgroundColor: theme.bg }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Book a Service Request</Text>

      <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <Text style={[styles.infoTitle, { color: theme.text }]}>Service Details</Text>
        <Text style={[styles.infoText, { color: theme.subText }]}>
          Expert technician visit for maintenance, filter changes, or repairs.
        </Text>

        <Text style={[styles.inputLabel, { color: theme.subText }]}>Customer Name</Text>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          placeholder="Full name"
          placeholderTextColor={theme.subText}
          value={serviceCustomerName}
          onChangeText={setServiceCustomerName}
        />

        <Text style={[styles.inputLabel, { color: theme.subText }]}>Mobile Number</Text>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          placeholder="10-digit number"
          placeholderTextColor={theme.subText}
          value={servicePhone}
          onChangeText={(val) => setServicePhone(val.replace(/[^0-9]/g, '').slice(0, 10))}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <View style={styles.rowBetween}>
          <Text style={[styles.inputLabel, { color: theme.subText }]}>Service Address</Text>
          <Pressable onPress={() => setOsmModalVisible(true)}>
            <Text style={{ color: '#0284C7', fontWeight: 'bold', fontSize: 13 }}>
              📍 OpenStreetMap Helper
            </Text>
          </Pressable>
        </View>

        <TextInput
          style={[styles.input, styles.addressInput, { color: theme.text, borderColor: theme.border }]}
          placeholder="Complete address for technician visit"
          placeholderTextColor={theme.subText}
          value={serviceAddress}
          onChangeText={setServiceAddress}
          multiline
        />

        <Text style={[styles.inputLabel, { color: theme.subText, marginTop: 10 }]}>
          Select Service Type:
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
          {['Maintenance', 'Filter Replacement', 'Repair', 'Installation', 'Water Quality Test'].map(
            (type) => (
              <Pressable
                key={type}
                style={[
                  styles.categoryChip,
                  { backgroundColor: theme.cardBg, borderColor: theme.border },
                  serviceType === type && styles.activeCategoryChip,
                ]}
                onPress={() => setServiceType(type)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    { color: theme.subText },
                    serviceType === type && styles.activeCategoryChipText,
                  ]}
                >
                  {type}
                </Text>
              </Pressable>
            )
          )}
        </View>

        <Text style={[styles.inputLabel, { color: theme.subText, marginTop: 14 }]}>
          Preferred Date (YYYY-MM-DD)
        </Text>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          placeholder="e.g. 2026-10-30"
          placeholderTextColor={theme.subText}
          value={serviceDate}
          onChangeText={setServiceDate}
        />

        {serviceSuccessMsg ? (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>{serviceSuccessMsg}</Text>
          </View>
        ) : null}

        <Pressable
          style={[styles.primaryButton, { marginTop: 14 }]}
          onPress={submitServiceBooking}
          disabled={serviceSubmitting}
        >
          {serviceSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Submit Service Request</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}
