export const officialMap = 'https://themetrocentre.co.uk/centre-information/centre-map';
export const servicesUrl = 'https://themetrocentre.co.uk/centre-information/services-at-metrocentre';
export const places = [
  { id:'apple', name:'Apple', location:'Lower Red Mall', floors:['lower'], category:'Shopping', source:'F11', url:'https://themetrocentre.co.uk/stores', note:'Documentary sample. Location from the official directory; opening hours not verified.' },
  { id:'primark', name:'Primark', location:'Lower & Upper Yellow Mall', floors:['lower','upper'], category:'Shopping', source:'F12', url:'https://themetrocentre.co.uk/stores/primark', note:'Documentary sample. Entrances and connections between floors not verified.' },
  { id:'visitor-green', name:'Visitor information · Green Mall', location:'Ground floor, Green Mall, near Marks & Spencer', floors:['lower'], category:'Services', source:'F08', url:servicesUrl, note:'Location described by the centre. Exact position and accessible approach not verified.' },
  { id:'visitor-platinum', name:'Visitor information · Platinum Mall', location:'First floor, Platinum Mall, opposite Primark', floors:['upper'], category:'Services', source:'F08', url:servicesUrl, note:'Location described by the centre. Exact position and accessible approach not verified.' }
];
export const categories = ['All','Shopping','Food & Drink','Leisure','Services'];
export function searchPlaces(query='', category='All') {
  const normalise = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const q=normalise(query);
  return places.filter(p => (category==='All'||p.category===category) && normalise(p.name+' '+p.location+' '+p.category).includes(q));
}
export function readSaved(storage) {
  try { const data=JSON.parse(storage.getItem('metrocentre-concept-saved')||'[]'); return Array.isArray(data)?data.filter(id=>places.some(p=>p.id===id)):[]; } catch { return []; }
}
export function toggleSaved(ids,id) { return !places.some(p=>p.id===id)?ids:ids.includes(id)?ids.filter(x=>x!==id):[...ids,id]; }
