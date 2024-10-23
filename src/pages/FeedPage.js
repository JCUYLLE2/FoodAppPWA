import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Verwijs naar je Firestore-initialisatie
import DishImage from './DishImage'; // Importeer het DishImage-component

function FeedPage() {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'dishes')); // Haal gerechten op uit Firestore
        const dishesArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDishes(dishesArray);
      } catch (error) {
        console.error('Error fetching dishes from Firestore:', error);
      }
    };

    fetchDishes();
  }, []);

  return (
    <div>
      {dishes.length === 0 ? (
        <p>Loading dishes...</p> // Toon een boodschap als er geen gerechten zijn opgehaald
      ) : (
        dishes.map((dish) => (
          <div key={dish.id}>
            <h3>{dish.name}</h3>
            <DishImage imagePath={dish.imagePath} /> {/* Laad dynamisch de afbeelding */}
          </div>
        ))
      )}
    </div>
  );
}

export default FeedPage;
