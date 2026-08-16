import { Flashlight } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";

const RecruiterPopup = () => {
  const [isVisible, setIsVisible] = useState(
    !sessionStorage.getItem("showPopUp"),
  );

  const closePopUp = () => {
    sessionStorage.setItem("showPopUp", "true");
    setIsVisible(false);
  };

  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem("showPopUp");
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-zinc-950/70 backdrop-blur-sm px-4">
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 blur-3xl rounded-full" />

        <div className="relative w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shadow-2xl p-7 sm:p-9">
          <button
            onClick={() => closePopUp()}
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
            Want to Explore the
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Admin Panel?
            </span>
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed text-center mb-7">
            Visit my portfolio website and head over to the{" "}
            <span className="font-semibold text-cyan-400">Projects</span>{" "}
            section to see screenshots of the admin dashboard and project
            features.
          </p>

          <a
            href="https://bantony-portfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto flex w-fit items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold no-underline hover:scale-105 active:scale-95 transition duration-300 shadow-xl shadow-cyan-500/20 text-sm sm:text-base"
          >
            🔗 Visit My Portfolio →
          </a>

          {/* User Panel Login */}
          <div className="mt-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-4 text-center">
            <p className="text-zinc-300 text-sm font-medium mb-2">
              Want to explore the User Panel?
            </p>

            <p className="text-zinc-500 text-xs leading-relaxed mb-3">
              Go to the <span className="text-cyan-400 font-medium">Login</span>{" "}
              page. Demo credentials are available there.
            </p>

            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/20 hover:text-cyan-300"
            >
              Go to Login →
            </a>
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
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
