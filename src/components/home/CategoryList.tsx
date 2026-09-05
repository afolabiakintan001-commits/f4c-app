'use client';

export function CategoryList() {
  const categories = [
    "All",
    "Anime Edits",
    "Car Stills",
    "Graphic Textures",
    "4K Wallpapers",
    "3D Renders",
    "Film Frames",
  ];

  return (
    <div className="sticky top-16 z-40 bg-white border-b border-neutral-100 px-6 py-3">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat, index) => (
          <button
            key={cat}
            className={`px-5 py-2 text-xs font-semibold rounded-full transition whitespace-nowrap ${
              index === 0
                ? "bg-black text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
