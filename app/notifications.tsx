import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    newEvent: true,
    message: true,
    payment: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Messages Notifications</Text>
        </View>

        <TouchableOpacity style={styles.notificationItem}>
          <View style={styles.notificationLeft}>
            <Text style={styles.notificationLabel}>New Event</Text>
          </View>
          <Switch
            value={notifications.newEvent}
            onValueChange={() => toggleNotification('newEvent')}
            trackColor={{ false: '#e5e7eb', true: '#0f4c8b' }}
            thumbColor="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.notificationItem}>
          <View style={styles.notificationLeft}>
            <Text style={styles.notificationLabel}>Message</Text>
          </View>
          <Switch
            value={notifications.message}
            onValueChange={() => toggleNotification('message')}
            trackColor={{ false: '#e5e7eb', true: '#0f4c8b' }}
            thumbColor="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.notificationItem}>
          <View style={styles.notificationLeft}>
            <Text style={styles.notificationLabel}>Payment</Text>
          </View>
          <Switch
            value={notifications.payment}
            onValueChange={() => toggleNotification('payment')}
            trackColor={{ false: '#e5e7eb', true: '#0f4c8b' }}
            thumbColor="#fff"
          />
        </TouchableOpacity>
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
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  spacer: {
    width: 24,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  notificationLeft: {
    flex: 1,
  },
  notificationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
});
