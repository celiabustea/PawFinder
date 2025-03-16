import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator, Button } from 'react-native';
import { db } from './firebase';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import PostCard from './PostCard';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddPost = async () => {
    try {
      await addDoc(collection(db, 'posts'), {
        author: "user123",
        title: "Titlu nou",
        content: "Conținut postare...",
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Eroare la adăugarea postării:", error);
    }
  };

  if (loading) {
    return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4682A9" />
        </View>
    );
  }

  return (
      <View style={styles.screenContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>🐾 PawFinder</Text>
        </View>

        <Button title="Adaugă Postare" onPress={handleAddPost} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {posts.length > 0 ? (
              posts.map(post => (
                  <PostCard
                      key={post.id}
                      title={post.title}
                      author={post.author}
                      content={post.content}
                      timestamp={post.timestamp?.toDate()}
                  />
              ))
          ) : (
              <Text style={styles.noPosts}>Nu există postări momentan</Text>
          )}
        </ScrollView>
      </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F6F4EB',
  },
  header: {
    backgroundColor: '#4682A9',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerText: {
    color: '#F6F4EB',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F4EB',
  },
  noPosts: {
    color: '#4682A9',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default App;
