import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { supabase } from '../supabase';
import { Project } from '../models/project.model';

interface RawProjectData {
  id: string;
  name: string;
  description: string;
  image_url: string;
  project_url: string;
  tech_stack: string[];
  featured: boolean;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly TABLE_NAME = 'hub_projects';

  constructor() {
    this.supabase = supabase;
    this.testConnection();
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
      tech_stack: project.techStack
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
      techStack: Array.isArray(data.tech_stack) ? data.tech_stack : []
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
      const rawData = this.projectToRawData(project);
      const result = await this.supabase
        .from(this.TABLE_NAME)
        .insert([rawData])
        .select()
        .single();

      if (result.error) {
        return { data: null, error: result.error };
      }

      return { 
        data: this.rawDataToProject(result.data as RawProjectData), 
        error: null 
      };
    } catch (error) {
      console.error('Error adding project:', error);
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

  async updateProject(project: Project): Promise<SupabaseResponse<null>> {
    try {
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
          code: 'UNKNOWN_ERROR',
          details: '',
          hint: '',
          name: 'DatabaseError'
        }
      };
    }
  }

  async deleteProject(id: string): Promise<SupabaseResponse<null>> {
    try {
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
          code: 'UNKNOWN_ERROR',
          details: '',
          hint: '',
          name: 'DatabaseError'
        }
      };
    }
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
