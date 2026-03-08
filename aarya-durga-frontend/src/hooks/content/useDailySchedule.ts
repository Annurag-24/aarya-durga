import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dailySchedule from '@/api/dailySchedule';
import type { DailyScheduleItem } from '@/api/dailySchedule';

const QUERY_KEY = ['daily-schedule'];

export const useDailySchedule = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: dailySchedule.getAll,
    staleTime: 5 * 60 * 1000,
  });

export const useDailyScheduleItem = (id: number) =>
  useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => dailySchedule.getOne(id),
  });

export const useCreateDailyScheduleItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<DailyScheduleItem>) => dailySchedule.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdateDailyScheduleItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<DailyScheduleItem>;
    }) => dailySchedule.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeleteDailyScheduleItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => dailySchedule.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useReorderDailySchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: Array<{ id: number; sort_order: number }>) =>
      dailySchedule.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
