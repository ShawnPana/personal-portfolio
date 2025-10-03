import React, { useRef } from 'react';
import './Serious.css';
import ShawnModel from '../ShawnModel.js';

export default function Serious() {
  // List of skills
  const skills = [
    'Python', 'PyTorch', 'JavaScript', 'TypeScript', 'React', 'React Native', 'Next.js', 'Flask',
    'FastAPI', 'Pydantic', 'Vite', 'C++', 'C', 'Java', 'PHP', 'WordPress', 'SASS', 'Docker',
    'GitHub', 'Expo', 'Vercel',
    'Auth0', 'Supabase', 'Amazon S3',
    'NoSQL', 'Three.js', 'WebGL', 'Scikit-Learn', 'XGBoost', 'Pandas', 'NumPy',
    'Gemini', 'Claude', 'Browser Use', 'LangChain', 'Vertex AI', 'Selenium', 'BeautifulSoup',
    'LSTM', 'RNN', 'RAG', 'OpenBCI', 'JUnit',
    'Android', 'Agile', 'Librosa', 'Google Cloud Run'
  ];

  // Function to render skill tags
  const renderSkills = () => {
    return skills.map((skill, index) => (
      <div key={index} className="skill-tag">{skill}</div>
    ));
  };

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

  // Count hackathon wins
  const hackathonWinCount = projects.filter(project => project.hackathonWinner).length;

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

  // Create a ref for the projects section
  const projectsRef = useRef(null);

  // Function to scroll to projects section
  const scrollToProjects = () => {
    projectsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="container">
      
      {/* HERO SECTION: Left = title, About/Contact; Right = 3D Model */}
      <div className="hero-section">
        {/* Left Column */}
        <div className="hero-left">
          <h1>
            Shawn Pana
            <br />
            <span className="hero-subheading">
              Software Engineer & <br /> Machine Learning Developer
            </span>
          </h1>
          {/* The rest of your hero-left content (About, Contact) goes here */}
          <div className="info-section">
            <div className="info-item">
              <h2>About Me</h2>
              <p>
                Mathematics-Computer Science and <a
                  href="https://www.youtube.com/watch?v=rXZogPbVo9o&list=OLAK5uy_lHsqJ6eXUj1us_CHXU53wVlalb48GIAWE&index=5"
                  style={{ color: '#C25A3C', textDecoration: 'none' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >Music</a> <br />
                @ <a
                  href="https://www.ucsd.edu"
                  style={{ color: '#F1C500', textDecoration: 'none' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  UC San Diego
                </a>. <br />
                Growth Engineer at <a
                  href="https://github.com/browser-use/browser-use"
                  style={{ color: '#6366f1', textDecoration: 'none' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >Browser Use</a>. <br />
                {hackathonWinCount}x <a
                  href="https://devpost.com/ShawnPana"
                  style={{ color: '#003E54', textDecoration: 'none' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hackathon
                </a> Winner.
              </p>
            </div>

            <div className="info-item">
              <h2>Contact Me</h2>
              <p>
                Email me directly at{' '}
                <a 
                  href="mailto:spana@ucsd.edu" 
                  style={{ color: '#F1C500', textDecoration: 'none' }}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  spana@ucsd.edu
                </a>.
                <br />
                You can also message me on{' '}
                <a 
                  href="https://www.linkedin.com/in/shawnpana/" 
                  style={{ color: '#0077B5', textDecoration: 'none' }}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>{' '}or{' '}
                <a 
                  href="https://x.com/shawn_pana" 
                  style={{ color: '#E1E8ED', textDecoration: 'none' }}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  X
                </a>.
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: 3D Model */}
        <div className="hero-right">
          <ShawnModel />
        </div>
      </div>

      {/* Projects Section */}
      <div className="section" ref={projectsRef}>
        <h2>Projects</h2>
        <div className="projects-carousel-container">
          <div className="projects-grid">
            {renderProjects()}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="section">
        <h2>Skills</h2>
        <div className="skills-list">
          {renderSkills()}
        </div>
      </div>
    </div>
  );
}
