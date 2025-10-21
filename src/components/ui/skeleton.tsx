export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary ${className}`}
    />
  )
}

