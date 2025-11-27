import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { ArrowLeft, MoreVertical, Users, Star, Plus, Minus, Calendar } from 'lucide-react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function BookingScreen() {
  const router = useRouter();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const bookings = [
    {
      id: 1,
      title: 'Three Bedded Room',
      rating: 4.5,
      price: '₹2,200',
      guests: '2 Guests (1 Room)',
      image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 2,
      title: 'Three Bedded Room',
      rating: 4.5,
      price: '₹2,200',
      guests: '2 Guests (1 Room)',
      image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 3,
      title: 'Three Bedded Room',
      rating: 4.5,
      price: '₹2,200',
      guests: '2 Guests (1 Room)',
      image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking</Text>
        <TouchableOpacity>
          <MoreVertical size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        <TouchableOpacity
          style={styles.datePickerRow}
          onPress={() => setShowDatePicker(true)}>
          <Calendar size={18} color="#0f4c8b" />
          <Text style={styles.datePickerLabel}>
            {checkInDate ? `${checkInDate} - ${checkOutDate}` : 'Check-In Date - Check-Out Date'}
          </Text>
        </TouchableOpacity>

        <View style={styles.countersSection}>
          <View style={styles.counterItem}>
            <Text style={styles.counterLabel}>Adult</Text>
            <View style={styles.counterControl}>
              <TouchableOpacity
                onPress={() => setAdults(Math.max(0, adults - 1))}
                style={styles.counterButton}>
                <Minus size={18} color="#0f4c8b" />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{adults}</Text>
              <TouchableOpacity
                onPress={() => setAdults(adults + 1)}
                style={styles.counterButton}>
                <Plus size={18} color="#0f4c8b" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.counterItem}>
            <Text style={styles.counterLabel}>Children</Text>
            <View style={styles.counterControl}>
              <TouchableOpacity
                onPress={() => setChildren(Math.max(0, children - 1))}
                style={styles.counterButton}>
                <Minus size={18} color="#0f4c8b" />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{children}</Text>
              <TouchableOpacity
                onPress={() => setChildren(children + 1)}
                style={styles.counterButton}>
                <Plus size={18} color="#0f4c8b" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.counterItem}>
            <Text style={styles.counterLabel}>Rooms</Text>
            <View style={styles.counterControl}>
              <TouchableOpacity
                onPress={() => setRooms(Math.max(1, rooms - 1))}
                style={styles.counterButton}>
                <Minus size={18} color="#0f4c8b" />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{rooms}</Text>
              <TouchableOpacity
                onPress={() => setRooms(rooms + 1)}
                style={styles.counterButton}>
                <Plus size={18} color="#0f4c8b" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.guestRow}>
          <Text style={styles.guestText}>
            {adults + children} Guest · {adults} Adult · {children} Children
          </Text>
        </View>

        <TouchableOpacity style={styles.checkButton}>
          <Text style={styles.checkButtonText}>Done</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.availabilityButton}>
          <Text style={styles.availabilityButtonText}>Check Availability</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showDatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}>
        <View style={styles.datePickerModal}>
          <View style={styles.datePickerContent}>
            <View style={styles.datePickerHeader}>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.datePickerClose}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.datePickerTitle}>Select Dates</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.datePickerDone}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.dateList} showsVerticalScrollIndicator={false}>
              {Array.from({ length: 60 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const formattedDate = date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
                return (
                  <TouchableOpacity
                    key={i}
                    style={styles.dateOption}
                    onPress={() => {
                      if (!checkInDate) {
                        setCheckInDate(formattedDate);
                      } else if (!checkOutDate) {
                        setCheckOutDate(formattedDate);
                        setShowDatePicker(false);
                      }
                    }}>
                    <Text style={styles.dateOptionText}>{formattedDate}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.bookingsList} showsVerticalScrollIndicator={false}>
        {bookings.map((booking) => (
          <TouchableOpacity
            key={booking.id}
            style={styles.bookingCard}
            onPress={() => router.push('/booking-detail')}>
            <Image
              source={{ uri: booking.image }}
              style={styles.bookingImage}
            />
            <View style={styles.bookingInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.bookingTitle}>{booking.title}</Text>
                <View style={styles.ratingBadge}>
                  <Star size={14} color="#f59e0b" fill="#f59e0b" />
                  <Text style={styles.rating}>{booking.rating}</Text>
                </View>
              </View>
              <Text style={styles.price}>{booking.price}/Per night</Text>
              <View style={styles.guestInfo}>
                <Users size={16} color="#6b7280" />
                <Text style={styles.guestType}>Guest</Text>
                <Text style={styles.guestCount}>{booking.guests}</Text>
              </View>
              <View style={styles.amenities}>
                <Text style={styles.amenityIcon}>🛏️</Text>
                <Text style={styles.amenityIcon}>📺</Text>
                <Text style={styles.amenityIcon}>🚿</Text>
                <Text style={styles.amenityIcon}>🔑</Text>
                <Text style={styles.amenityIcon}>✓</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingVertical: 8,
  },
  datePickerLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
  },
  datePickerModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    paddingTop: 60,
  },
  datePickerContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    maxHeight: '80%',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  datePickerClose: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  datePickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  datePickerDone: {
    fontSize: 14,
    color: '#0f4c8b',
    fontWeight: '600',
  },
  dateList: {
    paddingHorizontal: 16,
  },
  dateOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dateOptionText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  countersSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    gap: 12,
  },
  counterItem: {
    flex: 1,
    alignItems: 'center',
  },
  counterLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  counterControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  counterButton: {
    padding: 4,
  },
  counterValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    minWidth: 20,
    textAlign: 'center',
  },
  guestRow: {
    marginBottom: 12,
    paddingVertical: 8,
  },
  guestText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
  },
  checkButton: {
    backgroundColor: '#0f4c8b',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  availabilityButton: {
    backgroundColor: '#0f4c8b',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  availabilityButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  bookingsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  bookingImage: {
    width: 100,
    height: 120,
    backgroundColor: '#e5e7eb',
  },
  bookingInfo: {
    flex: 1,
    padding: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bookingTitle: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rating: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000',
  },
  price: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f4c8b',
    marginBottom: 8,
  },
  guestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  guestType: {
    fontSize: 12,
    color: '#6b7280',
  },
  guestCount: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
  },
  amenities: {
    flexDirection: 'row',
    gap: 8,
  },
  amenityIcon: {
    fontSize: 14,
  },
});
