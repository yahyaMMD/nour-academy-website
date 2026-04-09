'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/categories/${id}`);
        if (!res.ok) throw new Error('Failed to fetch category');
        const data = await res.json();
        setName(data.name);
        setDescription(data.description || '');
      } catch (error) {
        toast.error('Failed to load category' + (error instanceof Error ? `: ${error.message}` : ''));
        router.push('/admin/categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) throw new Error('Failed to update category');
      toast.success('Category updated');
      router.push('/admin/categories');
    } catch (err) {
      toast.error('Update failed' + (err instanceof Error ? `: ${err.message}` : ''));
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete category');
      toast.success('Category deleted');
      router.push('/admin/categories');
    } catch (err) {
      toast.error('Delete failed' + (err instanceof Error ? `: ${err.message}` : ''));
    }
  };

if (loading) {
  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded animate-pulse space-y-6">
      <div className="h-6 bg-gray-200 rounded w-1/2" />
      <div className="space-y-4">
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
          <div className="h-10 bg-gray-100 rounded" />
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
          <div className="h-20 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="flex gap-4 pt-4">
        <div className="h-10 bg-gray-200 rounded w-24" />
        <div className="h-10 bg-gray-200 rounded w-24" />
      </div>
    </div>
  );
}

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Update
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
          <Link
            href="/admin/categories"
            className="ml-auto underline text-gray-600 hover:text-gray-800"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
