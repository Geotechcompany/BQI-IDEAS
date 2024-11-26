import useSWR from 'swr'

interface Notification {
  id: number
  type: 'like' | 'comment' | 'idea'
  message: string
  idea_id: number | null
  read: boolean
  created_at: string
  idea?: {
    title: string
  }
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useNotifications() {
  const { data, error, mutate } = useSWR<Notification[]>('/api/notifications', fetcher, {
    refreshInterval: 30000 // Refresh every 30 seconds
  })

  const unreadCount = Array.isArray(data) ? data.filter(n => !n.read).length : 0

  return {
    notifications: Array.isArray(data) ? data : [],
    unreadCount,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
} 