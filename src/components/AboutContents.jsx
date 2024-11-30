import React, { useRef } from 'react';
import { motion, useInView } from "framer-motion";
import CountUp from 'react-countup';

const ProgressBar = () => {
    const aiRef = useRef(null);
    const htmlRef = useRef(null);
    const reactRef = useRef(null);
    const javaRef = useRef(null);

    // Framer Motion `useInView` hook to check if an element is in the viewport
    const aiInView = useInView(aiRef, { once: true });
    const htmlInView = useInView(htmlRef, { once: true });
    const reactInView = useInView(reactRef, { once: true });
    const javaInView = useInView(javaRef, { once: true });

    return (
        <div className="relative sm:bottom-[150px] xs:bottom-[50px] px-10 font-bold font-inter sm:text-[16px] xs:text-[13px]">
            <div className="relative w-[50%] h-5 dark:bg-neutral-800 rounded-full">
                <p className="absolute bottom-5">AI / MACHINE LEARNING / PYTHON</p>
                <motion.div
                    ref={aiRef}
                    className="h-full text-center text-[14px] text-white bg-gradient-to-r from-[#2CD73E] via-[#00C878] to-[#00B5AB] rounded-full sm:text-[14px] xs:text-[13px]"
                    initial={{ width: 0 }}
                    animate={aiInView ? { width: "85%" } : { width: 0 }}
                    transition={{ duration: 2 }}
                >
                    {aiInView && <CountUp start={0} end={85} duration={2} suffix="%" />}
                </motion.div>
            </div>

            <div className="w-[50%] relative h-5 dark:bg-neutral-800 rounded-full mt-8">
                <p className="absolute bottom-5">HTML / CSS / TAILWIND</p>
                <motion.div
                    ref={htmlRef}
                    className="h-full text-center text-[14px] text-white bg-gradient-to-r from-[#34a7e1] via-[#5290d2] to-[#616dba] rounded-full sm:text-[14px] xs:text-[13px]"
                    initial={{ width: 0 }}
                    animate={htmlInView ? { width: "65%" } : { width: 0 }}
                    transition={{ duration: 2 }}
                >
                    {htmlInView && <CountUp start={0} end={65} duration={2} suffix="%" />}
                </motion.div>
            </div>

            <div className="w-[50%] relative h-5 dark:bg-neutral-800 rounded-full mt-8">
                <p className="absolute bottom-5">REACT</p>
                <motion.div
                    ref={reactRef}
                    className="h-full text-center text-[14px] text-white bg-gradient-to-r from-[#da3232] via-[#E02360] to-[#D5318C] rounded-full sm:text-[14px] xs:text-[13px]"
                    initial={{ width: 0 }}
                    animate={reactInView ? { width: "50%" } : { width: 0 }}
                    transition={{ duration: 2 }}
                >
                    {reactInView && <CountUp start={0} end={50} duration={2} suffix="%" />}
                </motion.div>
            </div>

            <div className="w-[50%] relative h-5 dark:bg-neutral-800 rounded-full mt-8">
                <p className="absolute bottom-5">JAVA / C</p>
                <motion.div
                    ref={javaRef}
                    className="h-full text-center text-[14px] text-white bg-gradient-to-r from-[#FFC75F] via-[#FF9671] to-[#FF6F91] rounded-full sm:text-[14px] xs:text-[13px]"
                    initial={{ width: 0 }}
                    animate={javaInView ? { width: "75%" } : { width: 0 }}
                    transition={{ duration: 2 }}
                >
                    {javaInView && <CountUp start={0} end={75} duration={3} suffix="%" />}
                </motion.div>
            </div>

            <div className="relative text-center float-right bottom-[201px] px-10 w-[50%] font-inter opacity-50 font-normal lg:leading-[35.5px] lg:text-xl md:leading-[29px] md:text-lg md:px-0 sm:leading-[23px] sm:text-normal sm:px-0 xs:leading-[20px] xs:text-sm xs:px-0">
                I'm Pranaav Iyer, a 21 year old developer with a strong passion for innovation and problem solving. I specialize in crafting
                satisfying software solutions that prioritize creativeness and usability, involving industry standards from AI to frontend/backend
                technologies.
                <div>
                Let's innovate together.
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
