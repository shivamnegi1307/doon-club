import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { ArrowLeft, MoreVertical, MapPin, Users, Bed, Clock } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';

interface Amenity {
  id: number;
  name: string;
  icon: string;
  description: string | null;
  status: number;
}

interface RoomType {
  id: number;
  name: string;
  description: string | null;
}

interface RoomData {
  id: number;
  name: string;
  check_in_time: string;
  check_out_time: string;
  no_of_guest_allowed: string;
  bed: string;
  gst: string;
  extra_person: string;
  extra_mattress: string;
  driver_price: string;
  member_price: string;
  guest_price: string;
  featured_image: string;
  images: string;
  description: string | null;
}

interface RoomResponse {
  room: RoomData;
  room_type: RoomType;
  amenities: Amenity[];
}

const { width } = Dimensions.get('window');

export default function BookingDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const roomId = params.roomId as string;

  const [roomData, setRoomData] = useState<RoomResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`https://doonclub.in/api/get-room-by-id/${roomId}`);

      if (response.ok) {
        const result = await response.json();
        if (result.status && result.data) {
          setRoomData(result.data);
        } else {
          setError('Failed to load room details');
        }
      } else {
        setError('Failed to fetch room details');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath: string) => {
    return `https://doonclub.in/storage/${imagePath.replace('public/', '')}`;
  };

  const getRoomImages = () => {
    if (!roomData) return [];
    const images = [roomData.room.featured_image];
    try {
      const additionalImages = JSON.parse(roomData.room.images);
      return [...images, ...additionalImages];
    } catch {
      return images;
    }
  };

  const handleBookNow = () => {
    if (!roomData) return;
    router.push({
      pathname: '/booking-form',
      params: {
        roomId: roomData.room.id.toString(),
        roomName: roomData.room.name,
        memberPrice: roomData.room.member_price,
        extraPersonPrice: roomData.room.extra_person,
        extraMattressPrice: roomData.room.extra_mattress,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0f4c8b" />
        <Text style={styles.loadingText}>Loading room details...</Text>
      </View>
    );
  }

  if (error || !roomData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Room not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = getRoomImages();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{roomData.room.name}</Text>
        <TouchableOpacity>
          <MoreVertical size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.floor(event.nativeEvent.contentOffset.x / width);
          setCurrentImageIndex(index);
        }}>
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: getImageUrl(image) }}
            style={styles.roomImage}
          />
        ))}
      </ScrollView>

      <View style={styles.imageIndicator}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentImageIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <View>
            <Text style={styles.roomTitle}>{roomData.room.name}</Text>
            <View style={styles.ratingRow}>
              <MapPin size={14} color="#6b7280" />
              <Text style={styles.location}>{roomData.room_type.name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Users size={20} color="#0f4c8b" />
            <Text style={styles.infoLabel}>Guests</Text>
            <Text style={styles.infoValue}>{roomData.room.no_of_guest_allowed}</Text>
          </View>
          <View style={styles.infoCard}>
            <Bed size={20} color="#0f4c8b" />
            <Text style={styles.infoLabel}>Beds</Text>
            <Text style={styles.infoValue}>{roomData.room.bed}</Text>
          </View>
          <View style={styles.infoCard}>
            <Clock size={20} color="#0f4c8b" />
            <Text style={styles.infoLabel}>Check-in</Text>
            <Text style={styles.infoValue}>{roomData.room.check_in_time}</Text>
          </View>
          <View style={styles.infoCard}>
            <Clock size={20} color="#0f4c8b" />
            <Text style={styles.infoLabel}>Check-out</Text>
            <Text style={styles.infoValue}>{roomData.room.check_out_time}</Text>
          </View>
        </View>

        <View style={styles.facilitiesSection}>
          <View style={styles.facilitiesHeader}>
            <Text style={styles.sectionTitle}>Amenities</Text>
          </View>
          <View style={styles.facilitiesGrid}>
            {roomData.amenities.map((amenity) => (
              <View key={amenity.id} style={styles.facilityItem}>
                <Image
                  source={{ uri: getImageUrl(amenity.icon) }}
                  style={styles.amenityIcon}
                />
                <Text style={styles.facilityLabel}>{amenity.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {roomData.room.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {roomData.room.description}
            </Text>
          </View>
        )}

        <View style={styles.pricingSection}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <View style={styles.pricingGrid}>
            <View style={styles.pricingItem}>
              <Text style={styles.pricingLabel}>Member Price</Text>
              <Text style={styles.pricingValue}>₹{roomData.room.member_price}</Text>
            </View>
            <View style={styles.pricingItem}>
              <Text style={styles.pricingLabel}>Guest Price</Text>
              <Text style={styles.pricingValue}>₹{roomData.room.guest_price}</Text>
            </View>
            <View style={styles.pricingItem}>
              <Text style={styles.pricingLabel}>Extra Person</Text>
              <Text style={styles.pricingValue}>₹{roomData.room.extra_person}</Text>
            </View>
            <View style={styles.pricingItem}>
              <Text style={styles.pricingLabel}>Extra Mattress</Text>
              <Text style={styles.pricingValue}>₹{roomData.room.extra_mattress}</Text>
            </View>
          </View>
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Member Price (Per Night)</Text>
          <Text style={styles.price}>₹{roomData.room.member_price}</Text>
        </View>

        <TouchableOpacity
          style={styles.bookingButton}
          onPress={handleBookNow}>
          <Text style={styles.bookingButtonText}>Book Now</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0f4c8b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#0f4c8b',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  roomImage: {
    width: width,
    height: 250,
    backgroundColor: '#e5e7eb',
  },
  imageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d1d5db',
  },
  activeDot: {
    backgroundColor: '#0f4c8b',
    width: 20,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  roomTitle: {
    fontSize: 20,
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
    fontSize: 13,
    color: '#6b7280',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  infoLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#000',
    fontWeight: '600',
  },
  facilitiesSection: {
    marginBottom: 24,
  },
  facilitiesHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  facilityItem: {
    alignItems: 'center',
    gap: 6,
    width: 70,
  },
  amenityIcon: {
    width: 32,
    height: 32,
  },
  facilityLabel: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
    marginTop: 8,
  },
  pricingSection: {
    marginBottom: 24,
  },
  pricingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  pricingItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
  },
  pricingLabel: {
    fontSize: 11,
    color: '#92400e',
    marginBottom: 4,
  },
  pricingValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
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
    fontSize: 28,
    fontWeight: '700',
    color: '#0f4c8b',
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
