import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, enableIndexedDbPersistence } from 'firebase/firestore';
import { Container, Card, Alert } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import '../App.css';

// Offline persistence inschakelen voor Firestore
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.error('Offline persistence failed: multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.error('Offline persistence is not supported in this browser');
  }
});

function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!db) {
          setError('Database not initialized');
          return;
        }

        const querySnapshot = await getDocs(collection(db, 'posts'));
        const postsData = querySnapshot.docs.map((doc) => doc.data());
        setPosts(postsData);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to fetch posts. Please check your permissions.');
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Navbar />
      <Container className="mt-5 feed-container">
        <h2 className="feed-title">Feed</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="post-list">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <Card key={index} className="mb-3 post-card">
                <Card.Body>
                  {post.photoURL ? (
                    <img
                      src={post.photoURL}
                      alt={post.dishName}
                      className="post-image"
                    />
                  ) : (
                    <div className="post-image-placeholder">
                      No Image Available
                    </div>
                  )}
                  <Card.Title className="post-title">{post.dishName}</Card.Title>
                  <Card.Text>{post.description}</Card.Text>
                  <Card.Footer>
                    Posted by: {post.userName || 'Anonymous'}
                  </Card.Footer>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No posts available yet.</p>
          )}
        </div>
      </Container>
    </>
  );
}

export default FeedPage;
