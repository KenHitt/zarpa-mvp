export default function Loading() {
  return (
    <div className="shell max-w-3xl animate-pulse py-10 sm:py-14" aria-label="Cargando experiencia">
      <div className="h-4 w-48 rounded bg-forest/10" />
      <div className="mt-6 h-10 w-3/4 rounded bg-forest/10" />
      <div className="mt-6 aspect-[16/10] rounded-[24px] bg-forest/10" />
      <div className="mt-8 space-y-3">
        <div className="h-4 rounded bg-forest/10" />
        <div className="h-4 w-5/6 rounded bg-forest/10" />
        <div className="h-4 w-2/3 rounded bg-forest/10" />
      </div>
      <div className="mt-8 h-24 rounded-2xl bg-forest/10" />
    </div>
  );
}
