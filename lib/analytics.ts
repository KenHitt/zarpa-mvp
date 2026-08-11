'use client';
const storageKey='zarpa-session-id';
type EventName='page_view'|'experience_added'|'hotel_selected'|'checkout_started'|'booking_created';
function sessionId(){let id=localStorage.getItem(storageKey);if(!id){id=crypto.randomUUID();localStorage.setItem(storageKey,id)}return id}
export function track(event_name:EventName,entity_id?:string,metadata:Record<string,string|number|boolean>={}){try{fetch('/api/analytics',{method:'POST',keepalive:true,headers:{'content-type':'application/json'},body:JSON.stringify({session_id:sessionId(),event_name,entity_id,path:window.location.pathname,metadata})})}catch{}}
