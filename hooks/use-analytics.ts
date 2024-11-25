import useSWR from 'swr'

interface AnalyticsData {
  monthlyIdeas: {
    month: string
    submitted: number
    implemented: number
  }[]
  departmentStats: {
    department: string
    _count: {
      _all: number
    }
  }[]
  totals: {
    total: number
    implemented: number
    successRate: number
  }
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useAnalytics(department?: string) {
  const url = department 
    ? `/api/analytics?department=${encodeURIComponent(department)}`
    : '/api/analytics'

  const { data, error } = useSWR<AnalyticsData>(url, fetcher, {
    refreshInterval: 30000 // Refresh every 30 seconds
  })

  return {
    data,
    isLoading: !error && !data,
    isError: error
  }
} 