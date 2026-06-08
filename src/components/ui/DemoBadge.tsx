export function DemoBadge() {
  if (!import.meta.env.DEV) return null;
  return (
    <span className="inline-flex items-center bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full tracking-widest uppercase select-none">
      DEMO
    </span>
  );
}
