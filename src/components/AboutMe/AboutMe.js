import React from 'react';
import './AboutMe.css';
import ShawnModel from '../ShawnModel.js';

export default function AboutMe() {
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

  // Hackathon win count (kept for the about section)
  const hackathonWinCount = 7;

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
