import React from 'react'

const ProgressBar = () => {
  return (
    <div className="relative sm:bottom-[150px] xs:bottom-[50px] px-10 font-bold font-inter sm:text-[16px] xs:text-[13px]">
        <div className="relative w-[50%] h-5 dark:bg-neutral-800 rounded-full">
            <p className="absolute bottom-5">AI / MACHINE LEARNING / PYTHON</p>
            <div className="w-5/6 h-full text-center text-[14px] text-white bg-gradient-to-r from-[#2CD73E] via-[#00C878] to-[#00B5AB] rounded-full sm:text-[14px] xs:text-[13px]">85%</div>
        </div>
        <div className="w-[50%] relative h-5 dark:bg-neutral-800 rounded-full mt-8">
            <p className="absolute bottom-5">HTML / CSS / TAILWIND</p>
            <div className="w-1/2 h-full text-center text-[14px] text-white bg-gradient-to-r from-[#34a7e1] via-[#5290d2] to-[#616dba] rounded-full sm:text-[14px] xs:text-[13px]">50%</div>
        </div>
        <div className="w-[50%] relative h-5 dark:bg-neutral-800 rounded-full mt-8">
            <p className="absolute bottom-5">REACT</p>
            <div className="w-2/5 h-full text-center text-[14px] text-white bg-gradient-to-r from-[#da3232] via-[#E02360] to-[#D5318C] rounded-full sm:text-[14px] xs:text-[13px]">40%</div>
        </div>
        <div className="w-[50%] relative h-5 dark:bg-neutral-800 rounded-full mt-8">
            <p className="absolute bottom-5">JAVA / C</p>
            <div className="w-3/4 h-full text-center text-[14px] text-white bg-gradient-to-r from-[#FFC75F] via-[#FF9671] to-[#FF6F91] rounded-full sm:text-[14px] xs:text-[13px]">75%</div>
        </div>

        <div className="relative text-center float-right bottom-[201px] px-10 w-[50%] font-inter opacity-50 font-normal lg:leading-[35.5px] lg:text-xl md:leading-[29px] md:text-lg md:px-0 sm:leading-[23px] sm:text-normal sm:px-0 xs:leading-[20px] xs:text-sm xs:px-0">
            I'm Pranaav Iyer, a 20 year old developer with a strong passion for innovation and problem solving. I specialize in crafting
            satisfying software solutions that prioritize creativeness and usability, involving industry standards from AI to frontend/backend
            technologies.
            <div>
            Let's innovate together.
            </div>
        </div>
    </div>
  )
}


export default ProgressBar