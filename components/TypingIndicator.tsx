export const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-none rounded-lg px-4 py-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse delay-75"></div>
          <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
};
