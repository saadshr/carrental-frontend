import React from 'react';

function CarCard({ car }) {
  return (
    <div>
      <h2>{car.brand} {car.model}</h2>
      <p>{car.description}</p>
    </div>
  );
}

export default CarCard;
