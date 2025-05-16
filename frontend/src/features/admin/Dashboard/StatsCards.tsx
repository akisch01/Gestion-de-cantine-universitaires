import React, { useEffect, useState } from "react";
import { adminApi } from "../../../api/admin";

interface Stats {
  totalReservations: number;
  totalPlats: number;
  totalUsers: number;
  revenue: number;
}

export const StatsCards: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalReservations: 0,
    totalPlats: 0,
    totalUsers: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getStats();
        setStats(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Réservations",
      value: stats.totalReservations,
      icon: "📊",
      color: "bg-blue-500",
    },
    {
      title: "Plats",
      value: stats.totalPlats,
      icon: "🍽️",
      color: "bg-green-500",
    },
    {
      title: "Utilisateurs",
      value: stats.totalUsers,
      icon: "👥",
      color: "bg-purple-500",
    },
    {
      title: "Revenus",
      value: stats.revenue !== undefined ? `${stats.revenue.toFixed(2)} fcfa` : "0.00 fcfa",
      icon: "💰",
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.color} p-6 rounded-lg shadow-md text-white`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-75">{card.title}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
            <span className="text-3xl">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
};