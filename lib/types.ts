export type Hotel = { id:string; name:string; description:string; price_per_night:number; location:string; amenities:string[]; photos:string[]; status:string };
export type Experience = { id:string; name:string; description:string; price:number; duration:string; meeting_point:string; category:string; photos:string[]; status:string; is_featured?:boolean };
export type PackageExperience = Experience & { date:string; quantity:number };
export type PackageState = { hotel: Hotel | null; checkIn:string; checkOut:string; experiences:PackageExperience[] };
