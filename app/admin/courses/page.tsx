'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

type Course = {
  id: string;
  title: string;
  instructor: string;
  date: string;
  featured: boolean;
  inFront: boolean;
  image?: string;
  location: string;
  price: number;
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/courses?all=true');

        if (!response.ok) {
          throw new Error('تعذر جلب الدورةs');
        }

        const data = await response.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('ØªØ¹Ø°Ø± ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ø¯ÙˆØ±Ø§Øª.');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const deleteCourse = async (id: string) => {
    if (deletingId) return;

    try {
      setDeletingId(id);
      const response = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      setCourses(courses.filter(course => course.id !== id));
      toast.success('ØªÙ… Ø­Ø°Ù Ø§Ù„Ø¯ÙˆØ±Ø© Ø¨Ù†Ø¬Ø§Ø­');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('ØªØ¹Ø°Ø± Ø­Ø°Ù Ø§Ù„Ø¯ÙˆØ±Ø©.');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleStatus = async (id: string, field: 'featured' | 'inFront', currentStatus: boolean) => {
    if (updatingId) return;

    try {
      setUpdatingId(id);
      const response = await fetch(`/api/courses/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update course');
      }

      setCourses(courses.map(course =>
        course.id === id ? { ...course, [field]: !currentStatus } : course
      ));
      toast.success('ØªÙ… ØªØ­Ø¯ÙŠØ« Ø­Ø§Ù„Ø© Ø§Ù„Ø¯ÙˆØ±Ø©');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('ØªØ¹Ø°Ø± ØªØ­Ø¯ÙŠØ« Ø­Ø§Ù„Ø© Ø§Ù„Ø¯ÙˆØ±Ø©.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={`skeleton-${i}`} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--brand-ink)]">Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø¯ÙˆØ±Ø§Øª</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <Link href="/admin/categories/new">
            <Button className="bg-[var(--brand-primary)] hover:bg-[#236d90] text-white">
              <Plus className="mr-2 h-4 w-4" />
              Ø¥Ø¶Ø§ÙØ© ÙØ¦Ø©
            </Button>
          </Link>
          <Link href="/admin/courses/new">
            <Button className="bg-[var(--brand-primary)] hover:bg-[#236d90] text-white">
              <Plus className="mr-2 h-4 w-4" />
              Ø¥Ø¶Ø§ÙØ© Ø¯ÙˆØ±Ø©
            </Button>
          </Link>
          <Link href="/admin/course-images">
            <Button className="bg-[var(--brand-primary)] hover:bg-[#236d90] text-white">
              <Plus className="mr-2 h-4 w-4" />
              Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„ØµÙˆØ±
            </Button>
          </Link>
          <Link href="/admin/registration-contact">
            <Button className="bg-[var(--brand-primary)] hover:bg-[#236d90] text-white">
              <Plus className="mr-2 h-4 w-4" />
              إعدادات تواصل التسجيل
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ÙƒÙ„ Ø§Ù„Ø¯ÙˆØ±Ø§Øª</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ø§Ù„Ø¹Ù†ÙˆØ§Ù†</TableHead>
                <TableHead>Ø§Ù„Ù…Ø¯Ø±Ø³</TableHead>
                <TableHead>Ø§Ù„ØªØ§Ø±ÙŠØ®</TableHead>
                <TableHead>Ø§Ù„Ù…ÙƒØ§Ù†</TableHead>
                <TableHead>Ø§Ù„Ø³Ø¹Ø±</TableHead>
                <TableHead>Ø§Ù„Ø­Ø§Ù„Ø©</TableHead>
                <TableHead className="text-right">Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <TableRow key={`course-${course.id}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {course.image && (
                          <div className="relative h-10 w-10 overflow-hidden rounded-md">
                            <Image
                              src={course.image}
                              alt={course.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span>{course.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{course.instructor}</TableCell>
                    <TableCell>
                      {new Date(course.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>{course.location}</TableCell>
                    <TableCell>DA{course.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Badge
                          variant={course.featured ? 'default' : 'secondary'}
                          className={`cursor-pointer hover:opacity-80 transition-opacity${updatingId === course.id ? ' opacity-60 pointer-events-none' : ''}`}
                          onClick={() => {
                            if (updatingId !== course.id) {
                              toggleStatus(course.id, 'featured', course.featured);
                            }
                          }}
                        >
                          {course.featured ? 'Ù…Ù…ÙŠØ²Ø©' : 'Ø¹Ø§Ø¯ÙŠØ©'}
                          {updatingId === course.id && <span className="ml-2">...</span>}
                        </Badge>
                        <Badge
                          variant={course.inFront ? 'default' : 'secondary'}
                          className={`cursor-pointer hover:opacity-80 transition-opacity${updatingId === course.id ? ' opacity-60 pointer-events-none' : ''}`}
                          onClick={() => {
                            if (updatingId !== course.id) {
                              toggleStatus(course.id, 'inFront', course.inFront);
                            }
                          }}
                        >
                          {course.inFront ? 'ØªØ¸Ù‡Ø± ÙÙŠ Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©' : 'Ù…Ø®ÙÙŠØ© Ù…Ù† Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©'}
                          {updatingId === course.id && <span className="ml-2">...</span>}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/admin/courses/${course.id}/`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteCourse(course.id)}
                          disabled={deletingId === course.id}
                        >
                          {deletingId === course.id ? (
                            <span className="flex items-center">
                              <span className="animate-spin mr-2">â†»</span>
                              جارٍ الحذف...
                            </span>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                        <Link href={`/courses/${course.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-4">
                      <p className="text-gray-500">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¯ÙˆØ±Ø§Øª Ø­Ø§Ù„ÙŠØ§Ù‹</p>
                      <Link href="/admin/courses/new">
                        <Button variant="outline">
                          <Plus className="mr-2 h-4 w-4" />
                          Ø¥Ù†Ø´Ø§Ø¡ Ø¯ÙˆØ±Ø© Ø¬Ø¯ÙŠØ¯Ø©
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
