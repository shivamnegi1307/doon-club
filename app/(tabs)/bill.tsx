import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

interface MemberDetails {
  name: string;
  member_id: string;
  member_type: string;
  phone: string;
  email: string;
  gender: string;
  pin_code: string;
  city: string;
  address: string;
}

export default function BillScreen() {
  const router = useRouter();
  const { userData } = useAuth();
  const [memberDetails, setMemberDetails] = useState<MemberDetails | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchMemberDetails();
  }, []);

  const fetchMemberDetails = async () => {
    if (!userData?.token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await fetch('https://doonclub.in/api/user-profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          setMemberDetails({
            name: result.data.name || 'Member',
            member_id: result.data.member_id || 'N/A',
            member_type: result.data.member_type || 'Standard',
            phone: result.data.phone || 'N/A',
            email: result.data.email || 'N/A',
            gender: result.data.gender || 'N/A',
            pin_code: result.data.pin_code || 'N/A',
            city: result.data.city || 'N/A',
            address: result.data.address || 'N/A',
          });
        }
      } else {
        setError('Failed to fetch member details');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!userData?.token) {
      setError('Not authenticated');
      return;
    }

    try {
      setPaying(true);
      setError('');
      const response = await fetch('https://doonclub.in/api/initiate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          payment_type: 'membership',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        router.push({
          pathname: '/payment-success',
          params: { order_id: result.data?.order_id || 'PAYMENT_001' },
        });
      } else {
        setError('Payment initiation failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pay Membership</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f59e0b" />
          <Text style={styles.loadingText}>Loading member details...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pay Membership</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <View style={styles.memberCardSection}>
            <View style={styles.memberCard}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>👤</Text>
              </View>
              <Text style={styles.memberName}>{memberDetails?.name}</Text>
              <Text style={styles.memberId}>Member ID: {memberDetails?.member_id}</Text>
              <Text style={styles.memberType}>Member Type: {memberDetails?.member_type}</Text>
            </View>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Member Details</Text>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{memberDetails?.phone}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{memberDetails?.email}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Gender</Text>
                <Text style={styles.detailValue}>{memberDetails?.gender}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>City</Text>
                <Text style={styles.detailValue}>{memberDetails?.city}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Pin Code</Text>
                <Text style={styles.detailValue}>{memberDetails?.pin_code}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Address</Text>
                <Text style={[styles.detailValue, { flex: 1 }]}>
                  {memberDetails?.address}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Pay Membership Amount</Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TextInput
              style={styles.amountInput}
              placeholder="Enter amount (₹)"
              placeholderTextColor="#9ca3af"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              editable={!paying}
            />

            <TouchableOpacity
              style={[styles.payButton, paying && styles.payButtonDisabled]}
              onPress={handlePayment}
              disabled={paying}>
              {paying ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.payButtonText}>Pay Online</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />
        </View>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  mainContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  memberCardSection: {
    marginBottom: 32,
  },
  memberCard: {
    backgroundColor: '#f59e0b',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  memberId: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  memberType: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  detailsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
  paymentSection: {
    marginBottom: 32,
  },
  errorText: {
    fontSize: 13,
    color: '#ef4444',
    marginBottom: 12,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
    marginBottom: 16,
  },
  payButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  spacer: {
    height: 20,
  },
});
