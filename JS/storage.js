/* Shared localStorage helpers. Learning/demo only: passwords are plain text here; never use this pattern in a real production app. */
(function(){
  const KEYS={company:"hcm_company",users:"hcm_users",attendance:"hcm_attendance",leaves:"hcm_leaves",session:"hcm_session",announcements:"hcm_announcements"};
  const read=(key,fallback)=>{try{const v=localStorage.getItem(key);return v===null?fallback:JSON.parse(v)}catch{return fallback}};
  const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
  const getCompany=()=>read(KEYS.company,null);
  const saveCompany=value=>write(KEYS.company,value);
  const getUsers=()=>read(KEYS.users,[]);
  const saveUsers=value=>write(KEYS.users,value);
  const getAttendance=()=>read(KEYS.attendance,[]);
  const saveAttendance=value=>write(KEYS.attendance,value);
  const getLeaves=()=>read(KEYS.leaves,[]);
  const saveLeaves=value=>write(KEYS.leaves,value);
  const getAnnouncements=()=>read(KEYS.announcements,[]);
  const saveAnnouncements=value=>write(KEYS.announcements,value);
  const getSession=()=>read(KEYS.session,null);
  const setSession=value=>write(KEYS.session,value);
  const clearSession=()=>localStorage.removeItem(KEYS.session);
  const today=()=>new Date().toLocaleDateString("en-CA");
  const timeNow=()=>new Date().toTimeString().slice(0,5);
  const byId=id=>getUsers().find(u=>String(u.id)===String(id));
  const workingDaysBetween=(from,to,workingDays)=>{
    let count=0; const start=new Date(from+"T12:00:00"),end=new Date(to+"T12:00:00");
    if(Number.isNaN(start.getTime())||Number.isNaN(end.getTime())||start>end)return 0;
    for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1)){if(workingDays.includes(d.getDay()))count++}
    return count;
  };
  const approvedLeaveDays=(userId,year)=>{
    const c=getCompany();const days=c?.settings?.workingDays||[1,2,3,4,5];
    return getLeaves().filter(l=>String(l.userId)===String(userId)&&l.status==="Approved"&&new Date(l.from+"T12:00:00").getFullYear()===Number(year))
      .reduce((sum,l)=>sum+workingDaysBetween(l.from,l.to,days),0);
  };
  const setMessage=(el,msg,type="")=>{if(!el)return;el.textContent=msg;el.className="message"+(type?" "+type:"")};
  const escapeHTML=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const money=n=>new Intl.NumberFormat("en-PK",{style:"currency",currency:"PKR",maximumFractionDigits:0}).format(Number(n)||0);
  const fmtDate=s=>s?new Date(s+"T12:00:00").toLocaleDateString("en-PK",{day:"numeric",month:"short",year:"numeric"}):"—";
  const hoursBetween=(start,end)=>{if(!start||!end)return 0;const [sh,sm]=start.split(":").map(Number),[eh,em]=end.split(":").map(Number);let mins=eh*60+em-(sh*60+sm);if(mins<0)mins+=1440;return mins/60};
  const statusForCheckin=checkin=>{const c=getCompany();const start=c?.settings?.officeStart||"09:00";const grace=Number(c?.settings?.graceMinutes??15);return checkin>addMinutes(start,grace)?"Late":"Present"};
  function addMinutes(time,mins){let [h,m]=time.split(":").map(Number);let total=h*60+m+mins;return String(Math.floor(total/60)%24).padStart(2,"0")+":"+String(total%60).padStart(2,"0")}
  const workingDaysInMonth=(year,month,days)=>{let n=0;const d=new Date(year,month,1);while(d.getMonth()===month){if(days.includes(d.getDay()))n++;d.setDate(d.getDate()+1)}return n};
  window.HCM={KEYS,read,write,getCompany,saveCompany,getUsers,saveUsers,getAttendance,saveAttendance,getLeaves,saveLeaves,getAnnouncements,saveAnnouncements,getSession,setSession,clearSession,today,timeNow,byId,workingDaysBetween,approvedLeaveDays,setMessage,escapeHTML,money,fmtDate,hoursBetween,statusForCheckin,workingDaysInMonth};
})();