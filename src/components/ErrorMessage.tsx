function ErrorMessage({message}: {message: string}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <div className="flex items-start gap-3">
        <span className="text-2xl">⚠️</span>

        <div>
          <h2 className="font-semibold text-red-700">
            Ocurrió un error
          </h2>

          <p className="mt-1 text-sm text-red-600">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ErrorMessage;