export function ImageGridSkeleton() {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="break-inside-avoid rounded-lg bg-gray-200 aspect-square animate-pulse" />
      ))}
    </div>
  );
}
