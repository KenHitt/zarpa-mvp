export type Hotel = { id:string; name:string; description:string; price_per_night:number; location:string; amenities:string[]; photos:string[]; status:string; slug?:string|null };
export type Experience = { id:string; name:string; description:string; price:number; duration:string; meeting_point:string; category:string; photos:string[]; status:string; is_featured?:boolean; slug?:string|null };
export type PackageExperience = Experience & { date:string; quantity:number };
export type PackageState = { hotel: Hotel | null; checkIn:string; checkOut:string; experiences:PackageExperience[] };
export type Review = { id:string; experience_id:string|null; hotel_id:string|null; author_name:string; rating:number; comment:string; status:string; created_at:string };
export type ReviewStats = { average:number; count:number };
