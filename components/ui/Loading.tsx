const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-black"></div>
        <p className="text-gray-600 text-lg font-medium">Loading CODALWARE products...</p>
      </div>
    </div>
  );
};

export default Loading;
