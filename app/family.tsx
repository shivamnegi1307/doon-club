import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, Users, Mail, Phone, Calendar, MapPin, Badge } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

interface FamilyMember {
  id: number;
  membership_no: string;
  dob: string;
  role: string;
  user_id: number;
  name: string;
  anniversary: string | null;
  category: string | null;
  relation: string;
  email: string;
  mobile: string;
  gender: string | null;
  city: string | null;
  pin: string | null;
  address: string | null;
  status: number;
}

export default function FamilyScreen() {
  const router = useRouter();
  const { getFamilyData } = useAuth();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFamilyData();
  }, []);

  const fetchFamilyData = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await getFamilyData();
      if (result.success && result.data) {
        setFamilyMembers(result.data);
      } else {
        setError(result.error || 'Failed to fetch family data');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    const roleColors: { [key: string]: string } = {
      primary: '#0f4c8b',
      spouse: '#f59e0b',
      child: '#8b5cf6',
      dependent: '#ec4899',
    };
    return roleColors[role] || '#6b7280';
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: { [key: string]: string } = {
      primary: 'Primary Member',
      spouse: 'Spouse',
      child: 'Child',
      dependent: 'Dependent',
    };
    return roleLabels[role] || role.charAt(0).toUpperCase() + role.slice(1);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Family Members</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0f4c8b" />
          <Text style={styles.loadingText}>Loading family data...</Text>
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
        <Text style={styles.headerTitle}>Family Members</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          {error && <Text style={styles.errorText}>{error}</Text>}

          {familyMembers.length === 0 ? (
            <View style={styles.emptyState}>
              <Users size={48} color="#d1d5db" />
              <Text style={styles.emptyStateText}>No family members found</Text>
            </View>
          ) : (
            <View style={styles.membersGrid}>
              {familyMembers.map((member, index) => (
                <View key={member.id} style={styles.memberCard}>
                  <View
                    style={[
                      styles.roleIndicator,
                      { backgroundColor: getRoleColor(member.role) },
                    ]}>
                    <Text style={styles.roleLabel}>
                      {getRoleLabel(member.role)}
                    </Text>
                  </View>

                  <View style={styles.memberName}>
                    <Text style={styles.name}>{member.name}</Text>
                    <Text style={styles.relation}>{member.relation}</Text>
                  </View>

                  <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                      <Badge size={16} color="#6b7280" />
                      <Text style={styles.infoValue}>
                        {member.membership_no}
                      </Text>
                    </View>

                    {member.email && (
                      <View style={styles.infoRow}>
                        <Mail size={16} color="#6b7280" />
                        <Text style={styles.infoValue}>{member.email}</Text>
                      </View>
                    )}

                    {member.mobile && (
                      <View style={styles.infoRow}>
                        <Phone size={16} color="#6b7280" />
                        <Text style={styles.infoValue}>{member.mobile}</Text>
                      </View>
                    )}

                    {member.dob && (
                      <View style={styles.infoRow}>
                        <Calendar size={16} color="#6b7280" />
                        <Text style={styles.infoValue}>
                          {new Date(member.dob).toLocaleDateString()}
                        </Text>
                      </View>
                    )}

                    {member.gender && (
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Gender:</Text>
                        <Text style={styles.infoValue}>
                          {member.gender.charAt(0).toUpperCase() +
                            member.gender.slice(1)}
                        </Text>
                      </View>
                    )}

                    {member.anniversary && (
                      <View style={styles.infoRow}>
                        <Calendar size={16} color="#6b7280" />
                        <Text style={styles.infoValue}>
                          Anniversary:{' '}
                          {new Date(member.anniversary).toLocaleDateString()}
                        </Text>
                      </View>
                    )}

                    {member.city && (
                      <View style={styles.infoRow}>
                        <MapPin size={16} color="#6b7280" />
                        <Text style={styles.infoValue}>{member.city}</Text>
                      </View>
                    )}

                    {member.address && (
                      <View style={styles.infoRow}>
                        <MapPin size={16} color="#6b7280" />
                        <Text style={[styles.infoValue, { flex: 1 }]}>
                          {member.address}
                        </Text>
                      </View>
                    )}

                    {member.pin && (
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Pin:</Text>
                        <Text style={styles.infoValue}>{member.pin}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

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
  errorText: {
    fontSize: 13,
    color: '#ef4444',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 12,
  },
  membersGrid: {
    gap: 16,
  },
  memberCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0f4c8b',
  },
  roleIndicator: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  roleLabel: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  memberName: {
    marginBottom: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  relation: {
    fontSize: 13,
    color: '#6b7280',
  },
  infoSection: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 12,
    color: '#6b7280',
  },
  spacer: {
    height: 20,
  },
});
