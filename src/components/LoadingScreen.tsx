import { Loader2 } from "lucide-react";

function LoadingScreen() {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-600 flex justify-center items-center relative overflow-hidden">
      {/* Glassmorphic card */}
      <div className="backdrop-blur-sm bg-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 animate-fade-in">
        
        {/* Loader */}
        <div className="relative">
          <div className="w-[120px] h-[120px] border-4 border-t-transparent border-indigo-300 rounded-full animate-spin shadow-lg"></div>
          <Loader2 className="absolute inset-0 m-auto h-16 w-16 text-indigo-100 animate-pulse" />
        </div>

        {/* Text */}
        <h1 className="text-white text-3xl font-extrabold tracking-wide animate-bounce">
          Loading...
        </h1>
        <p className="text-indigo-100 text-lg text-center max-w-sm animate-fade-in-slow">
          Please wait while we prepare your <span className="font-semibold">career path</span> ✨
        </p>
      </div>

      {/* Some subtle particles or decorations */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-pink-400 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
    </div>
  );
}

export default LoadingScreen;
