import { useState } from "react";

const RecruiterPopup = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-zinc-950/70 backdrop-blur-sm px-4">
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 blur-3xl rounded-full" />

        <div className="relative w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shadow-2xl p-7 sm:p-9">
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/70 text-zinc-400 transition duration-300 hover:border-cyan-500/40 hover:text-white cursor-pointer text-sm"
            aria-label="Close popup"
          >
            ✕
          </button>

          <span className="mx-auto mb-5 flex w-fit items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-xs sm:text-sm font-medium">
            👋 For Recruiters
          </span>

          <p className="text-zinc-500 text-xs sm:text-sm text-center leading-relaxed mb-5">
            If you're a recruiter, please take a moment to read this. Otherwise,
            feel free to ignore this message.
          </p>

          <h2 className="text-2xl sm:text-3xl font-black text-white text-center leading-tight mb-2">
            Want to See the
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Admin Panel?
            </span>
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed text-center mb-7">
            Visit my portfolio website and head over to the{" "}
            <span className="font-semibold text-cyan-400">Projects</span>{" "}
            section — you'll find screenshots showing how the admin dashboard
            works.
          </p>

          <a
            href="https://bantony-portfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto flex w-fit items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold no-underline hover:scale-105 active:scale-95 transition duration-300 shadow-xl shadow-cyan-500/20 text-sm sm:text-base"
          >
            🔗 Visit My Portfolio →
          </a>

          <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
            <p className="text-zinc-500 text-xs sm:text-[0.8rem] text-center leading-relaxed">
              📌 If this popup disappears, go back to{" "}
              <span className="text-cyan-400 font-medium">Home</span> and
              refresh the page — it will appear again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterPopup;
