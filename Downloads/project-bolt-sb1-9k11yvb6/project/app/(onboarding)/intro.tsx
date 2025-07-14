import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ViewToken,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { Smartphone, Users, Brain, CreditCard, ArrowRight, ArrowLeft, Leaf, ChartBar as BarChart3, MessageCircle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

const introSlides = [
  {
    id: '1',
    title: 'Welcome to KrishiMitra',
    subtitle: 'Your comprehensive agricultural assistance platform for smart farming',
    icon: Leaf,
    color: Colors.primary,
    gradient: ['#22C55E', '#16A34A'],
  },
  {
    id: '2',
    title: 'Smart Farm Monitoring',
    subtitle: 'Monitor your farm with IoT sensors and real-time data analytics',
    icon: BarChart3,
    color: Colors.secondary,
    gradient: ['#3B82F6', '#2563EB'],
  },
  {
    id: '3',
    title: 'Connect with Community',
    subtitle: 'Share knowledge, ask questions, and connect with fellow farmers',
    icon: Users,
    color: Colors.accent,
    gradient: ['#F97316', '#EA580C'],
  },
  {
    id: '4',
    title: 'AI-Powered Diagnosis',
    subtitle: 'Get instant crop disease diagnosis using advanced AI technology',
    icon: Brain,
    color: Colors.success,
    gradient: ['#10B981', '#059669'],
  },
  {
    id: '5',
    title: 'Financial Services',
    subtitle: 'Easy access to agricultural loans and financial services',
    icon: CreditCard,
    color: Colors.warning,
    gradient: ['#F59E0B', '#D97706'],
  },
];

export default function IntroScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]) {
      const newIndex = viewableItems[0].index || 0;
      setCurrentIndex(newIndex);
      
      // Animate slide transition
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0.7,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  };

  const nextSlide = () => {
    if (currentIndex < introSlides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/(onboarding)/language-selection');
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const skipIntro = () => {
    router.replace('/(onboarding)/language-selection');
  };

  const renderSlide = ({ item, index }: { item: typeof introSlides[0], index: number }) => {
    const IconComponent = item.icon;
    const isActive = index === currentIndex;
    
    return (
      <View style={[styles.slide, { backgroundColor: item.gradient[0] + '05' }]}>
        <Animated.View
          style={[
            styles.slideContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Animated Background Circles */}
          <View style={styles.backgroundElements}>
            <Animated.View 
              style={[
                styles.backgroundCircle,
                styles.circle1,
                { backgroundColor: item.gradient[0] + '10' }
              ]} 
            />
            <Animated.View 
              style={[
                styles.backgroundCircle,
                styles.circle2,
                { backgroundColor: item.gradient[1] + '08' }
              ]} 
            />
            <Animated.View 
              style={[
                styles.backgroundCircle,
                styles.circle3,
                { backgroundColor: item.gradient[0] + '06' }
              ]} 
            />
          </View>

          {/* Icon Container with Gradient */}
          <View style={[styles.iconContainer, { 
            backgroundColor: item.gradient[0],
            shadowColor: item.gradient[0],
          }]}>
            <View style={[styles.iconInner, { backgroundColor: item.gradient[1] + '20' }]}>
              <IconComponent size={60} color={Colors.text.inverse} strokeWidth={1.5} />
            </View>
          </View>

          {/* Content */}
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: item.color }]}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>

          {/* Feature Highlights */}
          <View style={styles.featuresContainer}>
            {index === 0 && (
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <View style={[styles.featureDot, { backgroundColor: item.color }]} />
                  <Text style={styles.featureText}>Real-time monitoring</Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={[styles.featureDot, { backgroundColor: item.color }]} />
                  <Text style={styles.featureText}>AI-powered insights</Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={[styles.featureDot, { backgroundColor: item.color }]} />
                  <Text style={styles.featureText}>Community support</Text>
                </View>
              </View>
            )}
            
            {index === 1 && (
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: item.color }]}>24/7</Text>
                  <Text style={styles.statLabel}>Monitoring</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: item.color }]}>IoT</Text>
                  <Text style={styles.statLabel}>Sensors</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: item.color }]}>Real-time</Text>
                  <Text style={styles.statLabel}>Data</Text>
                </View>
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    );
  };

  const renderPagination = () => (
    <View style={styles.pagination}>
      {introSlides.map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.paginationDot,
            {
              backgroundColor: index === currentIndex ? introSlides[currentIndex].color : Colors.gray[300],
              width: index === currentIndex ? 32 : 8,
              transform: [{
                scale: index === currentIndex ? 1.2 : 1
              }]
            }
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={skipIntro}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={introSlides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        style={styles.slideContainer}
      />

      {/* Pagination */}
      {renderPagination()}

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentIndex === 0 && styles.navButtonDisabled,
            { borderColor: introSlides[currentIndex].color }
          ]}
          onPress={prevSlide}
          disabled={currentIndex === 0}
        >
          <ArrowLeft 
            size={24} 
            color={currentIndex === 0 ? Colors.text.disabled : introSlides[currentIndex].color} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.nextButton,
            { backgroundColor: introSlides[currentIndex].color }
          ]} 
          onPress={nextSlide}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === introSlides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <ArrowRight size={20} color={Colors.text.inverse} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
  },
  skipText: {
    color: Colors.text.secondary,
    fontSize: 16,
    fontWeight: '500',
  },
  slideContainer: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    position: 'relative',
  },
  slideContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  backgroundElements: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: -40,
  },
  backgroundCircle: {
    position: 'absolute',
    borderRadius: 1000,
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    right: -150,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: 100,
    left: -100,
  },
  circle3: {
    width: 150,
    height: 150,
    top: height * 0.3,
    left: -75,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  iconInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 300,
  },
  featuresContainer: {
    minHeight: 80,
    justifyContent: 'center',
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  featureText: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    gap: 8,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray[300],
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  navButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: Colors.gray[400],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navButtonDisabled: {
    backgroundColor: Colors.gray[100],
    borderColor: Colors.gray[200],
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    color: Colors.text.inverse,
    fontSize: 18,
    fontWeight: '700',
  },
});