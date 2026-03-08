import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import events from '@/api/events';
import type { Event } from '@/api/events';

const QUERY_KEY = ['events'];

export const useEvents = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: events.getAll,
    staleTime: 5 * 60 * 1000,
  });

export const useEvent = (id: number) =>
  useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => events.getOne(id),
  });

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Event>) => events.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Event> }) =>
      events.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => events.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useReorderEvents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: Array<{ id: number; sort_order: number }>) =>
      events.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
