import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ArrowLeft, Calendar, Plus, Minus, User } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import * as WebBrowser from 'expo-web-browser';

export default function BookingFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userData } = useAuth();

  const roomId = params.roomId as string;
  const roomName = params.roomName as string;
  const memberPrice = parseFloat(params.memberPrice as string);
  const extraPersonPrice = parseFloat(params.extraPersonPrice as string);
  const extraMattressPrice = parseFloat(params.extraMattressPrice as string);

  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState<'checkin' | 'checkout'>('checkin');
  const [extraPerson, setExtraPerson] = useState(0);
  const [extraMattress, setExtraMattress] = useState(0);
  const [bookAs, setBookAs] = useState<'self' | 'guest'>('self');
  const [guestName, setGuestName] = useState('');
  const [guestContact, setGuestContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const basePrice = memberPrice * nights;
    const extraPersonTotal = extraPerson * extraPersonPrice;
    const extraMattressTotal = extraMattress * extraMattressPrice;
    return basePrice + extraPersonTotal + extraMattressTotal;
  };

  const openDatePicker = (type: 'checkin' | 'checkout') => {
    setDatePickerType(type);
    setShowDatePicker(true);
  };

  const handleDateSelect = (date: string) => {
    if (datePickerType === 'checkin') {
      setCheckInDate(date);
      setCheckOutDate('');
    } else {
      setCheckOutDate(date);
      setShowDatePicker(false);
    }
  };

  const formatDateForAPI = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const validateForm = () => {
    if (!checkInDate || !checkOutDate) {
      setError('Please select check-in and check-out dates');
      return false;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkOut <= checkIn) {
      setError('Check-out date must be after check-in date');
      return false;
    }

    if (bookAs === 'guest') {
      if (!guestName.trim()) {
        setError('Please enter guest name');
        return false;
      }
      if (!guestContact.trim() || guestContact.length < 10) {
        setError('Please enter valid guest contact number');
        return false;
      }
    }

    return true;
  };

  const handleProceedToPayment = async () => {
    if (!validateForm()) return;

    const bookingData = {
      room_id: parseInt(roomId),
      check_in: formatDateForAPI(checkInDate),
      check_out: formatDateForAPI(checkOutDate),
      extra_person: extraPerson,
      extra_mattress: extraMattress,
      book_as: bookAs,
      guest_name: bookAs === 'guest' ? guestName : userData?.profile.name || '',
      guest_contact: bookAs === 'guest' ? guestContact : userData?.profile.name || '',
      payble_amount: calculateTotal(),
    };

    setLoading(true);
    setError('');

    try {
      const paymentResponse = await fetch('https://doonclub.in/api/pay-online/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData?.token}`,
        },
        body: JSON.stringify({
          amount: bookingData.payble_amount.toString(),
        }),
      });

      if (paymentResponse.ok) {
        const paymentResult = await paymentResponse.json();

        if (paymentResult.success && paymentResult.payment_url) {
          const browserResult = await WebBrowser.openBrowserAsync(paymentResult.payment_url);

          if (browserResult.type === 'cancel' || browserResult.type === 'dismiss') {
            Alert.alert('Payment Cancelled', 'You cancelled the payment process.');
            setLoading(false);
            return;
          }

          try {
            const bookingResponse = await fetch('https://doonclub.in/api/room-booking', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData?.token}`,
              },
              body: JSON.stringify(bookingData),
            });

            if (bookingResponse.ok) {
              Alert.alert(
                'Booking Confirmed',
                'Your room has been booked successfully!',
                [
                  {
                    text: 'OK',
                    onPress: () => router.push('/(tabs)'),
                  },
                ]
              );
            } else {
              const errorData = await bookingResponse.json();
              setError(errorData.message || 'Booking failed. Please contact support.');
            }
          } catch (err) {
            setError('Failed to confirm booking. Please contact support.');
          }
        } else {
          setError('Payment URL not received');
        }
      } else {
        const errorData = await paymentResponse.json();
        setError(errorData.message || 'Payment initiation failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Form</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.roomInfoCard}>
          <Text style={styles.roomName}>{roomName}</Text>
          <Text style={styles.roomPrice}>₹{memberPrice} per night</Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Dates</Text>

          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => openDatePicker('checkin')}>
            <Calendar size={20} color="#6b7280" />
            <Text style={[styles.dateText, !checkInDate && styles.placeholder]}>
              {checkInDate || 'Check-in Date'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => openDatePicker('checkout')}>
            <Calendar size={20} color="#6b7280" />
            <Text style={[styles.dateText, !checkOutDate && styles.placeholder]}>
              {checkOutDate || 'Check-out Date'}
            </Text>
          </TouchableOpacity>

          {checkInDate && checkOutDate && (
            <Text style={styles.nightsText}>
              {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Requirements</Text>

          <View style={styles.counterRow}>
            <Text style={styles.counterLabel}>Extra Person</Text>
            <View style={styles.counterControls}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setExtraPerson(Math.max(0, extraPerson - 1))}>
                <Minus size={20} color="#0f4c8b" />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{extraPerson}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setExtraPerson(extraPerson + 1)}>
                <Plus size={20} color="#0f4c8b" />
              </TouchableOpacity>
            </View>
          </View>
          {extraPerson > 0 && (
            <Text style={styles.priceHint}>₹{extraPersonPrice} per person</Text>
          )}

          <View style={styles.counterRow}>
            <Text style={styles.counterLabel}>Extra Mattress</Text>
            <View style={styles.counterControls}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setExtraMattress(Math.max(0, extraMattress - 1))}>
                <Minus size={20} color="#0f4c8b" />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{extraMattress}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setExtraMattress(extraMattress + 1)}>
                <Plus size={20} color="#0f4c8b" />
              </TouchableOpacity>
            </View>
          </View>
          {extraMattress > 0 && (
            <Text style={styles.priceHint}>₹{extraMattressPrice} per mattress</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking For</Text>

          <View style={styles.bookAsButtons}>
            <TouchableOpacity
              style={[styles.bookAsButton, bookAs === 'self' && styles.bookAsButtonActive]}
              onPress={() => setBookAs('self')}>
              <User size={20} color={bookAs === 'self' ? '#fff' : '#6b7280'} />
              <Text style={[styles.bookAsButtonText, bookAs === 'self' && styles.bookAsButtonTextActive]}>
                Self
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bookAsButton, bookAs === 'guest' && styles.bookAsButtonActive]}
              onPress={() => setBookAs('guest')}>
              <User size={20} color={bookAs === 'guest' ? '#fff' : '#6b7280'} />
              <Text style={[styles.bookAsButtonText, bookAs === 'guest' && styles.bookAsButtonTextActive]}>
                Guest
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {bookAs === 'guest' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Guest Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Guest Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter guest name"
                placeholderTextColor="#d1d5db"
                value={guestName}
                onChangeText={setGuestName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Guest Contact</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter guest contact number"
                placeholderTextColor="#d1d5db"
                value={guestContact}
                onChangeText={setGuestContact}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </View>
        )}

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Room ({calculateNights()} nights)</Text>
            <Text style={styles.totalValue}>₹{(memberPrice * calculateNights()).toFixed(2)}</Text>
          </View>
          {extraPerson > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Extra Person ({extraPerson})</Text>
              <Text style={styles.totalValue}>₹{(extraPerson * extraPersonPrice).toFixed(2)}</Text>
            </View>
          )}
          {extraMattress > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Extra Mattress ({extraMattress})</Text>
              <Text style={styles.totalValue}>₹{(extraMattress * extraMattressPrice).toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.grandTotalLabel}>Total Amount</Text>
            <Text style={styles.grandTotalValue}>₹{calculateTotal().toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.proceedButton, loading && styles.proceedButtonDisabled]}
          onPress={handleProceedToPayment}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
          )}
        </TouchableOpacity>

        <View style={styles.spacer} />
      </ScrollView>

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
              <Text style={styles.datePickerTitle}>
                {datePickerType === 'checkin' ? 'Check-in Date' : 'Check-out Date'}
              </Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.datePickerDone}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.dateList} showsVerticalScrollIndicator={false}>
              {Array.from({ length: 60 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const formattedDate = date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });
                const isoDate = date.toISOString();
                const isDisabled =
                  datePickerType === 'checkout' &&
                  checkInDate &&
                  new Date(isoDate) <= new Date(checkInDate);

                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.dateOption, isDisabled && styles.dateOptionDisabled]}
                    onPress={() => !isDisabled && handleDateSelect(isoDate)}
                    disabled={isDisabled}>
                    <Text style={[styles.dateOptionText, isDisabled && styles.dateOptionTextDisabled]}>
                      {formattedDate}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  roomInfoCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  roomPrice: {
    fontSize: 14,
    color: '#0f4c8b',
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#000',
  },
  placeholder: {
    color: '#9ca3af',
  },
  nightsText: {
    fontSize: 13,
    color: '#0f4c8b',
    fontWeight: '600',
    marginTop: 4,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  counterLabel: {
    fontSize: 14,
    color: '#000',
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    minWidth: 24,
    textAlign: 'center',
  },
  priceHint: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
  },
  bookAsButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  bookAsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  bookAsButtonActive: {
    backgroundColor: '#0f4c8b',
  },
  bookAsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  bookAsButtonTextActive: {
    color: '#fff',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
  },
  totalSection: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  totalValue: {
    fontSize: 13,
    color: '#000',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f4c8b',
  },
  proceedButton: {
    backgroundColor: '#0f4c8b',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  proceedButtonDisabled: {
    opacity: 0.6,
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    height: 20,
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
  dateOptionDisabled: {
    opacity: 0.5,
  },
  dateOptionText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  dateOptionTextDisabled: {
    color: '#9ca3af',
  },
});
