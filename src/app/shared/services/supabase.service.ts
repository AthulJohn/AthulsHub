import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, PostgrestError, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { supabase } from '../supabase';
import { Project } from '../models/project.model';
import { RawProjectData } from '../models/project.model';
import { BehaviorSubject, Observable } from 'rxjs';



export interface SupabaseResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

export interface FileUploadResponse {
  url: string | null;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly TABLE_NAME = 'hub_projects';
  private readonly STORAGE_BUCKET = 'hub-projects';
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor() {
    this.supabase = supabase;
    this.testConnection();
    this.initializeAuth();
  }

  private async initializeAuth() {
    // Get initial session
    const { data: { session } } = await this.supabase.auth.getSession();
    this.currentUser.next(session?.user ?? null);

    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.currentUser.next(session?.user ?? null);
    });
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  async signIn(email: string, password: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error ? error.message : null };
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
  }

  private async testConnection() {
    try {
      await this.supabase.from(this.TABLE_NAME).select('count', { count: 'exact', head: true });
      console.log('Supabase connection successful');
    } catch (err) {
      console.error('Supabase connection error:', err);
    }
  }

  private projectToRawData(project: Omit<Project, 'id'>): Omit<RawProjectData, 'id'> {
    return {
      name: project.name,
      description: project.description,
      image_url: project.imageUrl,
      project_url: project.projectUrl,
      featured: project.featured,
      tech_stack: project.techStack,
      status: project.status,
      git_url: project.gitUrl,
    };
  }

  private rawDataToProject(data: RawProjectData): Project {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      imageUrl: data.image_url,
      projectUrl: data.project_url,
      featured: data.featured,
      techStack: Array.isArray(data.tech_stack) ? data.tech_stack : [],
      status: data.status,
    };
  }

  async fetchProjects(): Promise<SupabaseResponse<Project[]>> {
    try {
      const result = await this.supabase
        .from(this.TABLE_NAME)
        .select('*');

      if (!result) {
        return { 
          data: null, 
          error: {
            message: 'No response from Supabase',
            code: 'NO_RESPONSE',
            details: '',
            hint: '',
            name: 'DatabaseError'
          }
        };
      }

      if (result.error) {
        return { data: null, error: result.error };
      }

      const projects = (result.data || [])
        .map((item: RawProjectData) => this.rawDataToProject(item));

      return { data: projects, error: null };
    } catch (error) {
      console.error('Error fetching projects:', error);
      return { 
        data: null, 
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          code: 'UNKNOWN_ERROR',
          details: '',
          hint: '',
          name: 'DatabaseError'
        }
      };
    }
  }

  async addProject(project: Omit<Project, 'id'>): Promise<SupabaseResponse<Project>> {
    try {
      // Get and verify session
      const { data: { session }, error: sessionError } = await this.supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', {
          code: sessionError.status,
          message: sessionError.message
        });
        throw new Error('Authentication error: ' + sessionError.message);
      }

      if (!session) {
        throw new Error('Unauthorized: No active session found');
      }

      // Log auth status for debugging
      console.log('Auth check:', {
        isAuthenticated: true,
        email: session.user.email,
        role: session.user.role,
        lastSignIn: session.user.last_sign_in_at
      });

      const rawData = this.projectToRawData(project);
      
      // Attempt insert with explicit auth header
      const result = await this.supabase
        .from(this.TABLE_NAME)
        .insert([rawData])
        .select()
        .single();

      if (result.error) {
        // Handle RLS policy violation specifically
        if (result.error.code === '42501') {
          console.error('RLS Policy violation:', {
            message: 'Row-level security policy prevented the operation',
            email: session.user.email,
            table: this.TABLE_NAME
          });
          return {
            data: null,
            error: {
              message: 'Permission denied: You do not have the required permissions to perform this action',
              code: 'PERMISSION_DENIED',
              details: result.error.message,
              hint: 'Please ensure you have the correct permissions and are properly authenticated',
              name: 'SecurityError'
            }
          };
        }

        // Handle other errors
        console.error('Insert error:', {
          code: result.error.code,
          message: result.error.message,
          details: result.error.details
        });
        return { data: null, error: result.error };
      }

      return { 
        data: this.rawDataToProject(result.data as RawProjectData), 
        error: null 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Project creation error:', {
        type: error instanceof Error ? error.name : 'Unknown',
        message: errorMessage
      });
      
      return { 
        data: null, 
        error: {
          message: errorMessage,
          code: error instanceof Error && error.message.includes('Unauthorized') ? 'UNAUTHORIZED' : 'UNKNOWN_ERROR',
          details: '',
          hint: 'Please ensure you are signed in and have the correct permissions',
          name: 'DatabaseError'
        }
      };
    }
  }

  async updateProject(project: Project): Promise<SupabaseResponse<null>> {
    try {
      const session = await this.supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error('Unauthorized: Please sign in to update projects');
      }

      const rawData = this.projectToRawData(project);
      const result = await this.supabase
        .from(this.TABLE_NAME)
        .update(rawData)
        .eq('id', project.id);

      return { data: null, error: result.error };
    } catch (error) {
      console.error('Error updating project:', error);
      return { 
        data: null, 
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          code: error instanceof Error && error.message.includes('Unauthorized') ? 'UNAUTHORIZED' : 'UNKNOWN_ERROR',
          details: '',
          hint: 'Sign in to perform this action',
          name: 'DatabaseError'
        }
      };
    }
  }

  async deleteProject(id: string): Promise<SupabaseResponse<null>> {
    try {
      const session = await this.supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error('Unauthorized: Please sign in to delete projects');
      }

      const result = await this.supabase
        .from(this.TABLE_NAME)
        .delete()
        .eq('id', id);

      return { data: null, error: result.error };
    } catch (error) {
      console.error('Error deleting project:', error);
      return { 
        data: null, 
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          code: error instanceof Error && error.message.includes('Unauthorized') ? 'UNAUTHORIZED' : 'UNKNOWN_ERROR',
          details: '',
          hint: 'Sign in to perform this action',
          name: 'DatabaseError'
        }
      };
    }
  }

  async uploadProjectImage(file: File): Promise<FileUploadResponse> {
    try {
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await this.supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Authentication error:', sessionError);
        return { url: null, error: 'Authentication required for file upload' };
      }

      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        return { url: null, error: 'File must be an image' };
      }

      // Check file size (limit to 5MB)
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > MAX_SIZE) {
        return { url: null, error: 'File size must be less than 5MB' };
      }

      // Generate a unique file name with original extension
      const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      if (!allowedExtensions.includes(fileExt)) {
        return { url: null, error: 'File must be a JPG, PNG, GIF, or WebP image' };
      }

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload the file
      const { data, error: uploadError } = await this.supabase.storage
        .from(this.STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        if (uploadError.message.includes('security policy')) {
          return { url: null, error: 'Permission denied: Storage policy prevents this upload' };
        }
        return { url: null, error: uploadError.message };
      }

      // Get the public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from(this.STORAGE_BUCKET)
        .getPublicUrl(filePath);

      return { url: publicUrl, error: null };
    } catch (error) {
      console.error('Error in uploadProjectImage:', error);
      return { 
        url: null, 
        error: error instanceof Error ? error.message : 'Unknown error occurred during file upload' 
      };
    }
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
