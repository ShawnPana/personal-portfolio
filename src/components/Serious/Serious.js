import './Serious.css'; // Make sure the path matches the actual location

export default function Serious() {
    return (
        <div className="container">
            <div className="header">
                <h1>Shawn Pana</h1>
                <h2>Software Engineer & Machine Learning Developer</h2>
            </div>
            
            <div className="section about">
                <h2>About Me</h2>
                <p>I am a first-generation Filipino-American undergraduate at the University of California, San Diego (UCSD) studying Mathematics and Computer Science. My interests lie in creative coding, mathematics and computer science education, and ML/DL.</p>
            </div>
            
            <div className="section">

            <h2>Projects</h2>
            <div className="projects-grid">
                <div className="project-card">
                <h3>UCSD Kaibigang Pilipino Website</h3>
                <p className="bullet">Development of UCSD Kaibigang Pilipino's website, transforming Figma prototypes into dynamic, user-friendly interfaces for 2000+ users through iterative Agile sprints.</p>
                <p className="bullet">Optimized content delivery by enhancing API efficiency with Google Sheets integration, improving website performance, and scalability, while spearheading the implementation of a secure Supabase-based user authentication system.</p>
                <p className="bullet">Tools: Javascript, React, SASS, Next.js, Figma, Google Sheets API, Supabase</p>
                </div>  

                <div className="project-card">
                <h3>KSDT Radio Platform</h3>
                <p className="bullet">Maintenance of KSDT Radio's live audio streaming and scheduling platform, collaborating with the design team to implement UX/UI updates from Figma, improving user experience for over 500+ active users.</p>
                <p className="bullet">Led and coordinated a development team using Agile methodologies, organizing tasks into user stories, sprints, and milestones to ensure continuous progress and delivery.</p>
                <p className="bullet">Tools: PHP, WordPress, CSS, React, Next.js</p>
                </div>

                <div className="project-card">
                <h3>PillSnap</h3>
                <p className="bullet">Developed PillSnap, a full-stack application that uses computer vision to identify pills, provide drug interaction warnings, and store medication data securely.</p>
                <p className="bullet">Integrated and fine-tuned the Gemini API using Vertex AI to focus on feature extraction, utilized Drugs.com for up-to-date FDA drug information, and implemented Auth0 for secure user authentication.</p>
                <p className="bullet">Won the MLH Best Use of Auth0 Award at DiamondHacks 2025 for innovative implementation of secure login and data protection.</p>
                <p className="bullet">Tools: Expo, React, TypeScript, Vercel, Auth0, Python, Flask, Selenium, BeautifulSoup, Gemini, Vertex AI, Drugs.com, openFDA</p>
                </div>

                <div className="project-card">
                <h3>OrganRegistry.org</h3>
                <p className="bullet">Engineered a custom ASCII-based rendering system in React for OrganRegistry.org for music playback and distribution.</p>
                <p className="bullet">Streamlined text and image-to-ASCII conversion with lossless compression, improving rendering efficiency by more than 10% using a Dockerized Flask backend to integrate Spotify's API and Amazon S3 for seamless data storage, retrieval, and machine learning model deployment.</p>
                <p className="bullet">Tools: React, Python, Flask, Docker, Spotify API, Amazon S3, NoSQL, Machine Learning, Three.js, WebGL</p>
                </div>

                <div className="project-card">
                <h3>Supervised Sentiment Classification for Fantasy RPGs</h3>
                <p className="bullet">Developed a supervised sentiment analysis model tailored for fantasy role-playing dialogue systems (OrganRegistry.org's Organ Trail game), training on fictional movie scripts to capture the linguistic style and emotional nuances of a fantasy setting.</p>
                <p className="bullet">Fine-tuned XGBoost classifiers across ten emotional categories (joy, sadness, disgust, fear, anger, surprise, calmness, confusion, anxiety, and lust) using exhaustive Grid Search, achieving precision, recall, and f1-scores of up to 95%, ensuring highly accurate emotional classification.</p>
                <p className="bullet">Tools: XGBoost, Scikit-Learn, Pandas, Numpy</p>
                </div>

                <div className="project-card">
                <h3>Recurrent Neural Networks for Time Series Forecasting</h3>
                <p className="bullet">Developed and trained a recurrent neural network (RNN) model, utilizing Long Short-Term Memory (LSTM) units, for time series forecasting of fractional Brownian motion (FBM) with an emphasis on long-range dependence.</p>
                <p className="bullet">Implemented a new model architecture, the Neural Quantile Function RNN (NQF-RNN), for probabilistic forecasting using quantile regression to generate a full predictive distribution.</p>
                <p className="bullet">Conducted extensive experiments to fine-tune the models, optimizing them with learning rate scheduling techniques like Cosine Annealing and ReduceLROnPlateau, achieving significant improvements in forecast accuracy.</p>
                <p className="bullet">Tools: PyTorch</p>
                </div>

                <div className="project-card">
                <h3>Triton NeuroTech Neural Prosthetic Project</h3>
                <p className="bullet">Contributed to the Machine Learning team on the Neural Prosthetic project, using Python, PyTorch, and OpenBCI to preprocess and model muscle signal data, enabling efficient signal interpretation and enhancing model accuracy.</p>
                <p className="bullet">Tools: Python, PyTorch, OpenBCI</p>
                </div>

                <div className="project-card">
                <h3>Deep Learning Coursework</h3>
                <p className="bullet">Implemented backpropagation, stochastic gradient descent, momentum, and L2/L1 regularization from scratch using Numpy, achieving 88.18% accuracy on the FashionMNIST dataset.</p>
                <p className="bullet">Developed a fully convolutional network for semantic segmentation on the PASCAL VOC-2012 dataset, improving mean IoU to 0.074 and pixel accuracy to 0.881 using techniques like transfer learning and data augmentation.</p>
                <p className="bullet">Implemented and compared vanilla RNN and LSTM models for character-level text generation on the TinyShakespeare dataset, evaluating the impact of teacher forcing, sequence length, and hidden layer size, with LSTM outperforming RNN in all experiments.</p>
                <p className="bullet">Investigated various fine-tuning methods for pretrained BERT, including LoRA, warm-up steps, SWA, and contrastive learning, achieving test accuracy of 0.92 on the Amazon Massive Scenario dataset.</p>
                <p className="bullet">Tools: PyTorch, Numpy</p>
                </div>
            </div>
            </div>

            <div className="section">
                <h2>Skills</h2>
                <div className="skills-list">
                    <div className="skill-tag">Python</div>
                    <div className="skill-tag">PyTorch</div>
                    <div className="skill-tag">JavaScript</div>
                    <div className="skill-tag">TypeScript</div>
                    <div className="skill-tag">React</div>
                    <div className="skill-tag">Next.js</div>
                    <div className="skill-tag">Flask</div>
                    <div className="skill-tag">C++</div>
                    <div className="skill-tag">C</div>
                    <div className="skill-tag">Java</div>
                    <div className="skill-tag">PHP</div>
                    <div className="skill-tag">WordPress</div>
                    <div className="skill-tag">CSS</div>
                    <div className="skill-tag">SASS</div>
                    <div className="skill-tag">Figma</div>
                    <div className="skill-tag">Docker</div>
                    <div className="skill-tag">Git</div>
                    <div className="skill-tag">GitHub</div>
                    <div className="skill-tag">GitHub Actions CI</div>
                    <div className="skill-tag">GitHub Project</div>
                    <div className="skill-tag">Expo</div>
                    <div className="skill-tag">Vercel</div>
                    <div className="skill-tag">Auth0</div>
                    <div className="skill-tag">Supabase</div>
                    <div className="skill-tag">Google Sheets API</div>
                    <div className="skill-tag">Spotify API</div>
                    <div className="skill-tag">Amazon S3</div>
                    <div className="skill-tag">NoSQL</div>
                    <div className="skill-tag">Three.js</div>
                    <div className="skill-tag">WebGL</div>
                    <div className="skill-tag">Scikit-Learn</div>
                    <div className="skill-tag">XGBoost</div>
                    <div className="skill-tag">Pandas</div>
                    <div className="skill-tag">NumPy</div>
                    <div className="skill-tag">Gemini</div>
                    <div className="skill-tag">Vertex AI</div>
                    <div className="skill-tag">Selenium</div>
                    <div className="skill-tag">BeautifulSoup</div>
                    <div className="skill-tag">Machine Learning</div>
                    <div className="skill-tag">Deep Learning</div>
                    <div className="skill-tag">LSTM</div>
                    <div className="skill-tag">RNN</div>
                    <div className="skill-tag">BERT</div>
                    <div className="skill-tag">OpenBCI</div>
                    <div className="skill-tag">Android Studio</div>
                    <div className="skill-tag">JUnit</div>
                    <div className="skill-tag">Android</div>
                    <div className="skill-tag">Robolectric</div>
                    <div className="skill-tag">Agile</div>
                </div>
            </div>
        </div>
    );
}