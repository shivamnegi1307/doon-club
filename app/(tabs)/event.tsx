import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import { useState, useEffect } from 'react';

interface Event {
  id: number;
  title: string;
  image: string;
  date: string;
  start_time: string;
  end_time: string;
  price: string;
  description: string | null;
  status: number;
  created_at: string;
  updated_at: string;
}

export default function EventScreen() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('https://doonclub.in/api/get-all-events');

      if (response.ok) {
        const result = await response.json();
        if (result.status && result.data) {
          setEvents(result.data);
        } else {
          setError('Failed to load events');
        }
      } else {
        setError('Failed to fetch events');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatPrice = (price: string) => {
    const priceNum = parseFloat(price);
    if (priceNum === 0) {
      return 'Free';
    }
    return `₹${priceNum}`;
  };

  const getImageUrl = (imagePath: string) => {
    return `https://doonclub.in/storage/${imagePath.replace('public/', '')}`;
  };

  const filterEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeTab === 'upcoming') {
      return events.filter(event => new Date(event.date) >= today);
    } else {
      return events.filter(event => new Date(event.date) < today);
    }
  };

  const filteredEvents = filterEvents();

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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0f4c8b" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchEvents}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {filteredEvents.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No {activeTab} events found
                </Text>
              </View>
            ) : (
              filteredEvents.map((event) => (
                <TouchableOpacity key={event.id} style={styles.eventCard}>
                  <Image
                    source={{ uri: getImageUrl(event.image) }}
                    style={styles.eventImage}
                  />
                  <View style={styles.eventInfo}>
                    <View style={styles.dateRow}>
                      <Text style={styles.dateIcon}>📅</Text>
                      <Text style={styles.dateText}>{formatDate(event.date)}</Text>
                    </View>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventDescription}>
                      {event.description || 'Event details coming soon...'}
                    </Text>
                    <Text style={styles.eventPrice}>{formatPrice(event.price)}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
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
  emptyContainer: {
    width: '100%',
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
