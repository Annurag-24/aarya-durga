import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import poojaServices from '@/api/poojaServices';
import type { PoojaService } from '@/api/poojaServices';

const QUERY_KEY = ['pooja-services'];

export const usePoojaServices = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: poojaServices.getAll,
    staleTime: 5 * 60 * 1000,
  });

export const usePoojaService = (id: number) =>
  useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => poojaServices.getOne(id),
  });

export const useCreatePoojaService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PoojaService>) => poojaServices.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdatePoojaService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PoojaService> }) =>
      poojaServices.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeletePoojaService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => poojaServices.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useReorderPoojaServices = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: Array<{ id: number; sort_order: number }>) =>
      poojaServices.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
