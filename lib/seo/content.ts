export type FaqItem = { question: string; answer: string };

const DERREPENTE_FAQS: FaqItem[] = [
  {
    question: '¿Dónde está la catarata Derrepente?',
    answer:
      'La catarata Derrepente está en la zona de Cayumba, cerca de Tingo María (Huánuco). Los tours salen habitualmente desde la Plaza de Armas de Tingo María con operadores locales.',
  },
  {
    question: '¿Cuánto cuesta visitar el río y catarata Derrepente?',
    answer:
      'El precio del tour varía según operador y temporada. En Zarpa puedes ver el precio actualizado y reservar en minutos con Yape, Plin o tarjeta.',
  },
  {
    question: '¿Qué incluye el tour a Derrepente?',
    answer:
      'Generalmente incluye traslado, guía local y tiempo para caminar por la selva y bañarse en el río y la catarata. Confirma el detalle con el operador al reservar.',
  },
  {
    question: '¿Cuándo es la mejor época para ir a Derrepente?',
    answer:
      'Se puede visitar durante gran parte del año. En temporada de lluvias el caudal sube y la experiencia es más espectacular; lleva ropa que se pueda mojar y calzado antideslizante.',
  },
];

const BOSQUE_FAQS: FaqItem[] = [
  {
    question: '¿Qué es el Jurassic Park peruano en Tingo María?',
    answer:
      'Muchos viajeros llaman así al Bosque de Piedras de Tingo María: formaciones rocosas únicas en medio de la selva que recuerdan un paisaje prehistórico. Es uno de los tours más fotogénicos de la región.',
  },
  {
    question: '¿Cuánto dura el tour al Bosque de Piedras?',
    answer:
      'Suele ser un tour de día completo con traslado desde Tingo María, caminata y tiempo para fotos en las formaciones rocosas.',
  },
];

const DEFAULT_FAQS: FaqItem[] = [
  {
    question: '¿Cómo reservo experiencias en Tingo María con Zarpa?',
    answer:
      'Elige tu tour en Zarpa, añádelo a tu reserva, revisa fechas y paga con Yape, Plin o tarjeta. El operador local confirma tu cupo.',
  },
  {
    question: '¿Puedo combinar varias experiencias en un solo viaje?',
    answer:
      'Sí. Arma tu paquete con varias experiencias y, si quieres, añade hospedaje en la misma reserva.',
  },
];

const FAQS_BY_SLUG: Record<string, FaqItem[]> = {
  'catarata-derrepente': DERREPENTE_FAQS,
  'bosque-de-piedras': BOSQUE_FAQS,
};

export function faqsForExperience(slug: string): FaqItem[] {
  return FAQS_BY_SLUG[slug] ?? DEFAULT_FAQS;
}

export const GUIDE_FAQS: Record<string, FaqItem[]> = {
  'turismo-tingo-maria': [
    {
      question: '¿Qué hacer en Tingo María?',
      answer:
        'Lo imprescindible: catarata Derrepente, Bosque de Piedras, Cueva de las Lechuzas, Cueva Hayna Cápac, La Bella Durmiente y city tour. Puedes reservarlos en un solo lugar con Zarpa.',
    },
    {
      question: '¿Cómo llegar a Tingo María?',
      answer:
        'Desde Lima hay buses nocturnos (aprox. 8–10 h) o vuelos a Pucallpa/Tingo María según temporada. Muchos viajeros llegan desde Huánuco o la selva central.',
    },
    {
      question: '¿Cuántos días necesito en Tingo María?',
      answer:
        'Con 2–3 días cubres las cataratas y cuevas principales. Con 4–5 días puedes sumar Bosque de Piedras y descansar con calma.',
    },
  ],
  'catarata-derrepente': DERREPENTE_FAQS,
  'jurassic-park-peruano': BOSQUE_FAQS,
};

export const SEO_COPY_BY_SLUG: Record<string, { title: string; intro: string; keywords: string[] }> = {
  'catarata-derrepente': {
    title: 'Catarata Derrepente y río Derrepente · Tour desde Tingo María',
    intro:
      'La catarata Derrepente es una de las excursiones más buscadas en turismo Tingo María. Caminata por la selva, baño en el río Derrepente y una caída de agua espectacular en Cayumba.',
    keywords: [
      'catarata derrepente',
      'rio derrepente',
      'derrepente tingo maria',
      'tour derrepente',
      'cataratas tingo maria',
    ],
  },
  'bosque-de-piedras': {
    title: 'Bosque de Piedras · Jurassic Park peruano en Tingo María',
    intro:
      'El Bosque de Piedras es el tour que muchos conocen como Jurassic Park peruano: rocas gigantes en la selva, miradores naturales y una ruta ideal para fotos y aventura.',
    keywords: ['bosque de piedras tingo maria', 'jurassic park peruano', 'jurasik park peruano', 'formaciones rocosas tingo maria'],
  },
};
