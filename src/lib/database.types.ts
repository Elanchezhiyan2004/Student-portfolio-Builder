export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'student' | 'recruiter'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role: 'student' | 'recruiter'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'student' | 'recruiter'
          created_at?: string
          updated_at?: string
        }
      }
      portfolios: {
        Row: {
          id: string
          user_id: string
          username: string
          tagline: string
          bio: string
          phone: string
          location: string
          website: string
          github: string
          linkedin: string
          theme: 'modern' | 'minimal' | 'professional'
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          tagline?: string
          bio?: string
          phone?: string
          location?: string
          website?: string
          github?: string
          linkedin?: string
          theme?: 'modern' | 'minimal' | 'professional'
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          tagline?: string
          bio?: string
          phone?: string
          location?: string
          website?: string
          github?: string
          linkedin?: string
          theme?: 'modern' | 'minimal' | 'professional'
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      education: {
        Row: {
          id: string
          portfolio_id: string
          institution: string
          degree: string
          field: string
          start_date: string
          end_date: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          institution: string
          degree: string
          field: string
          start_date?: string
          end_date?: string
          description?: string
          created_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          institution?: string
          degree?: string
          field?: string
          start_date?: string
          end_date?: string
          description?: string
          created_at?: string
        }
      }
      experience: {
        Row: {
          id: string
          portfolio_id: string
          company: string
          position: string
          location: string
          start_date: string
          end_date: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          company: string
          position: string
          location?: string
          start_date?: string
          end_date?: string
          description?: string
          created_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          company?: string
          position?: string
          location?: string
          start_date?: string
          end_date?: string
          description?: string
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          portfolio_id: string
          title: string
          description: string
          technologies: string[]
          link: string
          github_link: string
          created_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          title: string
          description?: string
          technologies?: string[]
          link?: string
          github_link?: string
          created_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          title?: string
          description?: string
          technologies?: string[]
          link?: string
          github_link?: string
          created_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          portfolio_id: string
          name: string
          category: string
          proficiency: string
          created_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          name: string
          category?: string
          proficiency?: string
          created_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          name?: string
          category?: string
          proficiency?: string
          created_at?: string
        }
      }
    }
  }
}
