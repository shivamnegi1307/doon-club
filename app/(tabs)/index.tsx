import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { userData } = useAuth();

  return (
    <ScrollView style={styles.container}>
      {/* ---------- Header ---------- */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
            }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{userData?.profile.name || 'User'}</Text>
        </View>

        <TouchableOpacity>
          <Bell size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* ---------- Banner Image ---------- */}
      <View style={styles.banner}>
        <ImageBackground
          source={require('../../assets/images/wel-to-dc.png')}
          style={styles.bannerImageBg}
          imageStyle={styles.imageStyle}
        />
      </View>

      {/* ---------- Grid Menu ---------- */}
      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(tabs)/bill')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#ef4444' }]}>
            <Text style={styles.iconText}>💳</Text>
          </View>
          <Text style={styles.cardText}>Pay Bill</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <View style={[styles.iconContainer, { backgroundColor: '#8b5cf6' }]}>
            <Text style={styles.iconText}>🔔</Text>
          </View>
          <Text style={styles.cardText}>BUZZ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(tabs)/pay')}>
          <View style={[styles.iconContainer, { backgroundColor: '#ef4444' }]}>
            <Text style={styles.iconText}>💰</Text>
          </View>
          <Text style={styles.cardText}>Revenue Card</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <View style={[styles.iconContainer, { backgroundColor: '#ef4444' }]}>
            <Text style={styles.iconText}>👔</Text>
          </View>
          <Text style={styles.cardText}>Director</Text>
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

  /* ---------- Header ---------- */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },

  /* ---------- Banner ---------- */
  banner: {
    margin: 16,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerImageBg: {
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    resizeMode: 'cover',
  },

  /* ---------- Grid ---------- */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  card: {
    width: '47%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 32,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
