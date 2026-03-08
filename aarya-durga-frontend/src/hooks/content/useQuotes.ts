import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import quotes from '@/api/quotes';
import type { Quote } from '@/api/quotes';

const QUERY_KEY = ['quotes'];

export const useQuotes = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: quotes.getAll,
    staleTime: 5 * 60 * 1000,
  });

export const useQuote = (id: number) =>
  useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => quotes.getOne(id),
  });

export const useCreateQuote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Quote>) => quotes.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdateQuote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Quote> }) =>
      quotes.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeleteQuote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => quotes.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useReorderQuotes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: Array<{ id: number; sort_order: number }>) =>
      quotes.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
