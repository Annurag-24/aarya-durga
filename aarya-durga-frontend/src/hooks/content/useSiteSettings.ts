import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import settings from '@/api/settings';
import type { SiteSetting } from '@/api/settings';

const QUERY_KEY = ['site-settings'];

export const useSiteSettings = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: settings.get,
    staleTime: 10 * 60 * 1000,
  });

export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SiteSetting>) => settings.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
