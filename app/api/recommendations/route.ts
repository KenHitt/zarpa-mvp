import { NextRequest, NextResponse } from 'next/server';
import { getExperiences, getHotels } from '@/lib/data/catalog';

const complementary: Record<string,string[]>={
  Naturaleza:['Cataratas','Aventura','Cultura'], Cataratas:['Naturaleza','Aventura'],
  Aventura:['Naturaleza','Cataratas','Cultura'], Cultura:['Naturaleza','Cataratas'], Transporte:['Naturaleza','Cataratas','Aventura']
};

export async function GET(request:NextRequest){
  const selectedIds=(request.nextUrl.searchParams.get('selected')||'').split(',').filter(Boolean);
  const selectedCategories=(request.nextUrl.searchParams.get('categories')||'').split(',').filter(Boolean);
  const hasHotel=request.nextUrl.searchParams.get('hasHotel')==='true';
  const [experiences,hotels]=await Promise.all([getExperiences(),getHotels()]);
  const recommendations=experiences.filter(x=>!selectedIds.includes(x.id)).map(x=>{
    let score=0; let reason='Una buena primera experiencia para conocer Tingo María.';
    if(!selectedCategories.length){if(['Naturaleza','Cataratas'].includes(x.category)){score+=35;reason='Una puerta de entrada ideal a la naturaleza de Tingo María.'} if(x.name.toLowerCase().includes('derrepente'))score+=20;}
    else if(selectedCategories.includes(x.category)){score+=12;reason=`Complementa tu plan de ${x.category.toLowerCase()} sin cambiar de ritmo.`}
    else if(selectedCategories.some(category=>complementary[category]?.includes(x.category))){score+=28;reason=`Combina muy bien con lo que ya elegiste y hace tu día más completo.`}
    else {score+=5;reason='Añade una perspectiva distinta a tu itinerario.'}
    if(Number(x.price)<=90)score+=8;
    return {...x,score,reason};
  }).sort((a,b)=>b.score-a.score||Number(a.price)-Number(b.price)).slice(0,2);
  // Presenta alternativas por rango de precio, no un único hotel sesgado por ser el más barato.
  const hotelRecommendation=!hasHotel&&selectedIds.length?[...hotels].sort((a,b)=>Number(a.price_per_night)-Number(b.price_per_night)).slice(0,3):[];
  return NextResponse.json({experiences:recommendations,hotels:hotelRecommendation});
}
