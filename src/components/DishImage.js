import React, { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

function DishImage({ imagePath }) {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const storage = getStorage(); // Firebase Storage-initialisatie
    const imageRef = ref(storage, imagePath); // Het Firebase Storage pad naar de afbeelding

    // Ophalen van de download-URL
    getDownloadURL(imageRef)
      .then((url) => {
        setImageUrl(url); // Zet de afbeelding-URL
      })
      .catch((error) => {
        console.error("Error fetching image URL: ", error);
      });
  }, [imagePath]);

  return (
    <div>
      {imageUrl ? (
        <img src={imageUrl} alt="Dish" style={{ width: '300px', height: 'auto' }} />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
}

export default DishImage;
