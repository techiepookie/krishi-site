import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  TextInput,
  Modal,
  Alert,
  Share,
} from 'react-native';
import { Plus, Heart, MessageCircle, Share2, MoveHorizontal as MoreHorizontal, MapPin, Send, Camera, X, CreditCard as Edit3 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/Colors';

interface Post {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    location: string;
  };
  content: string;
  images?: string[];
  category: 'Question' | 'Tips' | 'Success Story' | 'Market Info';
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  timestamp: Date;
  liked: boolean;
}

interface Status {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  image?: string;
  timestamp: Date;
  expiresAt: Date;
}

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
}

const mockPosts: Post[] = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'Rajesh Kumar',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      location: 'Punjab, India',
    },
    content: 'Great harvest this season! My wheat yield increased by 25% using organic fertilizers. Here are some tips that worked for me...',
    images: ['https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=400'],
    category: 'Success Story',
    tags: ['wheat', 'organic', 'fertilizer'],
    likes: 45,
    comments: 12,
    shares: 8,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    liked: false,
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Priya Sharma',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      location: 'Haryana, India',
    },
    content: 'How do you deal with pest control in tomato farming? I\'m facing some issues with my crop and looking for sustainable solutions.',
    category: 'Question',
    tags: ['tomato', 'pest-control', 'help'],
    likes: 23,
    comments: 18,
    shares: 3,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    liked: true,
  },
];

const mockStatuses: Status[] = [
  {
    id: '1',
    user: {
      name: 'Rajesh Kumar',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    },
    content: 'Just finished harvesting today! Great yield this season 🌾',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 21 * 60 * 60 * 1000),
  },
  {
    id: '2',
    user: {
      name: 'Priya Sharma',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    },
    content: 'Morning irrigation complete ✅',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000),
  },
];

export default function CommunityScreen() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [statuses, setStatuses] = useState<Status[]>(mockStatuses);
  const [refreshing, setRefreshing] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'post' | 'status'>('post');
  const [newContent, setNewContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<Post['category']>('Tips');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // Auto-remove expired statuses
  useEffect(() => {
    const interval = setInterval(() => {
      setStatuses(prev => prev.filter(status => status.expiresAt > new Date()));
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleCreateContent = (type: 'post' | 'status') => {
    setCreateType(type);
    setNewContent('');
    setSelectedImages([]);
    setShowCreateModal(true);
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Please allow access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Images],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      setSelectedImages(prev => [...prev, ...result.assets.map(asset => asset.uri)]);
    }
  };

  const handleCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Please allow access to your camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImages(prev => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const createContent = () => {
    if (!newContent.trim()) return;
    
    if (createType === 'post') {
      const newPost: Post = {
        id: Date.now().toString(),
        user: {
          id: 'current_user',
          name: 'You',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
          location: 'Your Location',
        },
        content: newContent,
        images: selectedImages.length > 0 ? selectedImages : undefined,
        category: newPostCategory,
        tags: [],
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: new Date(),
        liked: false,
      };
      
      setPosts(prev => [newPost, ...prev]);
    } else {
      const newStatus: Status = {
        id: Date.now().toString(),
        user: {
          name: 'You',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
        },
        content: newContent,
        image: selectedImages[0],
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };
      
      setStatuses(prev => [newStatus, ...prev]);
    }
    
    setNewContent('');
    setSelectedImages([]);
    setShowCreateModal(false);
    Alert.alert('Success', `${createType === 'post' ? 'Post' : 'Status'} created successfully`);
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m`;
    return 'Expired';
  };

  const toggleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleComment = (postId: string) => {
    setShowComments(postId);
  };

  const submitComment = () => {
    if (!commentText.trim() || !showComments) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      },
      content: commentText,
      timestamp: new Date(),
    };

    setComments(prev => ({
      ...prev,
      [showComments]: [...(prev[showComments] || []), newComment],
    }));

    // Update comment count
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === showComments
          ? { ...post, comments: post.comments + 1 }
          : post
      )
    );

    setCommentText('');
  };

  const handleShare = async (post: Post) => {
    try {
      await Share.share({
        message: `Check out this post from ${post.user.name}: ${post.content}`,
        title: 'KrishiMitra Community Post',
      });

      // Update share count
      setPosts(prevPosts =>
        prevPosts.map(p =>
          p.id === post.id
            ? { ...p, shares: p.shares + 1 }
            : p
        )
      );
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Question': return Colors.secondary;
      case 'Tips': return Colors.primary;
      case 'Success Story': return Colors.success;
      case 'Market Info': return Colors.warning;
      default: return Colors.gray[500];
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const renderStatus = ({ item }: { item: Status }) => (
    <View style={styles.statusCard}>
      <Image source={{ uri: item.user.avatar }} style={styles.statusAvatar} />
      <View style={styles.statusContent}>
        <Text style={styles.statusUser}>{item.user.name}</Text>
        <Text style={styles.statusText}>{item.content}</Text>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.statusImage} />
        )}
        <Text style={styles.statusTime}>
          {getTimeAgo(item.timestamp)} • Expires in {getTimeRemaining(item.expiresAt)}
        </Text>
      </View>
    </View>
  );

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <View style={styles.userMeta}>
            <MapPin size={12} color={Colors.text.secondary} />
            <Text style={styles.userLocation}>{item.user.location}</Text>
            <Text style={styles.timestamp}>• {getTimeAgo(item.timestamp)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MoreHorizontal size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Category Badge */}
      <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) + '20' }]}>
        <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>
          {item.category}
        </Text>
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{item.content}</Text>

      {/* Post Images */}
      {item.images && item.images.length > 0 && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.images[0] }} style={styles.postImage} />
        </View>
      )}

      {/* Tags */}
      <View style={styles.tagsContainer}>
        {item.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
      </View>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => toggleLike(item.id)}
        >
          <Heart
            size={20}
            color={item.liked ? Colors.error : Colors.text.secondary}
            fill={item.liked ? Colors.error : 'none'}
          />
          <Text style={[styles.actionText, item.liked && { color: Colors.error }]}>
            {item.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => handleComment(item.id)}>
          <MessageCircle size={20} color={Colors.text.secondary} />
          <Text style={styles.actionText}>{item.comments + (comments[item.id]?.length || 0)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => handleShare(item)}>
          <Share2 size={20} color={Colors.text.secondary} />
          <Text style={styles.actionText}>{item.shares}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
      </View>

      {/* Status Section */}
      {statuses.length > 0 && (
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>24h Status Updates</Text>
          <FlatList
            data={statuses}
            renderItem={renderStatus}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.statusList}
          />
        </View>
      )}

      {/* Posts Feed */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.feedContainer}
      />

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => {
          Alert.alert(
            'Create Content',
            'What would you like to create?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Status (24h)', onPress: () => handleCreateContent('status') },
              { text: 'Post', onPress: () => handleCreateContent('post') },
            ]
          );
        }}
      >
        <Edit3 size={24} color={Colors.text.inverse} />
      </TouchableOpacity>

      {/* Create Content Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Create {createType === 'post' ? 'Post' : 'Status'}
            </Text>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <X size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TextInput
              style={styles.contentInput}
              placeholder={createType === 'post' ? "What's on your mind?" : "Share what you're doing..."}
              value={newContent}
              onChangeText={setNewContent}
              multiline
              numberOfLines={4}
            />

            {createType === 'status' && (
              <Text style={styles.statusNote}>
                Status will be visible for 24 hours
              </Text>
            )}

            {createType === 'post' && (
              <View style={styles.categorySelector}>
                <Text style={styles.categoryLabel}>Category:</Text>
                <View style={styles.categoryOptions}>
                  {(['Question', 'Tips', 'Success Story', 'Market Info'] as const).map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryOption,
                        newPostCategory === category && styles.categoryOptionSelected,
                      ]}
                      onPress={() => setNewPostCategory(category)}
                    >
                      <Text
                        style={[
                          styles.categoryOptionText,
                          newPostCategory === category && styles.categoryOptionTextSelected,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Image Selection */}
            <View style={styles.imageSection}>
              <Text style={styles.imageSectionTitle}>Add Images</Text>
              <View style={styles.imageActions}>
                <TouchableOpacity style={styles.imageActionButton} onPress={handleCamera}>
                  <Camera size={20} color={Colors.primary} />
                  <Text style={styles.imageActionText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imageActionButton} onPress={handleImagePicker}>
                  <Text style={styles.imageActionText}>Gallery</Text>
                </TouchableOpacity>
              </View>
              
              {selectedImages.length > 0 && (
                <View style={styles.selectedImages}>
                  {selectedImages.map((image, index) => (
                    <View key={index} style={styles.selectedImageContainer}>
                      <Image source={{ uri: image }} style={styles.selectedImage} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}
                      >
                        <X size={16} color={Colors.text.inverse} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[styles.submitButton, !newContent.trim() && styles.submitButtonDisabled]}
              onPress={createContent}
              disabled={!newContent.trim()}
            >
              <Text style={styles.submitButtonText}>
                Create {createType === 'post' ? 'Post' : 'Status'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Comments Modal */}
      <Modal
        visible={!!showComments}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.commentsContainer}>
          <View style={styles.commentsHeader}>
            <Text style={styles.commentsTitle}>Comments</Text>
            <TouchableOpacity onPress={() => setShowComments(null)}>
              <X size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments[showComments || ''] || []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Image source={{ uri: item.user.avatar }} style={styles.commentAvatar} />
                <View style={styles.commentContent}>
                  <Text style={styles.commentUser}>{item.user.name}</Text>
                  <Text style={styles.commentText}>{item.content}</Text>
                  <Text style={styles.commentTime}>{getTimeAgo(item.timestamp)}</Text>
                </View>
              </View>
            )}
            style={styles.commentsList}
          />

          <View style={styles.commentInput}>
            <TextInput
              style={styles.commentTextInput}
              placeholder="Write a comment..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity
              style={styles.commentSendButton}
              onPress={submitComment}
              disabled={!commentText.trim()}
            >
              <Send size={20} color={Colors.text.inverse} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  statusSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  statusList: {
    paddingHorizontal: 16,
  },
  statusCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    width: 200,
  },
  statusAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  statusContent: {
    flex: 1,
  },
  statusUser: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statusImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 4,
  },
  statusTime: {
    fontSize: 10,
    color: Colors.text.secondary,
  },
  feedContainer: {
    paddingVertical: 8,
  },
  postCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userLocation: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  moreButton: {
    padding: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  imageContainer: {
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 20,
    minHeight: 100,
  },
  statusNote: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  categorySelector: {
    marginBottom: 20,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  categoryOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryOptionText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  categoryOptionTextSelected: {
    color: Colors.text.inverse,
  },
  imageSection: {
    marginBottom: 20,
  },
  imageSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  imageActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  imageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    gap: 8,
  },
  imageActionText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  selectedImages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedImageContainer: {
    position: 'relative',
  },
  selectedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.gray[400],
  },
  submitButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  commentsContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    gap: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentContent: {
    flex: 1,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  commentTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  commentSendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});