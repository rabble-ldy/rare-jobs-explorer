function RandomButton({ onClick, isLoading }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? '探索中...' : '开启职业探索之旅'}
    </button>
  );
}

export default RandomButton; 