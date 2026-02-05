"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  User,
  Pencil,
  Trash,
  Check,
  X,
  Eye,
  EyeSlash,
} from "@phosphor-icons/react";

interface UserData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    rsvps: number;
  };
}

interface EditUserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
}

export function AdminUserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<EditUserData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        setError("Failed to load users");
      }
    } catch {
      setError("An error occurred while loading users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: UserData) => {
    setEditingUser({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive,
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleUpdate = async () => {
    if (!editingUser) return;

    setIsUpdating(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingUser),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers((prev) =>
          prev.map((user) =>
            user.id === editingUser.id ? { ...user, ...data.user } : user
          )
        );
        setEditingUser(null);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update user");
      }
    } catch {
      alert("An error occurred while updating user");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(userId);
    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to delete user");
      }
    } catch {
      alert("An error occurred while deleting user");
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-gray-600">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={fetchUsers} className="bg-[#7f5539] text-white">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#7f5539] mb-4">
          User Management
        </h1>
        <p className="text-lg text-gray-600">
          Manage user accounts, edit information, and control access
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RSVPs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser?.id === user.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editingUser.firstName}
                          onChange={(e) =>
                            setEditingUser((prev) =>
                              prev
                                ? { ...prev, firstName: e.target.value }
                                : null
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="First Name"
                        />
                        <input
                          type="text"
                          value={editingUser.lastName}
                          onChange={(e) =>
                            setEditingUser((prev) =>
                              prev
                                ? { ...prev, lastName: e.target.value }
                                : null
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Last Name"
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{user.username}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser?.id === user.id ? (
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) =>
                          setEditingUser((prev) =>
                            prev ? { ...prev, email: e.target.value } : null
                          )
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Email"
                      />
                    ) : (
                      <div className="text-sm text-gray-900">{user.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser?.id === user.id ? (
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingUser.isActive}
                          onChange={(e) =>
                            setEditingUser((prev) =>
                              prev
                                ? { ...prev, isActive: e.target.checked }
                                : null
                            )
                          }
                          className="mr-2"
                        />
                        <span className="text-sm">Active</span>
                      </label>
                    ) : (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeSlash className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user._count.rsvps}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingUser?.id === user.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdate}
                          disabled={isUpdating}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          title="Save"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900"
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={isDeleting === user.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <User size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No users found
          </h3>
          <p className="text-gray-500">No users have registered yet.</p>
        </div>
      )}
    </div>
  );
}
