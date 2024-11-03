import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Container, Card, Alert } from 'react-bootstrap';
import { FaExternalLinkAlt } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import '../App.css';

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

        // Query om de posts te sorteren op `createdAt` in aflopende volgorde
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to fetch posts. Please check your permissions.');
      }
    };

    fetchPosts();
  }, []);

  const openLink = (url) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <Navbar />
      <Container className="mt-5 feed-container">
        <h2 className="feed-title">Feed</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="post-list">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} className="mb-3 post-card">
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
                  {post.recipeLink && (
                    <div
                      className="post-link-icon"
                      onClick={() => openLink(post.recipeLink)}
                      style={{ cursor: 'pointer', color: '#007bff', marginTop: '10px' }}
                    >
                      <FaExternalLinkAlt />
                      <span style={{ marginLeft: '5px' }}>Open Recipe</span>
                    </div>
                  )}
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
