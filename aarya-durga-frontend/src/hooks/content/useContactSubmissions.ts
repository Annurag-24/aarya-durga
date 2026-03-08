import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import contactSubmissions from '@/api/contactSubmissions';
import type { ContactSubmission } from '@/api/contactSubmissions';

const QUERY_KEY = ['contact-submissions'];

export const useContactSubmissions = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: contactSubmissions.getAll,
    staleTime: 5 * 60 * 1000,
  });

export const useContactSubmission = (id: number) =>
  useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => contactSubmissions.getOne(id),
    staleTime: 5 * 60 * 1000,
  });

export const useUpdateContactSubmissionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'new' | 'read' | 'resolved' }) =>
      contactSubmissions.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeleteContactSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => contactSubmissions.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useSubmitContact = () =>
  useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      phone?: string;
      subject?: string;
      message: string;
    }) => contactSubmissions.submit(data),
  });
