import { Component, OnInit, ViewChildren, QueryList, ElementRef, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Project } from '../shared/models/project.model';
import { ProjectService } from '../shared/services/project.service';

interface TechStyle {
  bg: string;
  text: string;
  border: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  @Input() showAll: boolean = true;
  @Input() maxProjects: number = 4;
  @Input() showHeader: boolean = true;
  @Input() subtitle: string = 'A collection of projects I created to spark curiosity—some are fun, some are useful, and many are both.';

  @ViewChildren('cardContainer') cardContainers!: QueryList<ElementRef>;
  @ViewChildren('projectCard') projectCards!: QueryList<ElementRef>;
  
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  categories: string[] = ['All'];
  selectedCategory: string = 'All';
  selectedProject: Project | null = null;
  isModalOpen = false;
  isTouchDevice: boolean = false;

  private readonly techStyles = new Array< TechStyle>(
    { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-800' },
    { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800' },
    { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
     { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-800' },
    { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
    { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-800' },
     { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
     { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
    { bg: 'bg-lime-100 dark:bg-lime-900/30', text: 'text-lime-700 dark:text-lime-300', border: 'border-lime-200 dark:border-lime-800' },
     { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-800' },
    { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-800' },
    { bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-800' },
    { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
    { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
     { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
     { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
    { bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-800' },
     { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-800' }
  );

  // private readonly defaultStyle: TechStyle = {
  //   bg: 'bg-gray-100 dark:bg-gray-800/30',
  //   text: 'text-gray-700 dark:text-gray-300',
  //   border: 'border-gray-200 dark:border-gray-700'
  // };

  constructor(
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {}

  getTechStyle(tech: string): TechStyle {

    // Generate consistent color based on string
    const hash = Array.from(tech).reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const colors = Array.from(this.techStyles.values());
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }

  ngOnInit() {
    this.loadProjects();
    
    // Check for single column layout (mobile view)
    this.isTouchDevice = window.matchMedia('(max-width: 639px)').matches; // sm breakpoint in Tailwind is 640px

    // Add scroll event listener for single column layout
    if (this.isTouchDevice) {
      window.addEventListener('scroll', this.onScroll.bind(this));
      // Also listen for resize events to update isTouchDevice status
      window.addEventListener('resize', this.handleResize.bind(this));
    }
  }

  ngOnDestroy() {
    // Remove event listeners
    if (this.isTouchDevice) {
      window.removeEventListener('scroll', this.onScroll.bind(this));
      window.removeEventListener('resize', this.handleResize.bind(this));
    }
  }

  private handleResize = () => {
    // Update isTouchDevice based on viewport width
    const wasTouchDevice = this.isTouchDevice;
    this.isTouchDevice = window.matchMedia('(max-width: 639px)').matches;

    // Add or remove scroll listener based on viewport change
    if (this.isTouchDevice !== wasTouchDevice) {
      if (this.isTouchDevice) {
        window.addEventListener('scroll', this.onScroll.bind(this));
      } else {
        window.removeEventListener('scroll', this.onScroll.bind(this));
      }
    }
  }

  onScroll = () => {
    if (!this.isTouchDevice) return;

    // Check if scrolled to top
    if (window.scrollY === 0) {
      // Clear all hover effects
      this.projectCards.forEach((cardRef, index) => {
        this.onCardMouseLeave(index);
      });
      return;
    }

    // Get the center point of the viewport
    const centerX = window.outerWidth / 2;
    const centerY = window.innerHeight / 2;

    this.projectCards.forEach((cardRef, index) => {
      const card = cardRef.nativeElement;
      const rect = card.getBoundingClientRect();
      
      // Check if the card intersects with the center point
      if (
        centerY >= rect.top && 
        centerY <= rect.bottom
      ) {
        this.updateCardSelection(centerY, centerX, card);
      } else {
        this.onCardMouseLeave(index);
      }
    });
  }

  private loadProjects() {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
      this.updateFilteredProjects();
      this.updateCategories();
    });
  }

  private updateCategories() {
    const uniqueTechs = new Set<string>();
    this.projects.forEach(project => {
      project.techStack.forEach(tech => uniqueTechs.add(tech));
    });
    this.categories = ['All', ...Array.from(uniqueTechs)];
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.updateFilteredProjects();
  }

  private updateFilteredProjects() {
    let filtered = this.selectedCategory === 'All'
      ? this.projects
      : this.projects.filter(project => project.techStack.includes(this.selectedCategory));

    if (!this.showAll) {
      filtered = filtered.slice(0, this.maxProjects);
    }

    this.filteredProjects = filtered;
  }

  onCardMouseMove(event: MouseEvent, index: number) {
    const container = this.cardContainers.get(index)?.nativeElement;
    const card = this.projectCards.get(index)?.nativeElement;
    if (!card || !container) return;

    // Add z-index to container to lift it above other cards
    container.style.zIndex = '10';
    this.updateCardSelection(event.clientY,event.clientX, card);
  }

updateCardSelection(y: number, x: number, card: HTMLElement){
  
  const rect = card.getBoundingClientRect();
  const xRelative = x - rect.left;
  const yRelative = y - rect.top;
  const xNorm = (xRelative / rect.width) - 0.5;
  const yNorm = (yRelative / rect.height) - 0.5;
    // Calculate rotation based on mouse position
    const rotateX = yNorm * -30;
    const rotateY = xNorm * 30;

    // Calculate gradient angle and intensity
    const angle = (Math.atan2(yNorm, xNorm) * 180 / Math.PI + 270) % 360;
    const distance = Math.sqrt(xNorm * xNorm + yNorm * yNorm);
    const intensity = Math.max(0, 1 - distance * 2);
    const baseIntensity = 40 + intensity * 30;

    // Apply transforms and gradient
    card.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      scale(1.1) 
      translateY(-12px)
    `;

    // Apply gradient background
    card.style.background = `linear-gradient(
      ${angle}deg,
      rgb(96, 165, 250) 0%,
      rgb(147, 51, 234) 100%
    )`;

    // Update text colors for better contrast
    Array.from(card.querySelectorAll('h3, p, span')).forEach((element: HTMLElement) => {
      element.style.color = '#ffffff';
      element.style.transition = 'color 0.3s ease-out';
    });
}

  onCardMouseLeave(index: number) {
    const container = this.cardContainers.get(index)?.nativeElement;
    const card = this.projectCards.get(index)?.nativeElement;
    if (!card || !container) return;

    // Reset z-index
    container.style.zIndex = '1';

    // Reset all styles
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1) translateY(0)';
    card.style.background = '';

    // Reset text colors
    Array.from(card.querySelectorAll('h3, p, span')).forEach((element: HTMLElement) => {
      element.style.color = '';
    });
  }

  openProjectModal(project: Project) {
    this.selectedProject = project;
    this.isModalOpen = true;
  }

  closeProjectModal() {
    this.isModalOpen = false;
    this.selectedProject = null;
  }
} 