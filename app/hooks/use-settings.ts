"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/utils"

export function useSettings() {
  const { data, error, isLoading, mutate } = useSWR('/api/settings', fetcher)

  return {
    settings: data,
    isLoading,
    isError: error,
    mutate
  }
} 