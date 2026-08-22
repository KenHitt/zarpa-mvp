export default function Loading() {
  return (
    <div className="shell max-w-3xl animate-pulse py-12" aria-label="Cargando hotel">
      <div className="h-4 w-48 rounded bg-forest/10" />
      <div className="mt-6 h-10 w-2/3 rounded bg-forest/10" />
      <div className="mt-5 h-5 w-full rounded bg-forest/10" />
      <div className="mt-2 h-5 w-4/5 rounded bg-forest/10" />
      <div className="mt-6 aspect-[16/10] rounded-[24px] bg-forest/10" />
      <div className="mt-8 h-40 rounded-2xl bg-forest/10" />
    </div>
  );
}
