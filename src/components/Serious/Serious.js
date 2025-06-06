import React, { useRef } from 'react';
import './Serious.css';
import ShawnModel from '../ShawnModel.js';

export default function Serious() {
  // List of skills
  const skills = [
    'Python', 'PyTorch', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Flask', 
    'C++', 'C', 'Java', 'PHP', 'WordPress', 'CSS', 'SASS', 'Figma', 'Docker', 
    'Git', 'GitHub', 'GitHub Actions CI', 'GitHub Project', 'Expo', 'Vercel', 
    'Auth0', 'Supabase', 'Google Sheets API', 'Spotify API', 'Amazon S3', 
    'NoSQL', 'Three.js', 'WebGL', 'Scikit-Learn', 'XGBoost', 'Pandas', 'NumPy', 
    'Gemini', 'Vertex AI', 'Selenium', 'BeautifulSoup', 'Machine Learning', 
    'Deep Learning', 'LSTM', 'RNN', 'BERT', 'OpenBCI', 'Android Studio', 'JUnit', 
    'Android', 'Robolectric', 'Agile'
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
      title: 'organregistry.org',
      tools: 'Three.js, WebGL, React, Flask, NoSQL',
      description: 'A music distribution platform for independent artists in San Diego. Integrates a custom ASCII-based rendering system in React.',
      url: 'https://organregistry.org/'
    },
    {
      title: 'PillSnap',
      tools: 'React, Flask, Expo, Gemini, Vertex AI, Selenium, BeautifulSoup, Auth0',
      description: 'An application that uses computer vision to identify pills and provide drug interaction warnings. Won the MLH Best Use of Auth0 Award at DiamondHacks 2025.',
      url: 'https://devpost.com/software/pill-snap?_gl=1*jwtjab*_gcl_au*MTU4MzI4NTMxMS4xNzQzOTA4NDgx*_ga*MTIwMjIxNjE3MC4xNzQzOTA4NDgx*_ga_0YHJK3Y10M*MTc0NDM0ODEwMi40LjEuMTc0NDM0ODExMC4wLjAuMA..'
    },
    {
      title: 'MATES (Interactive Demo)',
      tools: 'React, Flask, BeautifulSoup4, Gemini',
      description: 'An application that helps SDSU students discover on-campus event recommendations while connecting them with like-minded peers. Won Most Technical Project award at the 2025 Innovate 4 SDSU Hackathon.',
      url: 'https://mates-alpha.vercel.app/'
    },
    {
      title: 'CiteTrace',
      tools: 'React Native, Flask, Expo, Gemini, Intel Tiber, Supabase, RAG',
      description: 'An application that transforms your collection of academic works into an interactive knowledge graph that intuitively visualizes, interprets, and connects hundreds of pages of research letting you explore document relationships and access AI-powered summaries in minutes.',
      url: 'https://devpost.com/software/inciteful'
    },
    {
      title: 'Kaibigang Pilipino',
      tools: 'React, SASS, Next.js, Supabase',
      description: 'Development for Kaibigang Pilipino, UC San Diego\'s Filipino-American Student Organization',
      url: 'https://www.kpucsd.com/'
    },
    {
      title: 'KSDT Radio Platform',
      tools: 'PHP, WordPress, CSS, React, Next.js',
      description: 'Development for KSDT Radio\'s live audio streaming and scheduling platform.',
      url: 'https://ksdt.ucsd.edu/'
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
                {/* Wrap the clickable text in a span with onClick handler */}
                <span 
                  style={{ textDecoration: 'none', cursor: 'pointer' }} 
                  onClick={scrollToProjects}
                >
                  Mathematics-Computer Science
                </span>{' '}
                and <a 
                  href="https://www.youtube.com/watch?v=rXZogPbVo9o&list=OLAK5uy_lHsqJ6eXUj1us_CHXU53wVlalb48GIAWE&index=5" 
                  style={{ color: '#C25A3C', textDecoration: 'none' }}
                  target="_blank" 
                  rel="noopener noreferrer"
                >Music</a> <br />
                @{' '}
                <a 
                  href="https://www.ucsd.edu" 
                  style={{ color: '#F1C500', textDecoration: 'none' }}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  UC San Diego
                </a>
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
