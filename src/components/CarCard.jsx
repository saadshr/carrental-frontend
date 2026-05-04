import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const unsplashFor = (brand, model) => {
  const key = `${brand} ${model}`.toLowerCase();
  if (key.includes('dacia') || key.includes('logan')) return 'https://images.unsplash.com/photo-1542367597-9fb9f1d9d6a6?auto=format&fit=crop&w=1200&q=60';
  if (key.includes('mercedes') || key.includes('classe c')) return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=60';
  if (key.includes('renault') || key.includes('clio')) return 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1200&q=60';
  // fallback
  return 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=60';
}

function CarCard({ car }) {
  const defaultImg = car.image || unsplashFor(car.brand, car.model);
  const [src, setSrc] = useState(defaultImg);

  const badgeColor = car.status === 'available' ? 'bg-emerald-500' : 'bg-rose-500';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group"
    >
      <div className="sr-card overflow-hidden">
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
          <img src={src} alt={`${car.brand} ${car.model}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={() => setSrc(unsplashFor(car.brand, car.model))} />
          <div className={`absolute top-3 right-3 text-white text-xs font-semibold px-3 py-1 rounded-full ${badgeColor} shadow-lg`}>
            {car.status === 'available' ? 'Disponible' : 'Indisponible'}
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500">
            <div className="absolute left-0 top-0 w-48 h-full bg-gradient-to-r from-white/60 via-white/20 to-transparent transform -translate-x-24 rotate-12 animate-[shine_1.2s_infinite]" />
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h5 className="text-xl font-bold text-slate-900">{car.brand} {car.model}</h5>
              <p className="mt-1 h-10 overflow-hidden text-sm leading-5 text-slate-500">{car.description}</p>
            </div>
            <span className="sr-badge-neutral shrink-0">{car.type}</span>
          </div>

          <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
            <div>
              <div className="text-xs font-semibold uppercase text-slate-400">Capacité</div>
              <div className="text-sm font-semibold text-slate-700">{car.seats} places</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold uppercase text-slate-400">Par jour</div>
              <div className="text-2xl font-black text-emerald-600">{car.price_per_day} DH</div>
            </div>
          </div>

          <Link
            to={`/cars/${car.id}`}
            className={`mt-5 flex w-full items-center justify-center rounded-md px-4 py-3 text-center font-bold transition ${
              car.status === 'available'
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {car.status === 'available' ? 'Réserver' : 'Voir détails'}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default CarCard;
