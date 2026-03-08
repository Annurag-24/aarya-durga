import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import gallery from '@/api/gallery';
import type { GalleryImage } from '@/api/gallery';

const QUERY_KEY = ['gallery'];

export const useGallery = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: gallery.getAll,
    staleTime: 5 * 60 * 1000,
  });

export const useGalleryImage = (id: number) =>
  useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => gallery.getOne(id),
  });

export const useCreateGalleryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<GalleryImage>) => gallery.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdateGalleryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<GalleryImage> }) =>
      gallery.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeleteGalleryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => gallery.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useReorderGallery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: Array<{ id: number; sort_order: number }>) =>
      gallery.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
