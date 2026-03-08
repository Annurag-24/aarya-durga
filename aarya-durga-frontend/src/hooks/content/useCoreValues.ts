import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import coreValues from '@/api/coreValues';
import type { CoreValue } from '@/api/coreValues';

const QUERY_KEY = ['core-values'];

export const useCoreValues = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: coreValues.getAll,
    staleTime: 5 * 60 * 1000,
  });

export const useCoreValue = (id: number) =>
  useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => coreValues.getOne(id),
  });

export const useCreateCoreValue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CoreValue>) => coreValues.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdateCoreValue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CoreValue> }) =>
      coreValues.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeleteCoreValue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => coreValues.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useReorderCoreValues = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: Array<{ id: number; sort_order: number }>) =>
      coreValues.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
