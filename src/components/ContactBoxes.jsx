const ContactBoxes = () => {
    return (
    <div className="flex flex-col items-center px-4">
        <form action="https://formbold.com/s/ozmOP" method="POST" className="flex flex-col items-center w-full max-w-md sm:max-w-lg p-4 sm:p-5 -mt-8 sm:-mt-12 md:-mt-16 lg:-mt-20">
            <label htmlFor="fullname" className="sr-only">Name</label>
            <input className="p-3 sm:p-4 w-full m-1 sm:m-2 bg-gray-100 dark:bg-gray-800 rounded-md border-0 outline-none text-sm sm:text-base" placeholder="Name" name="name" id="fullname" required></input>
            <label htmlFor="email" className="sr-only">Email</label>
            <input className="p-3 sm:p-4 m-1 sm:m-2 w-full border-0 bg-gray-100 dark:bg-gray-800 rounded-md outline-none text-sm sm:text-base" placeholder="Email" name="email" id="email" type="email" required></input>
            <label htmlFor="message" className="sr-only">Message</label>
            <textarea className="p-3 sm:p-4 m-1 sm:m-2 w-full max-h-full border-0 bg-gray-100 dark:bg-gray-800 rounded-md outline-none text-sm sm:text-base resize-none" rows="4" placeholder="What's on your mind" name="message" id="message" required></textarea>
            <button className="relative gradient-border m-1 sm:m-2 px-4 sm:px-6 py-2 sm:py-3 cursor-pointer rounded-xl flex items-center justify-center dark:text-black dark:hover:bg-neutral-800 dark:bg-white bg-black hover:bg-black hover:text-white opacity-95 hover:opacity-100 text-white disabled:cursor-not-allowed disabled:opacity-50 transform transition duration-500 hover:scale-110 text-sm sm:text-base" type="submit">
                Send Message
            </button>
        </form>
        <div className="text-center mt-6 sm:mt-8 md:mt-10">
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">- With ❤️,</p>
            <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Pranaav Iyer</p>
        </div>
    </div>
  )
}

export default ContactBoxes