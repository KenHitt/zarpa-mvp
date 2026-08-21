import type { FaqItem } from '@/lib/seo/content';

export function FaqBlock({ faqs, title = 'Preguntas frecuentes' }: { faqs: FaqItem[]; title?: string }) {
  return (
    <section className="mt-12 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-forest/10 sm:p-8">
      <h2 className="font-display text-2xl text-forest">{title}</h2>
      <div className="mt-6 space-y-5">
        {faqs.map((faq) => (
          <details key={faq.question} className="group border-b border-forest/10 pb-5 last:border-0">
            <summary className="cursor-pointer list-none font-semibold text-forest marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-4">
                {faq.question}
                <span className="text-amber transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-7 text-forest/75">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
