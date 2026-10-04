/**
 * Hand-written types matching supabase/migrations/0001_init.sql.
 *
 * Once the project is connected to a real Supabase project, prefer
 * generating this file automatically instead of maintaining it by hand:
 *
 *   npx supabase gen types typescript --project-id YOUR_PROJECT_REF > src/types/database.ts
 */

export type ContactStatus = 'new' | 'read' | 'in_progress' | 'resolved';
export type AdminRole = 'admin' | 'editor';

export interface Database {
  public: {
    Tables: {
      admin_profiles: {
        Row: { id: string; email: string; role: AdminRole; created_at: string };
        Insert: { id: string; email: string; role?: AdminRole; created_at?: string };
        Update: Partial<{ email: string; role: AdminRole }>;
      };
      services: {
        Row: {
          id: string;
          title: string;
          slug: string;
          short_description: string;
          description: string;
          icon: string | null;
          featured: boolean;
          published: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['services']['Row']> & {
          title: string;
          slug: string;
          short_description: string;
          description: string;
        };
        Update: Partial<Database['public']['Tables']['services']['Row']>;
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: Record<string, unknown>;
          featured_image: string | null;
          featured_image_alt: string | null;
          category: string;
          tags: string[];
          author: string;
          seo_title: string | null;
          meta_description: string | null;
          canonical_url: string | null;
          published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['blog_posts']['Row']> & {
          title: string;
          slug: string;
        };
        Update: Partial<Database['public']['Tables']['blog_posts']['Row']>;
      };
      team_members: {
        Row: {
          id: string;
          name: string;
          slug: string;
          role: string;
          skills: string[];
          biography: string | null;
          image_url: string | null;
          image_alt: string | null;
          profile_url: string | null;
          display_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['team_members']['Row']> & {
          name: string;
          slug: string;
          role: string;
        };
        Update: Partial<Database['public']['Tables']['team_members']['Row']>;
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          company: string | null;
          position: string | null;
          message: string;
          avatar_url: string | null;
          rating: number | null;
          published: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['testimonials']['Row']> & {
          client_name: string;
          message: string;
        };
        Update: Partial<Database['public']['Tables']['testimonials']['Row']>;
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          company: string | null;
          website: string | null;
          phone: string | null;
          service: string;
          budget: string | null;
          message: string;
          status: ContactStatus;
          email_sent: boolean;
          email_error: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['contact_submissions']['Row']> & {
          name: string;
          email: string;
          service: string;
          message: string;
        };
        Update: Partial<Database['public']['Tables']['contact_submissions']['Row']>;
      };
    };
  };
}

export type Service = Database['public']['Tables']['services']['Row'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type TeamMember = Database['public']['Tables']['team_members']['Row'];
export type Testimonial = Database['public']['Tables']['testimonials']['Row'];
export type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row'];
