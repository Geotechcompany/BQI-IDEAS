export const DEPARTMENTS = [
  "Engineering",
  "Operations",
  "Professional_Services"
] as const

export const DEPARTMENT_DISPLAY_NAMES = {
  Engineering: "Engineering",
  Operations: "Operations",
  Professional_Services: "Professional Services"
} as const

// Helper function to convert display name to enum value
export function getDepartmentEnumValue(displayName: string) {
  return displayName.toUpperCase().replace(" ", "_")
}

// Helper function to convert enum value to display name
export function getDepartmentDisplayName(enumValue: string) {
  return DEPARTMENT_DISPLAY_NAMES[enumValue as keyof typeof DEPARTMENT_DISPLAY_NAMES] || enumValue
} 