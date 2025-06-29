import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Project } from '../models/project.model';
import { SupabaseService } from './supabase.service';

interface RawProjectData {
  id: string;
  name: string;
  description: string;
  image_url: string;
  project_url: string;
  git_url: string;
  featured: boolean;
  status: number;
  tech_stack: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsSubject = new BehaviorSubject<Project[]>([]);

  constructor(private supabaseService: SupabaseService) {
    this.loadProjects();
  }

  private async loadProjects(): Promise<void> {
    try {
      console.log('Starting to load projects...');
      const { data, error } = await this.supabaseService.fetchProjects();
      
      if (error) {
        console.error('Error loading projects:', error);
        this.projectsSubject.next([]);
        return;
      }

      this.projectsSubject.next(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      this.projectsSubject.next([]);
    }
  }

  getProjects(): Observable<Project[]> {
    return this.projectsSubject.asObservable();
  }

  getFeaturedProjects(): Observable<Project[]> {
    return this.getProjects().pipe(
      map(projects => projects.filter(project => project.featured))
    );
  }

  async addProject(project: Omit<Project, 'id'>): Promise<void> {
    try {
      const { data, error } = await this.supabaseService.addProject(project);

      if (error) throw error;
      if (!data) throw new Error('No data returned from addProject');
      
      const currentProjects = this.projectsSubject.value;
      this.projectsSubject.next([data, ...currentProjects]);
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  }

  async updateProject(project: Project): Promise<void> {
    try {
      const { error } = await this.supabaseService.updateProject(project);

      if (error) throw error;

      const currentProjects = this.projectsSubject.value;
      const index = currentProjects.findIndex(p => p.id === project.id);
      if (index !== -1) {
        currentProjects[index] = project;
        this.projectsSubject.next([...currentProjects]);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      const { error } = await this.supabaseService.deleteProject(id);

      if (error) throw error;

      const currentProjects = this.projectsSubject.value;
      this.projectsSubject.next(currentProjects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
} 