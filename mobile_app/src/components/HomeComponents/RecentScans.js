import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, ScrollView, Dimensions } from 'react-native';
import Icon from '../Icon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function RecentScans({ items = [], onPressItem }) {
  const hasItems = items && items.length > 0;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>RECENT SCANS</Text>

      {hasItems ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContent}
        >
          {items.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => onPressItem && onPressItem(item)}
            >
              {/* Image area */}
              <View style={styles.imageWrapper}>
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Icon
                      name="image-outline"
                      family="Ionicons"
                      size={32}
                      color="#9CA3AF"
                    />
                    <Text style={styles.placeholderText}>No preview</Text>
                  </View>
                )}

                {/* Top-right icon column */}
                <View style={styles.iconBarTopRight}>
                  <TouchableOpacity style={styles.iconButton}>
                    <Icon name="heart-outline" family="Ionicons" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}>
                    <Icon name="eye-outline" family="Ionicons" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Bottom white strip */}
              <View style={styles.infoStrip}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title || 'Untitled scan'}
                </Text>
                <Text style={styles.date}>
                  {item.date || 'Just now'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyCard}>
          <Icon name="folder-open-outline" family="Ionicons" size={28} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No scans yet</Text>
          <Text style={styles.emptySubtitle}>Your recent scans will appear here.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    paddingHorizontal: 8,
    marginBottom: 10,
    letterSpacing: 0.8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 14,
    width: SCREEN_WIDTH * 0.75,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
      },
    }),
  },
  horizontalContent: {
    paddingRight: 4,
  },
  imageWrapper: {
    height: 160,
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  placeholderText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  iconBarTopRight: {
    position: 'absolute',
    right: 10,
    top: 10,
    flexDirection: 'column',
    gap: 8,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(15,23,42,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoStrip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
      },
    }),
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});
