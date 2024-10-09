import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Container, Card } from 'react-bootstrap';
import Navbar from '../components/Navbar'; // Voeg de Navbar import toe

function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
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
      <Container className="mt-5">
        <h2>Feed</h2>
        {error && <p>{error}</p>}
        <div className="post-list">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <Card key={index} className="mb-3">
                <Card.Body>
                  <Card.Title>{post.dishName}</Card.Title>
                  <Card.Text>{post.description}</Card.Text>
                  <Card.Footer>Posted by: {post.userName}</Card.Footer>
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
