export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 dark:border-gray-600 border-t-black dark:border-t-white"></div>
        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Loading Nike products...</p>
      </div>
    </div>
  );
}
