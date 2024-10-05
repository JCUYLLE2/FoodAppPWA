import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '../components/Navbar';

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
      <Navbar />
      <h2>Feed</h2>
      <div>
        {posts.map((post, index) => (
          <div key={index}>
            <h3>{post.dishName}</h3>
            <p>Posted by: {post.userId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeedPage;
