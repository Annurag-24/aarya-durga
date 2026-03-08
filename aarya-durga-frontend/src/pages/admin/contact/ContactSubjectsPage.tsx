import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  useContactSubjects,
  useCreateContactSubject,
  useUpdateContactSubject,
  useDeleteContactSubject,
} from '@/hooks/content/useContactSubjects';
import type { ContactSubject } from '@/api/contactSubjects';

export const ContactSubjectsPage = () => {
  const { data = [], isLoading } = useContactSubjects();
  const createMutation = useCreateContactSubject();
  const updateMutation = useUpdateContactSubject();
  const deleteMutation = useDeleteContactSubject();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    label_en: '',
    label_hi: '',
    label_mr: '',
  });

  const handleOpenDialog = (subject?: ContactSubject) => {
    if (subject) {
      setEditingId(subject.id);
      setFormData({
        label_en: subject.label_en,
        label_hi: subject.label_hi,
        label_mr: subject.label_mr,
      });
    } else {
      setEditingId(null);
      setFormData({ label_en: '', label_hi: '', label_mr: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.label_en.trim() || !formData.label_hi.trim() || !formData.label_mr.trim()) {
      toast.error('All fields are required');
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: formData });
        toast.success('Subject updated successfully');
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('Subject added successfully');
      }
      setIsDialogOpen(false);
      setFormData({ label_en: '', label_hi: '', label_mr: '' });
    } catch {
      toast.error(editingId ? 'Failed to update subject' : 'Failed to add subject');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success('Subject deleted successfully');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete subject');
    }
  };

  if (isLoading) {
    return <div className="space-y-6"><p>Loading subjects...</p></div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Contact Form Subjects</h1>
          <p className="text-muted-foreground mt-1">Manage subject categories for the contact form dropdown</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus size={18} /> Add Subject
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Subjects</CardTitle>
          <CardDescription>Total: {data.length} subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead>English</TableHead>
                  <TableHead>हिंदी</TableHead>
                  <TableHead>मराठी</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No subjects found. Add one to get started!
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((subject) => (
                    <TableRow key={subject.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{subject.label_en}</TableCell>
                      <TableCell>{subject.label_hi}</TableCell>
                      <TableCell>{subject.label_mr}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenDialog(subject)}
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                            onClick={() => setDeleteId(subject.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update the subject in all languages' : 'Create a new contact form subject category'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="label_en">English Label *</Label>
              <Input
                id="label_en"
                placeholder="e.g., General Inquiry"
                value={formData.label_en}
                onChange={(e) => setFormData({ ...formData, label_en: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="label_hi">हिंदी Label *</Label>
              <Input
                id="label_hi"
                placeholder="e.g., सामान्य प्रश्न"
                value={formData.label_hi}
                onChange={(e) => setFormData({ ...formData, label_hi: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="label_mr">मराठी Label *</Label>
              <Input
                id="label_mr"
                placeholder="e.g., सामान्य प्रश्न"
                value={formData.label_mr}
                onChange={(e) => setFormData({ ...formData, label_mr: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
              {editingId ? 'Update Subject' : 'Add Subject'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Subject</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this subject? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
