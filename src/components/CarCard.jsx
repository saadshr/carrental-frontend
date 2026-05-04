import React from 'react';
import { motion } from 'framer-motion';

const unsplashFor = (brand, model) => {
  const key = `${brand} ${model}`.toLowerCase();
  if (key.includes('dacia') || key.includes('logan')) return 'https://images.unsplash.com/photo-1542367597-9fb9f1d9d6a6?auto=format&fit=crop&w=1200&q=60';
  if (key.includes('mercedes') || key.includes('classe c')) return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=60';
  if (key.includes('renault') || key.includes('clio')) return 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1200&q=60';
  // fallback
  return 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=60';
}

function CarCard({ car }) {
  const img = car.image || unsplashFor(car.brand, car.model);

  const badgeColor = car.status === 'available' ? 'bg-emerald-500' : 'bg-rose-500';

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group"
    >
      <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white/60 backdrop-blur-md">
        <div className="relative">
          <img src={img} alt={`${car.brand} ${car.model}`} className="w-full h-48 object-cover" />
          <div className={`absolute top-3 right-3 text-white text-xs font-semibold px-3 py-1 rounded-full ${badgeColor} shadow-lg`}>
            {car.status === 'available' ? 'Disponible' : 'Indisponible'}
          </div>
          {/* shine effect */}
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500">
            <div className="absolute left-0 top-0 w-48 h-full bg-gradient-to-r from-white/60 via-white/20 to-transparent transform -translate-x-24 rotate-12 animate-[shine_1.2s_infinite]" />
          </div>
        </div>

        <div className="p-4">
          <h5 className="text-lg font-semibold text-slate-800">{car.brand} {car.model}</h5>
          <p className="text-sm text-slate-500 mt-1 max-h-10 overflow-hidden">{car.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm text-slate-600">{car.seats} places</div>
            <div className="text-lg font-bold text-emerald-600">{car.price_per_day} DH</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CarCard;
