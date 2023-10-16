const Projects = () => {
  return (
    <div className="font-inter mt-[-200px]">
        <div className="dark:bg-neutral-900 relative w-[50%] p-10 col-span-2 row-span-2 items-center bg-gray-50 rounded-xl overflow-hidden sm:top-[-140px] xs:top-[42px]">
            <div className="flex flex-col gap-y-5 text-left w-3/6">
                <h1 className="text-3xl font-semibold">
                    TradingBot
                </h1>
                <p className="sm:text-sm xs:hidden sm:block text-gray-400"> 
                    The ThinkorSwim trading bot is a dynamic solution designed 
                    to empower traders with timely and data-driven decisions 
                    in the ever-evolving financial markets. This AI-driven 
                    tool seamlessly merges real-time market knowledge with 
                    advanced analysis, providing users with swift, precise, and 
                    well-rounded trading strategies. It offers a simplified approach to 
                    trading, enhancing profitability and risk management for traders at all levels.
                </p>
                <button className="relative m-1 px-3 py-2 rounded-xl flex items-center justify-center dark:text-black bg-black dark:bg-white hover:bg-white dark:hover:dark:bg-neutral-800 hover:text-black dark:hover:text-white opacity-95 hover:opacity-100 text-white w-fit transform transition duration-500 hover:scale-110">
                <a target="_blank" rel="noopener noreferrer" href='https://github.com/Pranaav003/Thinkorswim-Trading-Bot/tree/main'>Design & Development</a>
                </button>
                <img alt="Thinkorswim Dashboard" className="absolute left-[310px] -top-[50px] scale-75" src="/TradingBotImg.png"></img>
            </div>
        </div>
        
        <div className="dark:bg-neutral-900 relative float-right w-[50%] xl:bottom-[558px] lg:bottom-[598px] md:bottom-[742px] sm:bottom-[921px] xs:bottom-[180px] p-10 col-span-2 row-span-2 items-center bg-gray-50 rounded-xl overflow-hidden">
            <div className="flex flex-col gap-y-5 text-left w-3/6">
                <h1 className="text-3xl font-semibold">
                    VoiceWise
                </h1>
                <p className="sm:text-sm xs:hidden sm:block text-gray-400"> 
                VoiceWise is an innovative project aimed to addressing 
                the growing challenge of distinguishing between human 
                and AI-generated voices. With scams using 
                the voices of their victims, the need for such a software 
                is always growing. Leveraging PyTorch, a leading 
                deep learning framework, this initiative promises to 
                enhance security, improve voice assistants, and have 
                profound implications for industries like forensics.
                </p>
                <button className="relative m-1 px-3 py-2 rounded-xl flex items-center justify-center bg-gray-200 text-black opacity-95 hover:opacity-100 w-fit transform transition duration-500 hover:scale-110">
                    In Development
                </button>
                <img alt="VoiceWise Training" className="absolute left-[390px] top-[37.5px] scale-100" src="/VoiceWisePic.png"></img>
            </div>
        </div>
    </div>
  )
}

export default Projects