import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import sacredTraditions from '@/api/sacredTraditions';
import type { SacredTradition } from '@/api/sacredTraditions';

const QUERY_KEY = ['sacred-traditions'];

export const useSacredTraditions = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: sacredTraditions.getAll,
    staleTime: 5 * 60 * 1000,
  });

export const useSacredTradition = (id: number) =>
  useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => sacredTraditions.getOne(id),
  });

export const useCreateSacredTradition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SacredTradition>) =>
      sacredTraditions.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdateSacredTradition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<SacredTradition>;
    }) => sacredTraditions.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeleteSacredTradition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sacredTraditions.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useReorderSacredTraditions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: Array<{ id: number; sort_order: number }>) =>
      sacredTraditions.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
