import { Component } from '@angular/core';
import { AuthService } from 'src/app/admin/auth.service';
import { Project } from '../../shared/models/project.model';
import { ProjectService } from '../../shared/services/project.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../../shared/services/supabase.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  constructor(
    private projectService: ProjectService,
    private fb: FormBuilder,
    private auth: AuthService,
    private supabaseService: SupabaseService
  ) {
    this.projectForm = this.createProjectForm();    
    this.loadProjects();
    console.log("ctor");
  }
  logout() {
    this.auth.logout();
  }
  
  projects: Project[] = [];
  projectForm: FormGroup;
  editingProject: Project | null = null;
  showForm = false;
  uploadError: string | null = null;
  isUploading = false;

  private loadProjects(): void {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
    });
  }

  private createProjectForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      techStack: ['', Validators.required], // Will be split by comma
      featured: [false],
      imageUrl: ['', Validators.required],
      projectUrl: ['', Validators.required],
      status: [0, Validators.required],
      gitUrl: ['', Validators.required]
    });
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.isUploading = true;
      this.uploadError = null;

      try {
        const { url, error } = await this.supabaseService.uploadProjectImage(file);
        if (error) {
          this.uploadError = error;
        } else if (url) {
          this.projectForm.patchValue({ imageUrl: url });
        }
      } catch (error) {
        this.uploadError = error instanceof Error ? error.message : 'Error uploading file';
      } finally {
        this.isUploading = false;
        // Clear the input so the same file can be selected again if needed
        input.value = '';
      }
    }
  }

  onAddNew(): void {
    this.editingProject = null;
    this.projectForm.reset({featured: false});
    this.showForm = true;
  }

  onEdit(project: Project): void {
    this.editingProject = project;
    this.projectForm.patchValue({
      name: project.name,
      description: project.description,
      techStack: project.techStack.join(', '),
      featured: project.featured,
      imageUrl: project.imageUrl,
      projectUrl: project.projectUrl,
      status: project.status,
      gitUrl: project.gitUrl
    });
    this.showForm = true;
  }

  onDelete(project: Project): void {
    if (confirm(`Are you sure you want to delete ${project.name}?`)) {
      this.projectService.deleteProject(project.id);
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;
      const project: Project = {
        id: this.editingProject?.id || '',
        name: formValue.name,
        description: formValue.description,
        techStack: formValue.techStack.split(',').map((tech: string) => tech.trim()),
        featured: formValue.featured,
        imageUrl: formValue.imageUrl,
        projectUrl: formValue.projectUrl,
        status: formValue.status,
        gitUrl: formValue.gitUrl
      };

      if (this.editingProject) {
        this.projectService.updateProject(project);
      } else {
        this.projectService.addProject(project);
      }

      this.showForm = false;
      this.projectForm.reset();
      this.editingProject = null;
    }
  }

  onCancel(): void {
    this.showForm = false;
    this.projectForm.reset();
    this.editingProject = null;
  }
}
