export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  featured: boolean;
  imageUrl: string;
  projectUrl?: string;
  gitUrl?: string;
  status: number;
} 

export interface RawProjectData {
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