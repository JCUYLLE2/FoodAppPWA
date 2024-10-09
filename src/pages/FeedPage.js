import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Container, Card } from 'react-bootstrap';
import Navbar from '../components/Navbar'; // Voeg de Navbar import toe
import '../App.css';  // Voeg een CSS-bestand toe voor de responsieve stijlen

function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Controleer of de db correct is geïnitialiseerd
        if (!db) {
          setError('Database not initialized');
          return;
        }

        console.log('Fetching posts...'); // Log toegevoegd
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const postsData = querySnapshot.docs.map(doc => doc.data());
        console.log('Fetched posts:', postsData); // Log toegevoegd
        setPosts(postsData);
      } catch (err) {
        console.error('Error fetching posts:', err); // Log toegevoegd
        setError('Failed to fetch posts. Please check your permissions.');
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Navbar />  {/* Voeg de Navbar toe */}
      <Container className="mt-5 feed-container">
        <h2 className="feed-title">Feed</h2>
        {error && <p>{error}</p>}
        <div className="post-list">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <Card key={index} className="mb-3 post-card">
                <Card.Body>
                  {/* Weergeven van de afbeelding, als deze beschikbaar is */}
                  {post.photoURL && (
                    <img
                      src={post.photoURL}
                      alt={post.dishName}
                      className="post-image"
                    />
                  )}
                  <Card.Title className="post-title">{post.dishName}</Card.Title>
                  <Card.Text>{post.description}</Card.Text>
                  <Card.Footer>
                    Posted by: {post.userName || post.userEmail}
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
