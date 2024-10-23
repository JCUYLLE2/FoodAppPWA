import React, { useEffect, useState } from 'react';
import { getImageUrl } from './firebaseConfig';

const FeedPage = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDishes = async () => {
      // Fetch dishes and set state
      const fetchedDishes = await fetchDishesFromAPI(); // Replace with actual fetch function
      const dishesWithUrls = await Promise.all(
        fetchedDishes.map(async (dish) => {
          if (dish.imagePath) {
            dish.imageUrl = await getImageUrl(dish.imagePath);
          }
          return dish;
        })
      );
      setDishes(dishesWithUrls);
      setLoading(false);
    };

    fetchDishes();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading dishes...</p>
      ) : (
        dishes.map((dish) => (
          <div key={dish.id}>
            <h3>{dish.name}</h3>
            {dish.imageUrl ? (
              <img
                src={dish.imageUrl}
                alt={dish.name}
              />
            ) : (
              <p>No image available</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default FeedPage;