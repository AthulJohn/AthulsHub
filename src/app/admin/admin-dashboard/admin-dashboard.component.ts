import { Component } from '@angular/core';
import { AuthService } from 'src/app/admin/auth.service';
import { Project } from '../../shared/models/project.model';
import { ProjectService } from '../../shared/services/project.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  constructor(
    private projectService: ProjectService,
    private fb: FormBuilder,private auth: AuthService) {
    this.projectForm = this.createProjectForm();
  }
  logout() {
    this.auth.logout();
  }
  
  projects: Project[] = [];
  projectForm: FormGroup;
  editingProject: Project | null = null;
  showForm = false;


  ngOnInit(): void {
    this.loadProjects();
  }

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
      projectUrl: ['', Validators.required]
    });
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
      projectUrl: project.projectUrl
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
        projectUrl: formValue.projectUrl
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
