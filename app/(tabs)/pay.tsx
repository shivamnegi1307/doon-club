import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Transaction {
  id: number;
  order_id: string;
  narration: string;
  currency: string;
  payment_method: string;
  amount: string;
  paid_at: string;
}

export default function PayScreen() {
  const [activeTab, setActiveTab] = useState('daily');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userData } = useAuth();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    if (!userData?.token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await fetch('https://doonclub.in/api/get-all-payment', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data && Array.isArray(result.data)) {
          setTransactions(result.data);
        } else {
          setError('Invalid response format');
        }
      } else {
        setError('Failed to fetch transactions');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods: { [key: string]: string } = {
      'CC': 'Credit Card',
      'DC': 'Debit Card',
      'UPI': 'UPI',
      'NB': 'Net Banking',
      'CASH': 'Cash',
    };
    return methods[method] || method;
  };

  const filterTransactionsByTab = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeTab === 'daily') {
      return transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.paid_at);
        transactionDate.setHours(0, 0, 0, 0);
        return transactionDate.getTime() === today.getTime();
      });
    } else {
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      return transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.paid_at);
        return transactionDate >= firstDayOfMonth && transactionDate <= lastDayOfMonth;
      });
    }
  };

  const filteredTransactions = filterTransactionsByTab();

  const calculateTotalBalance = () => {
    const total = transactions.reduce((sum, transaction) => {
      return sum + parseFloat(transaction.amount);
    }, 0);
    return total.toFixed(2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pay</Text>
        <TouchableOpacity>
          <MoreVertical size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0f4c8b" />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchTransactions}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.cardSection}>
            <Text style={styles.cardLabel}>Total Balance</Text>
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.cardTitle}>Current Balance</Text>
                  <Text style={styles.cardBalance}>₹{calculateTotalBalance()}</Text>
                </View>
                <View style={styles.mastercardLogo}>
                  <Text style={styles.logoText}>₹</Text>
                </View>
              </View>
              <View style={styles.cardDetails}>
                <Text style={styles.cardInfo}>Total Transactions: {transactions.length}</Text>
              </View>
            </View>
          </View>

          <View style={styles.tabsSection}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'daily' && styles.activeTab]}
              onPress={() => setActiveTab('daily')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'daily' && styles.activeTabText,
                ]}>
                Daily
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'monthly' && styles.activeTab]}
              onPress={() => setActiveTab('monthly')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'monthly' && styles.activeTabText,
                ]}>
                Monthly
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsSection}>
            {filteredTransactions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No {activeTab} transactions found
                </Text>
              </View>
            ) : (
              filteredTransactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View style={styles.transactionIconContainer}>
                    <Text style={styles.transactionIcon}>💳</Text>
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionOrderId}>
                      Order: {transaction.order_id}
                    </Text>
                    <Text style={styles.transactionNarration}>
                      {transaction.narration.replace('_', ' ').toUpperCase()}
                    </Text>
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionMethod}>
                        {getPaymentMethodLabel(transaction.payment_method)}
                      </Text>
                      <Text style={styles.transactionSeparator}>•</Text>
                      <Text style={styles.transactionDate}>
                        {formatDate(transaction.paid_at)}
                      </Text>
                    </View>
                    <Text style={styles.transactionTime}>
                      {formatTime(transaction.paid_at)}
                    </Text>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={styles.transactionAmount}>
                      {transaction.currency} {transaction.amount}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={styles.spacer} />
        </ScrollView>
      )}
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
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
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
    paddingVertical: 40,
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cardSection: {
    marginVertical: 20,
  },
  cardLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 24,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
    marginBottom: 8,
  },
  cardBalance: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
  },
  mastercardLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
  },
  cardDetails: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 16,
  },
  cardInfo: {
    fontSize: 13,
    color: '#d1d5db',
    fontWeight: '500',
  },
  tabsSection: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#1f2937',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#fff',
  },
  transactionsSection: {
    marginBottom: 20,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  transactionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIcon: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
    gap: 4,
  },
  transactionOrderId: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  transactionNarration: {
    fontSize: 11,
    fontWeight: '500',
    color: '#0f4c8b',
  },
  transactionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  transactionMethod: {
    fontSize: 11,
    color: '#6b7280',
  },
  transactionSeparator: {
    fontSize: 11,
    color: '#d1d5db',
  },
  transactionDate: {
    fontSize: 11,
    color: '#6b7280',
  },
  transactionTime: {
    fontSize: 10,
    color: '#9ca3af',
  },
  transactionRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
  },
  spacer: {
    height: 20,
  },
});
