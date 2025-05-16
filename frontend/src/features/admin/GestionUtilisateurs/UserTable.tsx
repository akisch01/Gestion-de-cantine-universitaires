import React, { useState, useEffect } from "react";
import { adminApi } from "../../../api/admin";
import { User } from "../../../types/api";
import { DataTable } from "../../../components/shared/DataTable";

export const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminApi.getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("Erreur lors de la récupération des utilisateurs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (user: User) => {
    try {
      await adminApi.updateUser(user.id, user);
      fetchUsers();
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", err);
      alert("Erreur lors de la mise à jour de l'utilisateur");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await adminApi.deleteUser(userId);
        fetchUsers();
      } catch (err) {
        console.error("Erreur lors de la suppression de l'utilisateur:", err);
        alert("Erreur lors de la suppression de l'utilisateur");
      }
    }
  };

  const columns = [
    {
      header: "Nom",
      accessor: "nom" as keyof User,
    },
    {
      header: "Prénom",
      accessor: "prenom" as keyof User,
    },
    {
      header: "Email",
      accessor: "email" as keyof User,
    },
    {
      header: "Rôle",
      accessor: "role" as keyof User,
      render: (user: User) => (
        <select
          value={user.role}
          onChange={(e) =>
            handleUpdateUser({ ...user, role: e.target.value as "etudiant" | "admin" })
          }
          className="px-2 py-1 border rounded"
        >
          <option value="etudiant">Étudiant</option>
          <option value="admin">Admin</option>
        </select>
      ),
    },
    {
      header: "Actions",
      accessor: "id" as keyof User,
      render: (user: User) => (
        <div className="space-x-2">
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Gestion des utilisateurs
      </h2>
      <DataTable
        data={users}
        columns={columns}
        onRowClick={(user) => console.log("User clicked:", user)}
      />
    </div>
  );
};