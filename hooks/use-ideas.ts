import useSWR from 'swr'
import { Idea } from '@/types/ideas'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useIdeas(department?: string) {
  const url = department 
    ? `/api/ideas?department=${encodeURIComponent(department)}`
    : '/api/ideas'

  const { data, error, mutate } = useSWR<Idea[]>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  return {
    ideas: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
} 