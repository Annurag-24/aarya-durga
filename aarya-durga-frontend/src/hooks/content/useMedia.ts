import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import media from '@/api/media';
import type { MediaFile } from '@/api/media';

const QUERY_KEY = ['media'];

export const useMedia = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: media.getAll,
    staleTime: 5 * 60 * 1000,
  });

export const useUploadMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { file: File; section?: string }) => media.upload(variables.file, variables.section),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => media.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
