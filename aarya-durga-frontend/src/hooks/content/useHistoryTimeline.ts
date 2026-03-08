import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import historyTimeline from '@/api/historyTimeline';
import type { HistoryTimeline } from '@/api/historyTimeline';

const QUERY_KEY = ['history-timeline'];

export const useHistoryTimeline = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: historyTimeline.getAll,
    staleTime: 5 * 60 * 1000,
  });

export const useHistoryTimelineItem = (id: number) =>
  useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => historyTimeline.getOne(id),
  });

export const useCreateHistoryTimelineItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<HistoryTimeline>) =>
      historyTimeline.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdateHistoryTimelineItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<HistoryTimeline>;
    }) => historyTimeline.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeleteHistoryTimelineItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => historyTimeline.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useReorderHistoryTimeline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: Array<{ id: number; sort_order: number }>) =>
      historyTimeline.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
