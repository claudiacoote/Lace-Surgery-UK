import { randomUUID } from 'node:crypto';
const prices={small:35,medium:45,large:55};
const recipients=['lacesurgeryuk@gmail.com','claudiaacootee@gmail.com'];
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 if(!process.env.SUPABASE_URL||!process.env.SUPABASE_SERVICE_ROLE_KEY||!process.env.RESEND_API_KEY||!process.env.NOTIFICATION_FROM_EMAIL)return res.status(503).json({error:'Bookings are not available yet. Please contact us via Instagram.'});
 try{
  const b=typeof req.body==='string'?JSON.parse(req.body):req.body||{};
  const name=String(b.name||'').trim(),email=String(b.email||'').trim().toLowerCase(),details=String(b.details||'').trim(),service=String(b.service||''),website=String(b.website||'');
  if(website)return res.status(200).json({ok:true});
  if(name.length<2||name.length>80||!/^\S+@\S+\.\S+$/.test(email)||email.length>254||details.length<10||details.length>1500||!(service in prices)||b.agreed!==true)return res.status(400).json({error:'Please check your details and accept the booking terms.'});
  const reference='LS-'+randomUUID().slice(0,8).toUpperCase();
  const insert=await fetch(process.env.SUPABASE_URL.replace(/\/$/,'')+'/rest/v1/bookings',{method:'POST',headers:{'Content-Type':'application/json',apikey:process.env.SUPABASE_SERVICE_ROLE_KEY,Authorization:'Bearer '+process.env.SUPABASE_SERVICE_ROLE_KEY,Prefer:'return=minimal'},body:JSON.stringify({reference,name,email,service,price_gbp:prices[service],details,status:'requested'})});
  if(!insert.ok)throw Error('Database write failed');
  const safe=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const notify=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.NOTIFICATION_FROM_EMAIL,to:recipients,subject:'New Lace Surgery request '+reference,html:'<h2>New booking request '+safe(reference)+'</h2><p>Name: '+safe(name)+'</p><p>Email: '+safe(email)+'</p><p>Service: '+safe(service)+' (£'+prices[service]+')</p><p>'+safe(details)+'</p><p>Approve in your admin system before taking payment.</p>'})});
  if(!notify.ok)console.error('Booking saved but email delivery failed',notify.status);
  return res.status(201).json({reference,message:'Request received. This is not a confirmed booking. Do not post your wig until we approve your request and provide instructions.'});
 }catch(err){console.error('Booking request failed',err);return res.status(500).json({error:'We could not save your request. Please try again later.'})}
}