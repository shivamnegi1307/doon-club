import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import { ArrowLeft, MoreVertical, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function ReviewsScreen() {
  const router = useRouter();
  const [reviewText, setReviewText] = useState('');

  const reviews = [
    {
      id: 1,
      name: 'Arjun Rawat',
      rating: 4.5,
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      comment: 'Amazing! The room is good than the picture. Thanks for amazing experience!',
    },
    {
      id: 2,
      name: 'Deepok Singh',
      rating: 4.5,
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      comment: 'The service is on point and I really like the facilities. Good job!',
    },
    {
      id: 3,
      name: 'Rahul Negi',
      rating: 4.5,
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      comment: 'Amazing! The room is good than the picture. Thanks for amazing experience!',
    },
    {
      id: 4,
      name: 'Arjun Rawat',
      rating: 4.5,
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      comment: 'The service is on point and I really like the facilities. Good job!',
    },
    {
      id: 5,
      name: 'Deepok Singh',
      rating: 5.0,
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      comment: 'Facilities. Good job!',
    },
    {
      id: 6,
      name: 'Rahul Negi',
      rating: 4.5,
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      comment: 'Amazing! The room is good than the picture. Thanks for amazing experience!',
    },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          color={i < fullStars ? '#f59e0b' : '#d1d5db'}
          fill={i < fullStars ? '#f59e0b' : 'none'}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <TouchableOpacity>
          <MoreVertical size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.ratingSection}>
          <View style={styles.ratingCard}>
            <Text style={styles.ratingValue}>4.5</Text>
            <View style={styles.starsRow}>
              {renderStars(4.5)}
            </View>
            <Text style={styles.reviewCount}>Based on 532 reviews</Text>
          </View>

          <View style={styles.ratingBars}>
            {[5, 4, 3, 2, 1].map((stars) => {
              const barWidth = (Math.random() * 100).toFixed(0);
              return (
                <View key={stars} style={styles.barItem}>
                  <View
                    style={[
                      styles.bar,
                      {
                        width: `${barWidth}%` as any,
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.reviewsHeader}>
          <Text style={styles.reviewsTitle}>Reviews (532)</Text>
        </View>

        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewItem}>
            <Image
              source={{ uri: review.image }}
              style={styles.reviewerImage}
            />
            <View style={styles.reviewContent}>
              <View style={styles.reviewerInfo}>
                <Text style={styles.reviewerName}>{review.name}</Text>
                <View style={styles.starsRow}>
                  {renderStars(review.rating)}
                </View>
              </View>
              <Text style={styles.reviewText}>{review.comment}</Text>
            </View>
          </View>
        ))}

        <View style={styles.writeReviewSection}>
          <Text style={styles.writeReviewTitle}>Write a Review</Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="Type your review here..."
            placeholderTextColor="#d1d5db"
            multiline
            numberOfLines={4}
            value={reviewText}
            onChangeText={setReviewText}
          />
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
  ratingSection: {
    flexDirection: 'row',
    gap: 20,
    paddingVertical: 20,
  },
  ratingCard: {
    alignItems: 'center',
    gap: 8,
    flex: 0.4,
  },
  ratingValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  reviewCount: {
    fontSize: 11,
    color: '#6b7280',
  },
  ratingBars: {
    flex: 0.6,
    justifyContent: 'space-around',
  },
  barItem: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#0f4c8b',
    borderRadius: 2,
  },
  reviewsHeader: {
    marginTop: 20,
    marginBottom: 16,
  },
  reviewsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  reviewItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },
  reviewContent: {
    flex: 1,
  },
  reviewerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewerName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  reviewText: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  writeReviewSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  writeReviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#000',
    textAlignVertical: 'top',
  },
  spacer: {
    height: 20,
  },
});
