import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { ArrowLeft, MoreVertical, MapPin, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function BookingDetailScreen() {
  const router = useRouter();

  const facilities = [
    { icon: '❄️', label: 'Ac' },
    { icon: '📺', label: 'LCD TV' },
    { icon: '🚿', label: 'Shower' },
    { icon: '☕', label: 'Tea/Coffee Machine' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking</Text>
        <TouchableOpacity>
          <MoreVertical size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Image
        source={{ uri: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400' }}
        style={styles.roomImage}
      />

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <View>
            <Text style={styles.roomTitle}>Three Bedded Room</Text>
            <View style={styles.ratingRow}>
              <MapPin size={14} color="#6b7280" />
              <Text style={styles.location}>Club Location</Text>
              <Star size={14} color="#f59e0b" fill="#f59e0b" />
              <Text style={styles.rating}>4.5</Text>
            </View>
          </View>
        </View>

        <View style={styles.facilitiesSection}>
          <View style={styles.facilitiesHeader}>
            <Text style={styles.sectionTitle}>Common Facilities</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.facilitiesGrid}>
            {facilities.map((facility, index) => (
              <View key={index} style={styles.facilityItem}>
                <Text style={styles.facilityIcon}>{facility.icon}</Text>
                <Text style={styles.facilityLabel}>{facility.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <View style={styles.descriptionHeader}>
            <Text style={styles.sectionTitle}>Description</Text>
            <TouchableOpacity>
              <Text style={styles.readMore}>Read More</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.descriptionText}>
            Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s,
          </Text>
        </View>

        <View style={styles.locationSection}>
          <View style={styles.locationHeader}>
            <Text style={styles.sectionTitle}>Location</Text>
            <TouchableOpacity>
              <Text style={styles.openMap}>Open Map</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/8451543/pexels-photo-8451543.jpeg?auto=compress&cs=tinysrgb&w=400' }}
            style={styles.mapImage}
          />
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.price}>₹2,200</Text>
        </View>

        <TouchableOpacity
          style={styles.bookingButton}
          onPress={() => router.push('/reviews')}>
          <Text style={styles.bookingButtonText}>Booking Now</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#8b7355',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  roomImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#e5e7eb',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: {
    fontSize: 12,
    color: '#6b7280',
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  facilitiesSection: {
    marginBottom: 24,
  },
  facilitiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  seeAll: {
    fontSize: 12,
    color: '#0f4c8b',
  },
  facilitiesGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  facilityItem: {
    alignItems: 'center',
    gap: 6,
  },
  facilityIcon: {
    fontSize: 24,
  },
  facilityLabel: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  readMore: {
    fontSize: 12,
    color: '#0f4c8b',
  },
  descriptionText: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  locationSection: {
    marginBottom: 24,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  openMap: {
    fontSize: 12,
    color: '#0f4c8b',
  },
  mapImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  priceSection: {
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  bookingButton: {
    backgroundColor: '#0f4c8b',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  bookingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    height: 20,
  },
});
