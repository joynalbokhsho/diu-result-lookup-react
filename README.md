# DIU Result Lookup

![DIU Result Lookup Screenshot](https://daffodilvarsity.edu.bd/template/images/diulogoside.png)

A modern web application for Daffodil International University students to check their semester results quickly and easily.

## Features

- 🚀 Fast result lookup by student ID and semester
- 📊 Detailed grade information display
- 📱 Fully responsive design for all devices
- 🖨️ Professional print functionality
- 💬 Personalized, grade-specific motivational messages
- ✨ Clean, intuitive user interface
- 🔍 Real-time API status monitoring
- ⚡ Smart form disabling until API check completes
- 🔗 Direct link to official DIU student portal as alternative

## Live Demo

Visit the live application:
- [Main Pages](https://diu.joynalbokhsho.me)
- [Cloudflare Pages](https://diuresult.pages.dev/) (faster performance)

## Important Notice

**API Status**: The DIU University has changed their API from public to private access. When the API is unavailable, the application automatically disables the search functionality and provides a direct link to the [official DIU Student Portal](https://studentportal.diu.edu.bd/academic-result) as an alternative.

## Technologies Used

- **React** - Frontend library for building the user interface
- **Bootstrap 5** - Responsive CSS framework
- **React Icons** - Icon components for visual elements
- **Cloudflare Pages/GitHub Pages** - For deployment and hosting

## Setup and Installation

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation Steps

1. Clone the repository
   ```
   git clone https://github.com/joynalbokhsho/diu-result-lookup-react.git
   cd diu-result-lookup-react
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

4. Build for production
   ```
   npm run build
   ```

## Project Structure

```
diu/
├── public/              # Public assets
├── src/                 # Source files
│   ├── assets/          # CSS and other assets
│   ├── components/      # React components
│   ├── App.jsx          # Main app component
│   └── index.js         # Application entry point
└── build/               # Production build
```

## Key Components

- **Hero.jsx** - Search form with API status checking and smart form disabling
- **ServerStatus.jsx** - Real-time API status monitoring component
- **ResultSection.jsx** - Displays the student's grades and information
- **FeaturesSection.jsx** - Showcases application features
- **Navbar.jsx** - Navigation header
- **Footer.jsx** - Contains footer information and credits

## API Status Monitoring

The application includes intelligent API status monitoring:

- **Initial Check**: Form is disabled until the first API status check completes
- **Real-time Monitoring**: Continuous API status checking every 30 seconds
- **Smart UI Updates**: Form automatically enables/disables based on API availability
- **User Feedback**: Clear status indicators and helpful messages
- **Alternative Access**: Direct link to official DIU portal when API is unavailable

## Deployment

### GitHub Pages Deployment

```
npm run deploy
```

### Cloudflare Pages Deployment

The project is set up for automatic deployment to Cloudflare Pages whenever changes are pushed to the main branch.

## Print Functionality

The application includes a specially designed print view that:
- Fits perfectly on a single A4 page
- Includes the DIU logo and branding
- Provides all essential result information
- Shows motivational messages based on student performance

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

Developed by [Joynal Bokhsho](https://joynalbokhsho.me)

---

© 2025 DIU Result Lookup. All Rights Reserved.