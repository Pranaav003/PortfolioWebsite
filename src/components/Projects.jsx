import React, { useState, useEffect } from 'react';
import { Tilt } from 'react-tilt'
import { motion } from "motion/react"

const defaultOptions = {
    reverse:        false,  // reverse the tilt direction
    max:            30,     // max tilt rotation (degrees)
    perspective:    800,   // Transform perspective, the lower the more extreme the tilt gets.
    scale:          1.0,   // 2 = 200%, 1.5 = 150%, etc..
    speed:          1000,   // Speed of the enter/exit transition
    transition:     true,   // Set a transition on enter/exit.
    axis:           null,   // What axis should be disabled. Can be X or Y.
    reset:          true,   // If the tilt effect has to be reset on exit.
    easing:         "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
}

const projectsData = [
    {
        title: 'Trading Bot',
        description: 'A powerful machine learning-based trading bot that predicts stock prices with high accuracy, helping users make informed and profitable investment decisions.',
        imageUrl: '/trading.png',
        link: 'https://github.com/Pranaav003/Thinkorswim-Trading-Bot',
        date: 'October 2023',
        hovertitle: 'A Clinic in Aggressive Trading'
    },
    {
        title: 'FosterNet',
        description: 'An innovative web platform that bridges the gap between foster animals and potential foster parents, streamlining the fostering process and promoting pet welfare.',
        imageUrl: '/fosternet.png',
        link: 'https://github.com/Pranaav003/FosterNet',
        date: 'January 2024',
        hovertitle: 'A Tail of Two Kitties'
    },
    {
        title: 'ASL Video Translator',
        description: 'A cutting-edge web application that translates English into American Sign Language using advanced self-trained models, breaking communication barriers for the deaf community.',
        imageUrl: '/Asl.png',
        link: 'https://github.com/Pranaav003/ASLMachineLearning',
        date: 'August 2024',
        hovertitle: 'Signs of Progress'
    },
    {
        title: 'News Web App',
        description: 'An AI-powered platform that curates and displays the latest news from diverse sources, delivering personalized updates to users in real-time.',
        imageUrl: '/News.png',
        link: 'https://github.com/Pranaav003/NewsWebApp',
        date: 'August 2024',
        hovertitle: 'Breaking News'
    },
    {
        title: 'Voicely',
        description: 'An AI-powered customer service solution that transcribes and analyzes customer concerns in real-time, generates personalized responses, and efficiently routes calls to the appropriate department for seamless support.',
        imageUrl: 'Voicely.png',
        link: 'https://github.com/Pranaav003',
        date: 'September 2024',
        hovertitle: 'Freed from Annoyance'
    },
];


    // Add more projects as needed

const Projects = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth <= 480);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const ProjectCard = ({ project, index }) => {
        const cardContent = (
            <motion.div 
                className="relative border rounded-lg shadow-lg p-3 sm:p-4 w-full max-w-sm mx-auto group transform transition-transform duration-300 hover:scale-105"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
            >
                <div className="relative overflow-hidden rounded-t-lg">
                    <img src={project.imageUrl} alt={project.title} className="w-full h-32 sm:h-40 md:h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-75"></div>
                </div>
                <div className="p-2 sm:p-4">
                    <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">{project.date}</p>
                </div>
                <div className="absolute inset-0 dark:bg-gray-800 bg-gray-200 rounded-lg bg-opacity-90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 sm:p-4">
                    <p className="text-sm sm:text-lg md:text-xl font-semibold text-black dark:text-white text-center">{project.hovertitle}</p>
                    <p className="dark:text-white text-black mt-1 sm:mt-2 text-xs sm:text-sm text-center px-2">{project.description}</p>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline pt-2 sm:pt-3 mb-1 sm:mb-2 block">
                        <button className="bg-white text-[#404040] px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">View Project</button>
                    </a>
                </div>
            </motion.div>
        );

        return isMobile ? (
            <div key={index}>
                {cardContent}
            </div>
        ) : (
            <Tilt options={defaultOptions} key={index}>
                {cardContent}
            </Tilt>
        );
    };

    return (
        <div className="relative text-center w-full flex flex-col items-center font-inter px-4">
            <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-black mb-6 sm:mb-8">
                Selected Portfolio
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full max-w-7xl">
                {projectsData.map((project, index) => (
                    <ProjectCard key={index} project={project} index={index} />
                ))}
            </div>
        </div>
    );
}

export default Projects;
