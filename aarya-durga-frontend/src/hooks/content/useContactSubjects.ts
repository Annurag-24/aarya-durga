import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import contactSubjects from '@/api/contactSubjects';
import type { ContactSubject } from '@/api/contactSubjects';

const QUERY_KEY = ['contact-subjects'];

export const useContactSubjects = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: contactSubjects.getAll,
    staleTime: 5 * 60 * 1000,
  });

export const useContactSubject = (id: number) =>
  useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => contactSubjects.getOne(id),
  });

export const useCreateContactSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ContactSubject>) =>
      contactSubjects.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdateContactSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<ContactSubject>;
    }) => contactSubjects.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeleteContactSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => contactSubjects.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useReorderContactSubjects = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: Array<{ id: number; sort_order: number }>) =>
      contactSubjects.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
