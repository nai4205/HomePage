'use client';

export default function Home() {

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="md:shrink-0">
          <img className="h-48 w-full object-cover md:h-full md:w-48" src="/img/building.jpg" alt="Modern building architecture"/>
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Company retreats</div>
          <a href="#" className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Incredible accommodation for your team</a>
          <p className="mt-2 text-slate-500">Looking to take your team away on a retreat to enjoy awesome food and take in some sunshine? We have a list of places to do just that.</p>
          <button onClick={toggleTheme} className="flex justify-center items-center m-auto text-lg w-fit dark:bg-sky-500/50 bg-cyan-700 hover:bg-cyan-800 transition-color duration-200 ease-in-out py-3 px-10 rounded-lg text-gray-50 font-semibold py-[10px] px-4">Toggle Theme</button>
        </div>
      </div>
    </div>
  );
  }
