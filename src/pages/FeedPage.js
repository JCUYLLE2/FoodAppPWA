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
      <Container className="mt-5" style={{ marginBottom: '80px' }}>  {/* Voeg marge onderaan toe */}
        <h2>Feed</h2>
        {error && <p>{error}</p>}
        <div className="post-list">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <Card key={index} className="mb-3">
                <Card.Body>
                  {/* Weergeven van de afbeelding, als deze beschikbaar is */}
                  {post.photoURL && (
                    <img
                      src={post.photoURL}
                      alt={post.dishName}
                      style={{
                        width: '100%', // Zorg dat de afbeelding de breedte van de container vult
                        maxWidth: '300px', // Maximale breedte om de afbeelding te verkleinen
                        height: 'auto', // Zorg dat de hoogte automatisch wordt aangepast voor de verhoudingen
                        marginBottom: '15px',
                        display: 'block',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                      }}
                    />
                  )}
                  <Card.Title>{post.dishName}</Card.Title>
                  <Card.Text>{post.description}</Card.Text>
                  <Card.Footer>
                    Posted by: {post.userName || post.userEmail} {/* Weergeven van gebruikersnaam of email */}
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
