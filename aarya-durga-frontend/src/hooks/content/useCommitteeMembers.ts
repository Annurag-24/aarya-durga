import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import committeeMembers from '@/api/committeeMembers';
import type { CommitteeMember } from '@/api/committeeMembers';

const QUERY_KEY = ['committee-members'];

export const useCommitteeMembers = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: committeeMembers.getAll,
    staleTime: 5 * 60 * 1000,
  });

export const useCommitteeMember = (id: number) =>
  useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => committeeMembers.getOne(id),
  });

export const useCreateCommitteeMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CommitteeMember>) =>
      committeeMembers.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdateCommitteeMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CommitteeMember>;
    }) => committeeMembers.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeleteCommitteeMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => committeeMembers.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useReorderCommitteeMembers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: Array<{ id: number; sort_order: number }>) =>
      committeeMembers.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
