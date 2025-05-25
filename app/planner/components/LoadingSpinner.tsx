export function LoadingSpinner() {
  return (
    <div role="status" className="flex space-x-1">
      <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
      <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-100" />
      <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-200" />
    </div>
  )
}
