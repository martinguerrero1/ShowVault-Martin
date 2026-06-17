function LoadingMessage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />

      <p className="text-sm text-gray-600">Cargando...</p>
    </div>
  );
}

export default LoadingMessage;