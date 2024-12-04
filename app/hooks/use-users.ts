"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/utils"

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR('/api/users', fetcher)

  return {
    users: data,
    isLoading,
    isError: error,
    mutate
  }
} 