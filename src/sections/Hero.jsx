import Typewriter from 'typewriter-effect';

const Hero = () => {
  return (
    <div className="relative left-[3%] sm:left-[0px] xs:left-[0px] bottom-[50%] max-container font-inter flex justify-center items-center w-full xl:flex-row flex-col my-5 xl:left-[50px] xl:px-20">
      
      <div className="p-2 md:p-0 flex flex-col items-center mt-[135px]">
          <div className="flex flex-row items-center text-center xl:text-[50px] md:text-[40px] sm:text-[30px] xs:text-[25px] font-bold opacity-100">
            <span className="md:ml-1 xl:ml-4 ml-2 animate-fade-up animate-once animate-duration-1000 animate-delay-100 animate-ease-linear">
            <Typewriter
                onInit={(typewriter) => {
                    typewriter.typeString("Hello, I'm Pranaav Iyer")
                    .changeDelay(1)
                    .changeDeleteSpeed(5)
                    .start();
                }}
            />
            </span>
          </div>
          <div className="flex flex-row items-center text-center xl:text-[50px] md:text-[40px] sm:text-[30px] xs:text-[25px] font-bold opacity-100 animate-fade-up animate-once animate-duration-1000 animate-delay-100 animate-ease-linear">
            <span className="md:ml-1 xl:ml-4 ml-2">
            <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .changeDelay(50)
                    .pauseFor(4200)
                    .changeDeleteSpeed(5)
                    .typeString("I find,")
                    .pauseFor(500)
                    .deleteChars(5)
                    .typeString('plan,')
                    .pauseFor(500)
                    .deleteChars(5)
                    .typeString('create,')
                    .pauseFor(1000)
                    .changeDeleteSpeed(15)
                    .deleteChars(7)
                    .pauseFor(750)
                    .typeString('explore, design, and craft innovative software.')
                    .start();
                }}
            />
            </span>
          </div>
          <div className="flex flex-row items-center text-center xl:text-[25px] md:text-[20px] sm:text-[19px] font-normal opacity-50 px-60 sm:px-0 xs:px-0">
            <span className="md:ml-4 xl:ml-4 ml-2 px-10 animate-fade-up animate-once animate-duration-1000 animate-delay-100 animate-ease-linear">I'm a driven developer who enjoys transforming complex code into user-friendly solutions, inspired by a passion for innovation and problem-solving.</span>
          </div>
        </div>
        <ul className="absolute bg-gray-100 dark:bg-white flex items-center justify-center p-1 rounded-3xl shadow-sm sm:mt-[460px] xs:mt-[360px] xs:scale-75 sm:scale-100">
        <a className="p-2" target="_blank" href="https://www.linkedin.com/in/pranaav-iyer-4a1121172">
          <img className="h-6 opacity-50 transition-opacity duration-200 ease-in-out hover:opacity-100" src="/linkedin.png" alt="LinkedIn Logo" />
        </a>
        <a className="p-2" target="_blank" href="https://github.com/Pranaav003">
          <img className="h-6 opacity-50 transition-opacity duration-200 ease-in-out hover:opacity-100" src="/github.png" alt="Github Logo" />
        </a>
        <a className="p-2" target="_blank" href="https://big-split-9b7.notion.site/Pranaav-Iyer-0b9c2cdf571f4ddb93675e3109c9a5e5?pvs=4">
          <img className="h-6 opacity-50 transition-opacity duration-200 ease-in-out hover:opacity-100" src="/notion.png" alt="Portfolio Logo" />
        </a>
        <a className="p-2" target="_blank" href="mailto:pranaav.iyer@gmail.com">
          <img className="h-6 opacity-50 transition-opacity duration-200 ease-in-out hover:opacity-100" src="/email.png" alt="Notion Logo" />
        </a>
      </ul>
      <button className="absolute sm:mt-[670px] xs:mt-[550px] gradient-border m-1 rounded-xl flex items-center justify-center dark:text-black bg-black dark:bg-white hover:bg-white dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white opacity-95 hover:opacity-100 text-white px-5 py-3 md:px-10 md:py-5 text-xl transform transition duration-500 hover:scale-110">
        <a target="_blank" href="/PranaavIyer_Resume.pdf">Resume</a>
      </button>

    </div>
  )
}


export default Hero
