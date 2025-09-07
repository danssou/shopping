interface ErrorCardProps {
  error: string;
  onRetry: () => void;
  fullScreen?: boolean;
}

const ErrorCard = ({ error, onRetry, fullScreen = false }: ErrorCardProps) => {
  const containerClass = fullScreen 
    ? "min-h-screen flex items-center justify-center"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClass}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorCard;
