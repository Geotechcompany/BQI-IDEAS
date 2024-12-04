export const DEPARTMENTS = [
  "Engineering",
  "Operations",
  "Professional Services"
] as const

export type Department = typeof DEPARTMENTS[number] 