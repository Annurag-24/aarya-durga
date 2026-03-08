import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import pageContent from '@/api/pageContent';
import client from '@/api/client';
import type { PageContent } from '@/api/pageContent';

const QUERY_KEY = ['page-content'];

// ============================================
// PUBLIC HOOKS - for home page sections
// ============================================
export const usePageContentPublic = (pageKey: string, sectionKey?: string) => {
  return useQuery({
    queryKey: ['page-content-public', pageKey, sectionKey],
    queryFn: async () => {
      if (sectionKey) {
        const response = await client.get(`/public/page-content/${pageKey}/${sectionKey}`);
        return response.data;
      }
      const response = await client.get(`/public/page-content/${pageKey}`);
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Helper to get specific language content
export const usePageText = (pageKey: string, sectionKey: string, language: 'en' | 'hi' | 'mr' = 'en') => {
  const { data, isLoading } = usePageContentPublic(pageKey, sectionKey);

  if (isLoading) return { text: '', isLoading: true };

  // Find the content for the specific language
  if (Array.isArray(data)) {
    const item = data.find((d: any) => d.language === language);
    return { text: item?.content || '', isLoading: false };
  }

  return { text: data?.content || '', isLoading: false };
};

// ============================================
// ADMIN HOOKS - for admin panel
// ============================================

export const usePageContent = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: pageContent.getAll,
    staleTime: 5 * 60 * 1000,
  });

export const usePageContentItem = (id: number) =>
  useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => pageContent.getOne(id),
  });

export const useCreatePageContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PageContent>) => pageContent.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdatePageContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<PageContent>;
    }) => pageContent.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeletePageContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pageContent.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
