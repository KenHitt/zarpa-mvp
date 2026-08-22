export default function Loading() {
  return (
    <div className="mx-auto max-w-xl animate-pulse px-4 py-12" aria-label="Cargando checkout">
      <div className="h-4 w-32 rounded bg-forest/10" />
      <div className="mt-4 h-9 w-2/3 rounded bg-forest/10" />
      <div className="mt-6 h-28 rounded-2xl bg-forest/10" />
      <div className="mt-6 space-y-4">
        <div className="h-12 rounded-xl bg-forest/10" />
        <div className="h-12 rounded-xl bg-forest/10" />
        <div className="h-12 rounded-xl bg-forest/10" />
        <div className="h-12 rounded-full bg-forest/10" />
      </div>
    </div>
  );
}
