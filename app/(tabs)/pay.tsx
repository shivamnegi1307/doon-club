import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import { useState } from 'react';

export default function PayScreen() {
  const [activeTab, setActiveTab] = useState('daily');

  const transactions = [
    {
      id: 1,
      name: 'Arjun Rawat',
      time: '3:40 pm',
      amount: '+400',
      type: 'credit',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 2,
      name: 'Arjun Rawat',
      time: '3:40 pm',
      amount: '+400',
      type: 'credit',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 3,
      name: 'Arjun Rawat',
      time: '3:40 pm',
      amount: '-500',
      type: 'debit',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 4,
      name: 'Arjun Rawat',
      time: '3:40 pm',
      amount: '-500',
      type: 'debit',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 5,
      name: 'Arjun Rawat',
      time: '3:40 pm',
      amount: '+500',
      type: 'credit',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 6,
      name: 'Arjun Rawat',
      time: '3:40 pm',
      amount: '+400',
      type: 'credit',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const getAmountColor = (type: string) => {
    return type === 'credit' ? '#10b981' : '#ef4444';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pay</Text>
        <TouchableOpacity>
          <MoreVertical size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardSection}>
          <Text style={styles.cardLabel}>Your Card</Text>
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.cardTitle}>Current Balance</Text>
                <Text style={styles.cardBalance}>₹4,570.80</Text>
              </View>
              <View style={styles.mastercardLogo}>
                <Text style={styles.logoText}>M</Text>
              </View>
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.cardNumber}>5294 2436 4780 9568</Text>
              <Text style={styles.cardExpiry}>12/26</Text>
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
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <Image
                source={{ uri: transaction.image }}
                style={styles.transactionImage}
              />
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionName}>{transaction.name}</Text>
                <Text style={styles.transactionTime}>{transaction.time}</Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: getAmountColor(transaction.type) },
                ]}>
                {transaction.amount}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.spacer} />
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
    color: '#000',
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
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 16,
  },
  cardNumber: {
    fontSize: 14,
    color: '#d1d5db',
    fontWeight: '500',
    letterSpacing: 2,
  },
  cardExpiry: {
    fontSize: 14,
    color: '#d1d5db',
    fontWeight: '600',
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
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  transactionImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#e5e7eb',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 11,
    color: '#9ca3af',
  },
  transactionAmount: {
    fontSize: 13,
    fontWeight: '700',
  },
  spacer: {
    height: 20,
  },
});
