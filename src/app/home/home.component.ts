import { Component, OnInit } from '@angular/core';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  url: string;
  tags: string[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  projects: Project[] = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A modern e-commerce solution with React and Node.js",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      url: "https://ecommerce.atjhub.com",
      tags: ["React", "Node.js", "MongoDB"]
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Collaborative task management with real-time updates",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
      url: "https://tasks.atjhub.com",
      tags: ["Vue.js", "Firebase", "PWA"]
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "Real-time weather data visualization with interactive maps",
      image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=400&h=300&fit=crop",
      url: "https://weather.atjhub.com",
      tags: ["JavaScript", "API", "Chart.js"]
    },
    {
      id: 4,
      title: "Portfolio Generator",
      description: "Dynamic portfolio builder with customizable templates",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      url: "https://portfolio.atjhub.com",
      tags: ["Next.js", "Tailwind", "CMS"]
    },
    {
      id: 5,
      title: "AI Chat Assistant",
      description: "Intelligent chatbot powered by machine learning",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
      url: "https://ai-chat.atjhub.com",
      tags: ["Python", "TensorFlow", "WebSocket"]
    },
    {
      id: 6,
      title: "Social Media Analytics",
      description: "Comprehensive analytics dashboard for social platforms",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      url: "https://analytics.atjhub.com",
      tags: ["Angular", "D3.js", "REST API"]
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
} 