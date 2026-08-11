import { unstable_cache } from 'next/cache';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Experience, Hotel } from '@/lib/types';
const db=createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const cachedHotels=unstable_cache(async():Promise<Hotel[]>=>{const {data,error}=await db.from('hotels').select('*').eq('status','active').order('price_per_night');if(error)throw error;return data??[]},['zarpa-active-hotels'],{revalidate:300});
const cachedExperiences=unstable_cache(async():Promise<Experience[]>=>{const {data,error}=await db.from('experiences').select('*').eq('status','active').order('is_featured',{ascending:false}).order('price');if(error)throw error;return data??[]},['zarpa-active-experiences'],{revalidate:300});
const cachedHotel=unstable_cache(async(id:string):Promise<Hotel|null>=>{const {data,error}=await db.from('hotels').select('*').eq('id',id).eq('status','active').maybeSingle();if(error)throw error;return data},['zarpa-active-hotel'],{revalidate:300});
export const getHotels=()=>cachedHotels(); export const getHotel=(id:string)=>cachedHotel(id); export const getExperiences=()=>cachedExperiences();
