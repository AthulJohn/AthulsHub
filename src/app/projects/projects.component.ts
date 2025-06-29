import { Component, OnInit, ViewChildren, QueryList, ElementRef, Input } from '@angular/core';
import { Project } from '../shared/models/project.model';
import { ProjectService } from '../shared/services/project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  @Input() showAll: boolean = true;
  @Input() maxProjects: number = 4;
  @Input() showHeader: boolean = true;
  @Input() title: string = 'All Projects';
  @Input() subtitle: string = 'Explore my complete portfolio of projects, from web applications to innovative solutions that showcase creativity and technical expertise.';

  @ViewChildren('cardContainer') cardContainers!: QueryList<ElementRef>;
  @ViewChildren('projectCard') projectCards!: QueryList<ElementRef>;
  @ViewChildren('cardShadow') cardShadows!: QueryList<ElementRef>;
  
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  categories: string[] = ['All'];
  selectedCategory: string = 'All';

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.projectService.getProjects().subscribe(projects => {
      console.log(projects);
      this.projects = projects;
      // If not showing all, limit to featured projects first
      if (!this.showAll) {
        this.projects = projects
          .sort((a, b) => (a.featured === b.featured) ? 0 : a.featured ? -1 : 1)
          .slice(0, this.maxProjects);
      }
      this.filteredProjects = this.projects;
      this.updateCategories();
    });
  }

  private updateCategories(): void {
    const uniqueCategories = new Set<string>();
    this.projects.forEach(project => {
      console.log(project.techStack);
      project.techStack.forEach(tech => uniqueCategories.add(tech));
    });
    this.categories = ['All', ...Array.from(uniqueCategories)];
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredProjects = this.projects;
    } else {
      this.filteredProjects = this.projects.filter(project => 
        project.techStack.includes(category)
      );
    }
  }

  onCardMouseMove(event: MouseEvent, index: number) {
    const container = this.cardContainers.toArray()[index].nativeElement;
    const card = this.projectCards.toArray()[index].nativeElement;
    
    const { left, top, width, height } = container.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;

    const xNorm = (x / width) - 0.5;
    const yNorm = (y / height) - 0.5;

    const rotateY = xNorm * 30;
    const rotateX = yNorm * -30;

    const shiftX = xNorm * 20;
    const shiftY = yNorm * 20 - 15;

    // Calculate light intensity based on mouse position
    const distance = Math.sqrt(xNorm * xNorm + yNorm * yNorm);
    const intensity = Math.max(0, 1 - distance * 2);
    
    // Calculate gradient angle based on mouse position
    const angle = (Math.atan2(yNorm, xNorm) * 180 / Math.PI + 270) % 360;
    const baseIntensity = 40 + intensity * 30; // Increased intensity range for solid colors

    // Add z-index to container
    container.style.zIndex = '10';
    
    // Apply transform and theme-based dynamic lighting to the card
    card.style.transform = `translate(${shiftX}px, ${shiftY}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.1)`;
    card.style.background = `linear-gradient(
      ${angle}deg,
      rgb(96, 165, 250) 0%, /* blue-400 */
      rgb(147, 51, 234) 100% /* purple-600 */
    )`;
    card.style.transition = 'transform 0.3s ease-out';
    
    // Keep text white for better contrast against the gradient
    Array.from(card.querySelectorAll('h3, p, span')).forEach((element: HTMLElement) => {
      element.style.color = '#ffffff';
      element.style.transition = 'color 0.3s ease-out';
    });
  }

  onCardMouseLeave(index: number) {
    const container = this.cardContainers.toArray()[index].nativeElement;
    const card = this.projectCards.toArray()[index].nativeElement;

    // Reset z-index
    container.style.zIndex = '1';

    // Reset card styles
    card.style.transform = 'translate(0, 0) rotateY(0) rotateX(0) scale(1)';
    card.style.background = '';
    
    // Reset text colors
    Array.from(card.querySelectorAll('h3, p, span')).forEach((element: HTMLElement) => {
      element.style.color = '';
    });
  }
} 