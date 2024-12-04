"use client"

import useSWR from "swr"
import { fetcher } from "../../lib/utils"

export function useApprovals(status?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/approvals${status ? `?status=${status}` : ''}`,
    fetcher
  )

  return {
    approvals: data,
    isLoading,
    isError: error,
    mutate
  }
} 