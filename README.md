# ATJ Hub - Angular Portfolio Website

A modern, responsive portfolio website built with **Angular** and **Tailwind CSS**, featuring a dark theme and interactive elements. The site showcases projects with smooth animations and includes a content management system powered by Netlify CMS.

## ✨ Features

### 🎨 Design & User Experience
- **Dark Theme**: Elegant dark color scheme with blue and purple accents
- **Responsive Design**: Fully responsive layout that works on all devices
- **Smooth Animations**: Hover effects, floating animations, and smooth transitions
- **Interactive Elements**: Project cards with 3D hover effects and glowing buttons

### 📱 Pages & Components
- **Home Component**: Hero section with animated background and project grid
- **Projects Component**: Dedicated projects page with filtering capabilities
- **Contact Component**: Form integration with reactive forms and validation
- **Admin Panel**: Netlify CMS integration for content management

### 🛠 Technical Features
- **Angular Framework**: Modern Angular 16+ with TypeScript
- **Reactive Forms**: Form validation and handling
- **Angular Router**: Client-side routing with navigation
- **Tailwind CSS**: Utility-first styling framework
- **CMS Integration**: Netlify CMS for easy content updates
- **Performance**: Optimized bundle and lazy loading ready

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/atjhub.git
   cd atjhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200/` to see the application

### Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build the application for production
- `npm run test` - Run unit tests
- `npm run serve` - Serve the built application locally

## 📁 Project Structure

```
atjhub/
├── src/
│   ├── app/
│   │   ├── home/
│   │   │   ├── home.component.html
│   │   │   ├── home.component.ts
│   │   │   └── home.component.css
│   │   ├── projects/
│   │   │   ├── projects.component.html
│   │   │   ├── projects.component.ts
│   │   │   └── projects.component.css
│   │   ├── contact/
│   │   │   ├── contact.component.html
│   │   │   ├── contact.component.ts
│   │   │   └── contact.component.css
│   │   ├── app.component.html
│   │   ├── app.component.ts
│   │   ├── app.component.css
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   └── styles.css
├── public/
│   └── admin/              # Netlify CMS admin interface
├── _data/                  # CMS data files
├── angular.json            # Angular CLI configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🛣️ Routing

The application uses Angular Router with the following routes:

- `''` (root) → `HomeComponent` - Landing page with hero and featured projects
- `'/projects'` → `ProjectsComponent` - Dedicated projects page with filtering
- `'/contact'` → `ContactComponent` - Contact form and information
- `'**'` → Redirects to home (404 handling)

## ⚙️ Configuration

### Customizing Components

Each component is self-contained with its own template, logic, and styles:

- **HomeComponent**: Contains hero section and featured projects grid
- **ProjectsComponent**: Full projects listing with category filtering
- **ContactComponent**: Contact form with reactive forms validation

### Styling

The application uses Tailwind CSS for styling. Custom styles can be added in:
- Component-specific CSS files (e.g., `home.component.css`)
- Global styles in `src/styles.css`

### Form Configuration

The contact form uses Angular Reactive Forms with validation:

```typescript
// In contact.component.ts
this.contactForm = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(2)]],
  email: ['', [Validators.required, Validators.email]],
  subject: ['', [Validators.required, Validators.minLength(5)]],
  message: ['', [Validators.required, Validators.minLength(10)]]
});
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with the production-ready application.

### Deploy to Netlify

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist/atjhub`

3. **Configure Netlify CMS**
   - Enable Netlify Identity in your site settings
   - Configure registration and access settings
   - Update the Formspree form ID in `_data/settings.yml`

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## 🔧 Development

### Adding New Components

1. **Generate a new component**
   ```bash
   ng generate component new-component
   ```

2. **Add to routing** (if needed)
   ```typescript
   // In app-routing.module.ts
   const routes: Routes = [
     // ... existing routes
     { path: 'new-route', component: NewComponentComponent }
   ];
   ```

### Adding New Features

- **Services**: Create services for data management and API calls
- **Guards**: Add route guards for authentication
- **Interceptors**: Add HTTP interceptors for API calls
- **Pipes**: Create custom pipes for data transformation

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact via the contact form on the website
- Email: hello@atjhub.com

---

**Built with ❤️ using Angular and modern web technologies** 