import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import {
  useContactSubmissions,
  useDeleteContactSubmission,
} from '@/hooks/content/useContactSubmissions';
import type { ContactSubmission } from '@/api/contactSubmissions';

export const ContactSubmissionsPage = () => {
  const { data: submissions, isLoading } = useContactSubmissions();
  const deleteSubmission = useDeleteContactSubmission();
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSubmission.mutateAsync(deleteId);
      toast.success('Submission deleted successfully');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete submission');
    }
  };

  if (isLoading) {
    return <div className="space-y-6"><p>Loading submissions...</p></div>;
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Contact Form Submissions</h1>
        <p className="text-muted-foreground mt-1">View and manage messages from your website visitors</p>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>All Submissions</CardTitle>
            <CardDescription>Total: {submissions?.length || 0} messages</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!submissions?.length ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No submissions found
                    </TableCell>
                  </TableRow>
                ) : (
                  submissions?.map((submission) => (
                    <TableRow key={submission.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell className="text-sm">{submission.email}</TableCell>
                      <TableCell className="text-sm max-w-xs truncate">
                        {submission.subject || '(No subject)'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                            onClick={() => setDeleteId(submission.id)}
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

      {/* View Submission Modal */}
      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>View Message</DialogTitle>
            <DialogDescription>From: {selectedSubmission?.name}</DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</p>
                  </div>
                  <p className="text-sm font-medium">{selectedSubmission.name}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</p>
                  </div>
                  <p className="text-sm font-medium break-all">{selectedSubmission.email}</p>
                </div>

                {selectedSubmission.phone && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone</p>
                    </div>
                    <p className="text-sm font-medium">{selectedSubmission.phone}</p>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</p>
                  </div>
                  <p className="text-sm font-medium">{new Date(selectedSubmission.created_at).toLocaleString()}</p>
                </div>

                {selectedSubmission.subject && (
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Subject</p>
                    </div>
                    <p className="text-sm font-medium">{selectedSubmission.subject}</p>
                  </div>
                )}
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Message</p>
                </div>
                <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap text-sm leading-relaxed max-h-64 overflow-y-auto">
                  {selectedSubmission.message}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-4 border-t">
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Submission</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this contact submission? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
