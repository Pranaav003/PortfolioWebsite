const ContactBoxes = () => {
    return (
    <div className="flex flex-col items-center">
        <form action="https://formbold.com/s/ozmOP" method="POST" className="flex flex-col items-center sm:mt-[-640px] xs:mt-[-250px] w-96 p-5 md:p-0">
            <input className="p-4 w-full m-2 bg-gray-100 rounded-md border-0 outline-none" placeholder="Name" name="name" id="fullname"></input>
            <input className="p-4 m-2 w-full border-0 bg-gray-100 rounded-md outline-none" placeholder="Email" name="email" id="email"></input>
            <textarea className="p-4 m-2 w-full max-h-full border-0 bg-gray-100 rounded-md outline-none" rows="4" placeholder="What's on your mind" name="message" id="message"></textarea>
            <input role='button' className="relative gradient-border m-1 px-3 py-2 cursor-pointer rounded-xl flex items-center justify-center dark:text-black dark:hover:bg-neutral-800 dark:bg-white bg-black hover:bg-black hover:text-white opacity-95 hover:opacity-100 text-white disabled:cursor-not-allowed disabled:opacity-50 transform transition duration-500 hover:scale-110" type="submit">
            </input>
        </form>
    </div>
  )
}

export default ContactBoxes