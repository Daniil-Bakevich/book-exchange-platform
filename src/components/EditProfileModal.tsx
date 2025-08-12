"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/DTOs/User";

type FormErrors = {
  name?: string[];
  email?: string[];
  avatar?: string[];
};

export default function EditProfileModal({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setAvatar(user.avatar);
  }, [user]);

  const handleOpenModal = () => {
    setIsOpen(true);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const updatedData = {
      ...(name !== user.name && { name }),
      ...(email !== user.email && { email }),
      ...(avatar !== user.avatar && { avatar }),
    };

    if (Object.keys(updatedData).length === 0) {
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    const response = await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const result = await response.json();
      if (result.errors) {
        setErrors(result.errors);
      }
    } else {
      setIsOpen(false);
      router.refresh();
    }

    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
      >
        Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 input-style"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 input-style"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                  Avatar URL
                </label>
                <input
                  id="avatar"
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full mt-1 input-style"
                />
                {errors.avatar && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.avatar[0]}
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-4 space-x-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md bg-primary hover:bg-primary-700 disabled:bg-primary-400"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
