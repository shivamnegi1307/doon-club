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

export default function EventScreen() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const events = [
    {
      id: 1,
      title: 'Dehradun Club',
      date: '12 - 14 Nov 2025',
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '₹1500',
    },
    {
      id: 2,
      title: 'Dehradun Club',
      date: '12 - 14 Nov 2025',
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '₹1500',
    },
    {
      id: 3,
      title: 'Dehradun Club',
      date: '12 - 14 Nov 2025',
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '₹1500',
    },
    {
      id: 4,
      title: 'Dehradun Club',
      date: '12 - 14 Nov 2025',
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '₹1500',
    },
    {
      id: 5,
      title: 'Dehradun Club',
      date: '12 - 14 Nov 2025',
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '₹1500',
    },
    {
      id: 6,
      title: 'Dehradun Club',
      date: '12 - 14 Nov 2025',
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '₹1500',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Events</Text>
        <TouchableOpacity>
          <MoreVertical size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.activeTabText,
            ]}>
            Upcoming events
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'past' && styles.activeTabText,
            ]}>
            Past events
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {events.map((event) => (
            <TouchableOpacity key={event.id} style={styles.eventCard}>
              <Image
                source={{ uri: event.image }}
                style={styles.eventImage}
              />
              <View style={styles.eventInfo}>
                <View style={styles.dateRow}>
                  <Text style={styles.dateIcon}>📅</Text>
                  <Text style={styles.dateText}>{event.date}</Text>
                </View>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDescription}>
                  Lorem ipsum Lorem ipsum...
                </Text>
                <Text style={styles.eventPrice}>{event.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  activeTab: {
    backgroundColor: '#f3f4f6',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#000',
  },
  eventsList: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  eventCard: {
    width: '47%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#e5e7eb',
  },
  eventInfo: {
    padding: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  dateIcon: {
    fontSize: 14,
  },
  dateText: {
    fontSize: 11,
    color: '#6b7280',
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 8,
  },
  eventPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f59e0b',
  },
});
