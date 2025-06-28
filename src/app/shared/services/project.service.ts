import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Project } from '../models/project.model';
import { supabase } from '../supabase';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsSubject = new BehaviorSubject<Project[]>([]);

  constructor() {
    this.loadProjects();
  }

  private async loadProjects(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('hub_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
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
      const { data, error } = await supabase
        .from('hub_projects')
        .insert([project])
        .select()
        .single();

      if (error) throw error;
      
      const currentProjects = this.projectsSubject.value;
      this.projectsSubject.next([data, ...currentProjects]);
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  }

  async updateProject(project: Project): Promise<void> {
    try {
      const { error } = await supabase
        .from('hub_projects')
        .update(project)
        .eq('id', project.id);

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
      const { error } = await supabase
        .from('hub_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const currentProjects = this.projectsSubject.value;
      this.projectsSubject.next(currentProjects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
} 