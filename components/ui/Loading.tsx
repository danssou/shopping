const Loading = () => {
  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 relative overflow-hidden">
      {/* Background pattern */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-900 to-transparent opacity-60"></div>
      
      <div className="relative flex flex-col items-center space-y-6 p-8">
        {/* Enhanced loading spinner */}
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-800 border-t-yellow-600 shadow-lg"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-yellow-500/20 opacity-10"></div>
        </div>
        
        {/* Loading text with gradient */}
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-slate-200">
            Loading CODALWARE products...
          </p>
          <div className="flex space-x-1 justify-center">
            <div className="h-1 w-1 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="h-1 w-1 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="h-1 w-1 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
