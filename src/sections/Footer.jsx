const Footer = () => {
    return (
      <div className="relative sm:bottom-[25px] text-center flex flex-col items-center">
        <div className="relative sm:bottom-[220px]">
        - With ❤️,
        </div>
        <div className="relative sm:bottom-[215px]">
          Pranaav Iyer
        </div>
        <div className="flex flex-col items-center justify-between">
          <div className="flex flex-col md:flex-row items-center">
            <a className="mx-2 opacity-50 transition-opacity duration-200 ease-in-out hover:opacity-100" href="#home">Home</a>
            <a className="mx-2 opacity-50 transition-opacity duration-200 ease-in-out hover:opacity-100" href="#about">About</a>
            <a className="mx-2 opacity-50 transition-opacity duration-200 ease-in-out hover:opacity-100" href="#portfolio">Portfolio</a>
            <a className="mx-2 opacity-50 transition-opacity duration-200 ease-in-out hover:opacity-100" href="#contact">Contact</a>
          </div>
        </div>
      </div>
    )
  }
  
  export default Footer