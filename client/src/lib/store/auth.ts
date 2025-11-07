export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'user' | 'agent' | 'admin'
  avatar?: string
  isActive: boolean
  mustChangePassword?: boolean
}
