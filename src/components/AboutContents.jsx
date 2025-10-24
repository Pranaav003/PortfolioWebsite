import React, { useState } from 'react';

const AboutContents = () => {
    const [hoveredSkill, setHoveredSkill] = useState(null);

    const skillsData = {
        // Languages
        'Python': {
            description: 'The very first language I learned. It\'s my go-to language for data science, machine learning, and rapid prototyping.',
            projects: ['Trading Bot', 'ASL Video Translator', 'News Web App']
        },
        'Java': {
            description: 'Java taught me object-oriented programming concepts. I use it for its robustness and platform independence.',
            projects: ['FosterNet Backend', 'University Course Projects']
        },
        'C': {
            description: 'C gives me deep understanding of memory management and system-level programming. It\'s perfect for performance-critical applications.',
            projects: ['University Course Projects', 'Algorithm Implementations']
        },
        // IDEs
        'Visual Studio Code': {
            description: 'My primary development environment. Easy to incorporate with my workflow.',
            projects: ['All Web Development Projects', 'React Applications']
        },
        'PyCharm': {
            description: 'The Python IDE that makes complex projects manageable. Excellent for data science and machine learning.',
            projects: ['Trading Bot', 'Machine Learning Models']
        },
        'IntelliJ IDEA': {
            description: 'Powerful Java IDE with advanced debugging and refactoring tools.',
            projects: ['FosterNet Backend', 'Java Coursework']
        },
        'Cursor': {
            description: 'Gives me a VS Code like experience with AI assistance. Ideal for a lean startup MVP.',
            projects: ['Startup MVPs']
        },
        // Development Tools
        'Git': {
            description: 'Essential version control system, ideal to collaborate and maintain clean code history.',
            projects: ['All Projects']
        },
        'Docker': {
            description: 'Containerization to package applications and their dependencies.',
            projects: ['FosterNet Deployment', 'Microservices Architecture']
        },
        'AWS': {
            description: 'Cloud computing platform that scales with my projects.',
            projects: ['FosterNet Hosting', 'Data Pipeline Projects']
        },
        // Web Technologies
        'HTML': {
            description: 'The foundation of web development, easy to learn and hard to master.',
            projects: ['Portfolio Website', 'FosterNet Frontend', 'News Web App', 'Voicely', 'University Course Projects']
        },
        'CSS': {
            description: 'The original styling framework for web development, I love creating simple yet eye-catching designs for the modern website.',
            projects: ['Portfolio Website', 'All Web Projects']
        },
        'Tailwind CSS': {
            description: 'My absolute favorite styling component, plug and play makes it enjoyable to create intricate designs with ease.',
            projects: ['Portfolio Website', 'All Web Projects']
        },
        'React': {
            description: 'Component-based development makes complex UIs manageable, one of the first web development frameworks I learned.',
            projects: ['Portfolio Website', 'FosterNet Frontend', 'News Web App']
        },
        // AI & ML
        'PyTorch': {
            description: 'The Python library for deep learning. I use it for building machine learning models.',
            projects: ['Trading Bot', 'ASL Video Translator', 'News Classification']
        },
        'TensorFlow': {
            description: 'Powerful framework for deep learning. I use it for complex neural networks and model training.',
            projects: ['ASL Video Translator', 'Trading Bot Predictions']
        },
    };

    const SkillBox = ({ skillName }) => (
        <div 
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow duration-200 relative group cursor-pointer"
            onMouseEnter={() => setHoveredSkill(skillName)}
            onMouseLeave={() => setHoveredSkill(null)}
        >
            <h5 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm text-center">{skillName}</h5>
            
            {/* Hover Tooltip */}
            {hoveredSkill === skillName && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 sm:p-4 z-50 max-w-xs sm:max-w-sm">
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-3">
                        {skillsData[skillName]?.description}
                    </p>
                    <div>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">Projects:</p>
                        <div className="flex flex-wrap gap-1">
                            {skillsData[skillName]?.projects.map((project, index) => (
                                <span 
                                    key={index}
                                    className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                                >
                                    {project}
                                </span>
                            ))}
                        </div>
            </div>
            </div>
            )}
            </div>
    );

    return (
        <div className="px-4 sm:px-6 md:px-8 lg:px-10 font-inter">
            <div className="text-center max-w-4xl mx-auto">
                <div className="text-center mb-4 px-4 sm:px-6 md:px-10 font-inter opacity-50 font-normal lg:leading-[35.5px] lg:text-xl md:leading-[29px] md:text-lg sm:leading-[23px] sm:text-normal xs:leading-[20px] xs:text-sm -mt-8 sm:-mt-12 md:-mt-16 lg:-mt-20 xl:-mt-28">
                I'm Pranaav Iyer, a 22 year old developer with a strong passion for innovation and problem solving. I specialize in crafting
                satisfying software solutions that prioritize creativeness and usability, involving industry standards from AI to frontend/backend
                technologies.
                <div>
                Let's innovate together.
                    </div>
                </div>

                <div>
                    {/* Languages */}
                    <div className="mb-8 flex flex-col lg:flex-row gap-4 lg:gap-6">
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white lg:w-48 flex-shrink-0 text-center lg:text-left">Languages</h4>
                         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3 flex-1">
                             <SkillBox skillName="Python" />
                             <SkillBox skillName="Java" />
                             <SkillBox skillName="C" />
                         </div>
                    </div>

                    {/* IDEs and Code Editors */}
                    <div className="mb-8 flex flex-col lg:flex-row gap-4 lg:gap-6">
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white lg:w-48 flex-shrink-0 text-center lg:text-left">IDEs and Code Editors</h4>
                         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 flex-1">
                             <SkillBox skillName="Visual Studio Code" />
                             <SkillBox skillName="PyCharm" />
                             <SkillBox skillName="IntelliJ IDEA" />
                             <SkillBox skillName="Cursor" />
                         </div>
                    </div>

                    {/* Development Tools */}
                    <div className="mb-8 flex flex-col lg:flex-row gap-4 lg:gap-6">
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white lg:w-48 flex-shrink-0 text-center lg:text-left">Development Tools</h4>
                         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3 flex-1">
                             <SkillBox skillName="Git" />
                             <SkillBox skillName="Docker" />
                             <SkillBox skillName="AWS" />
                         </div>
                    </div>

                    {/* Web Technologies */}
                    <div className="mb-8 flex flex-col lg:flex-row gap-4 lg:gap-6">
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white lg:w-48 flex-shrink-0 text-center lg:text-left">Web Technologies</h4>
                         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 flex-1">
                             <SkillBox skillName="HTML" />
                             <SkillBox skillName="CSS" />
                             <SkillBox skillName="Tailwind CSS" />
                             <SkillBox skillName="React" />
                         </div>
                    </div>

                    {/* AI & Machine Learning */}
                    <div className="mb-8 flex flex-col lg:flex-row gap-4 lg:gap-6">
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white lg:w-48 flex-shrink-0 text-center lg:text-left">AI & Machine Learning</h4>
                         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3 flex-1">
                             <SkillBox skillName="PyTorch" />
                             <SkillBox skillName="TensorFlow" />
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutContents;
