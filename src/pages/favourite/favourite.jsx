// import React from 'react';
// import { useFavorites } from '../../context/favcontext';

// const Favourite = () => {
//   const { favorites,removeFromFavorites } = useFavorites();

//   return (
//     <div>
//       <h2>Favorites</h2>

//       {/* List of favorite items */}
//       {favorites.map((favorite,index) => (

//         <div key={index}>
//           {console.log(favorite)}
//           <span>{favorite.title}</span>
//           {/* Button to remove from favorites */}
//           <button onClick={() => removeFromFavorites(favorite._id)}>Remove from Favorites</button>
//         </div>
//       ))}
//     </div>
//   );
// };
// export default Favourite;

import React from "react";
import { useFavorites } from "../../context/favcontext";
import { Link } from "react-router-dom";
import "./favourite.css";
const Favorite = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const PF = "http://localhost:5000/images/";
  return (
    <div className="favorite-container">
      {favorites.length === 0 ? (
        <p className="no-favorites-message">You have no favorite posts yet.</p>
      ) : (
        favorites.map((favorite, index) => (
          <div class="card" style={{ width: "18rem" }}>
            <img
              src={PF + favorite.photo}
              className="imgc card-img-top"
              alt="..."
            />
            <div class="card-body">
              <h5 class="card-title title">{favorite.title}</h5>
              <p class="card-text desc">{favorite.desc}</p>
              <button
                className="removeBtn"
                onClick={() => removeFromFavorites(favorite.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Favorite;
