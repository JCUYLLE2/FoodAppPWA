import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import Navbar from '../components/Navbar';

function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check of de gebruiker is ingelogd
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Navbar />
      {user ? (
        <div>
          <h2>Welcome, {user.email}</h2>
          {/* Voeg hier andere profielinformatie toe */}
        </div>
      ) : (
        <h2>You are not logged in</h2>
      )}
    </div>
  );
}

export default ProfilePage;
