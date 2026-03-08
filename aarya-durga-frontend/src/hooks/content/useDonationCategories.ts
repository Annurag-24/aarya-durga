import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import donationCategories from '@/api/donationCategories';
import type { DonationCategory } from '@/api/donationCategories';

const QUERY_KEY = ['donation-categories'];

export const useDonationCategories = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: donationCategories.getAll,
    staleTime: 5 * 60 * 1000,
  });

export const useDonationCategory = (id: number) =>
  useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => donationCategories.getOne(id),
  });

export const useCreateDonationCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<DonationCategory>) =>
      donationCategories.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdateDonationCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<DonationCategory>;
    }) => donationCategories.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeleteDonationCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => donationCategories.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useReorderDonationCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: Array<{ id: number; sort_order: number }>) =>
      donationCategories.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
