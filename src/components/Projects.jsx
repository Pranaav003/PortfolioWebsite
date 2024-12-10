import React from 'react';
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
        link: 'https://github.com/Pranaav003/AirbnbClone',
        date: 'August 2024',
        hovertitle: 'Breaking News'
    },
    {
        title: 'Voicely',
        description: 'An AI-powered customer service solution that transcribes and analyzes customer concerns in real-time, generates personalized responses, and efficiently routes calls to the appropriate department for seamless support.',
        imageUrl: 'Voicely.png',
        link: 'https://github.com/Pranaav003/AirbnbClone',
        date: 'September 2024',
        hovertitle: 'Freed from Annoyance'
    },
];


    // Add more projects as needed

const Projects = () => {
    const isMobile = window.innerWidth <= 480;

    return (
        <div id="portfolio" className="relative text-center w-full flex flex-col items-center font-inter mt-[-150px] lg:mt-[-250px] md:mt-[-250px]">
            <div className="flex flex-wrap gap-6 justify-center mt-[-170px] md:mt-[-130px]">
                {projectsData.map((project, index) => (
                    isMobile ? (
                        <div key={index} className="relative border rounded-lg shadow-lg p-4 w-80 group transform transition-transform duration-300 hover:scale-105">
                            <motion.div 
                                className="relative border rounded-lg shadow-lg p-4 w-80 group transform transition-transform duration-300 hover:scale-105"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} // Ensures the animation runs only once
                                transition={{ duration: 0.5, delay: index * 0.3 }} // Reduced delay for faster loading
                            >
                                <div className="relative overflow-hidden rounded-t-lg">
                                    <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-75"></div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                                    <p className="text-gray-400 text-sm">{project.date}</p>
                                </div>
                                <div className="absolute inset-0 bg-gray-800 rounded-lg bg-opacity-90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                                    <p className="text-xl font-semibold text-white">{project.hovertitle}</p>
                                    <p className="text-white mt-2">{project.description}</p>
                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline pt-3 mb-2 block">
                                        <button className="bg-white text-[#404040] px-3 py-1 rounded">View Project</button>
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <Tilt options={defaultOptions} key={index}>
                            <motion.div 
                                className="relative border rounded-lg shadow-lg p-4 w-80 group transform transition-transform duration-300 hover:scale-105"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} // Ensures the animation runs only once
                                transition={{ duration: 0.5, delay: index * 0.3 }} // Reduced delay for faster loading
                            >
                                <div className="relative overflow-hidden rounded-t-lg">
                                    <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-75"></div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                                    <p className="text-gray-400 text-sm">{project.date}</p>
                                </div>
                                <div className="absolute inset-0 bg-gray-800 rounded-lg bg-opacity-90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                                    <p className="text-xl font-semibold text-white">{project.hovertitle}</p>
                                    <p className="text-white mt-2">{project.description}</p>
                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline pt-3 mb-2 block">
                                        <button className="bg-white text-[#404040] px-3 py-1 rounded">View Project</button>
                                    </a>
                                </div>
                            </motion.div>
                        </Tilt>
                    )
                ))}
            </div>
        </div>
    );
}

export default Projects;
