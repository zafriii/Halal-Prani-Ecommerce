import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating, onRate, editable }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((val) => (
        <FaStar
          className="star"
          key={val}
          size={20}
          onClick={() => editable && onRate(val)}
          onMouseEnter={() => editable && setHovered(val)}
          onMouseLeave={() => editable && setHovered(null)}
          style={{
            cursor: editable ? "pointer" : "default",
            marginRight: 5,
            transition: "color 0.2s",
            color:
              hovered !== null
                ? val <= hovered
                  ? "#e0a010"
                  : "#ccc"
                : val <= rating
                ? "#fabb05"
                : "#ccc",
          }}
        />
      ))}
    </div>
  );
};

export default StarRating;
