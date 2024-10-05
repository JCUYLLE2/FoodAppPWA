import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Container, Card } from 'react-bootstrap';
import Navbar from '../components/Navbar';  // Zorg ervoor dat de Navbar wordt geïmporteerd

function FeedPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const postsData = querySnapshot.docs.map(doc => doc.data());
      setPosts(postsData);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <Container className="mt-5">
        <h2>Feed</h2>
        <div className="post-list">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <Card key={index} className="mb-3">
                <Card.Body>
                  <Card.Title>{post.dishName}</Card.Title>
                  <Card.Text>{post.description}</Card.Text>
                  <Card.Footer>Posted by: {post.userEmail}</Card.Footer>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No posts available yet.</p>
          )}
        </div>
      </Container>

      {/* Voeg de Navbar onderaan toe */}
      <Navbar />
    </div>
  );
}

export default FeedPage;
