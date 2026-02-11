import React from 'react';
import './Projects.css';

export default function Projects() {
  // List of projects with bullet points and a URL property
  const projects = [
    {
      title: 'Resume Use',
      tools: 'Python, FastAPI, Pydantic, Browser Use',
      description: 'AI-powered resume platform that automatically generates tailored resumes and synchronizes updates across LinkedIn, Simplify, and other job platforms using Browser Use web agents.',
      url: 'https://github.com/ShawnPana/resume-use',
      hackathonWinner: false
    },
    {
      title: 'Job Use',
      tools: 'Python, FastAPI, Pydantic, Browser Use',
      description: 'Automated job application system that leverages Browser Use web agents to apply for positions across multiple platforms using candidate work experience and project data.',
      url: 'https://github.com/Cheggin/Job-Use',
      hackathonWinner: true
    },
    {
      title: 'News Use',
      tools: 'Python, FastAPI, Browser Use',
      description: 'Personalized news aggregation platform that uses Browser Use web agents to search major news outlets (NYT, Washington Post) based on user queries and delivers AI-generated summaries.',
      url: 'https://github.com/Cheggin/news-use',
      hackathonWinner: false
    },
    {
      title: 'BetterWeb',
      tools: 'React, TypeScript, Python, Browser Use, Claude API, Convex, Vite',
      description: 'Chrome extension that uses browser agents to persistently transform any website\'s CSS using natural language, enabling personalized styling and WCAG-compliant accessibility improvements across all web pages.',
      url: 'https://github.com/Cheggin/YC-Agents-Hackathon',
      hackathonWinner: true
    },
    {
      title: 'SFGovTV++',
      tools: 'Vite, React, FastAPI, Supabase, pgVector, Gemini, Claude, LangChain, BeautifulSoup4',
      description: 'Transforms San Francisco Board of Supervisors meetings into an interactive, searchable video experience with AI-generated summaries and advanced navigation. Won 3rd place at SF10x Hackathon.',
      url: 'https://devpost.com/software/your-city-hall-digest-san-francisco',
      hackathonWinner: true
    },
    {
      title: 'CiteTrace',
      tools: 'React Native, Flask, Expo, Gemini, Intel Tiber, Supabase, RAG',
      description: 'An application that transforms your collection of academic works into an interactive knowledge graph that intuitively visualizes, interprets, and connects hundreds of pages of research letting you explore document relationships and access AI-powered summaries in minutes. Won First Place at Intel Hack 2025.',
      url: 'https://devpost.com/software/inciteful',
      hackathonWinner: true
    },
    {
      title: 'PillSnap',
      tools: 'React, Flask, Expo, Gemini, Vertex AI, Selenium, BeautifulSoup, Auth0',
      description: 'An application that uses computer vision to identify pills and provide drug interaction warnings. Won the MLH Best Use of Auth0 Award at DiamondHacks 2025.',
      url: 'https://devpost.com/software/pill-snap?_gl=1*jwtjab*_gcl_au*MTU4MzI4NTMxMS4xNzQzOTA4NDgx*_ga*MTIwMjIxNjE3MC4xNzQzOTA4NDgx*_ga_0YHJK3Y10M*MTc0NDM0ODEwMi40LjEuMTc0NDM0ODExMC4wLjAuMA..',
      hackathonWinner: true
    },
    {
      title: 'MATES (Interactive Demo)',
      tools: 'React, Flask, BeautifulSoup4, Gemini',
      description: 'An application that helps SDSU students discover on-campus event recommendations while connecting them with like-minded peers. Won Most Technical Project award at the 2025 Innovate 4 SDSU Hackathon.',
      url: 'https://mates-alpha.vercel.app/',
      hackathonWinner: true
    },
    {
      title: 'Bouncer',
      tools: 'React Native, TypeScript, Expo, Flask, Claude, Gemini, Supabase, Vercel',
      description: 'Comprehensive risk assessment platform for databases using publicly available information, providing detailed risk-level reports and access control insights for database owners.',
      url: 'https://devpost.com/software/bouncer-7cvsgz',
      hackathonWinner: false
    },
    {
      title: 'organregistry.org',
      tools: 'Three.js, WebGL, React, Flask, NoSQL',
      description: 'A music distribution platform for independent artists in San Diego. Integrates a custom ASCII-based rendering system in React.',
      url: 'https://organregistry.org/',
      hackathonWinner: false
    },
    {
      title: 'Kaibigang Pilipino',
      tools: 'React, SASS, Next.js, Supabase',
      description: 'Development for Kaibigang Pilipino, UC San Diego\'s Filipino-American Student Organization',
      url: 'https://www.kpucsd.com/',
      hackathonWinner: false
    },
    {
      title: 'KSDT Radio Platform',
      tools: 'PHP, WordPress, CSS, React, Next.js',
      description: 'Development for KSDT Radio\'s live audio streaming and scheduling platform.',
      url: 'https://ksdt.ucsd.edu/',
      hackathonWinner: false
    }
  ];

  // Function to render project cards as clickable elements
  const renderProjects = () => {
    return projects.map((project, index) => (
      <a
        key={index}
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div className="project-card">
          {project.hackathonWinner && (
            <div className="hackathon-star">★</div>
          )}
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <p><strong>Tools:</strong> {project.tools}</p>
        </div>
      </a>
    ));
  };

  return (
    <div className="container">
      {/* Projects Section */}
      <div className="section">
        <h2>Projects</h2>
        <div className="projects-carousel-container">
          <div className="projects-grid">
            {renderProjects()}
          </div>
        </div>
      </div>
    </div>
  );
}
