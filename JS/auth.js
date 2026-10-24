document.addEventListener("DOMContentLoaded",()=>{
 const H=window.HCM;if(!H)return;
 const path=location.pathname.toLowerCase(),isIndex=path.endsWith("/index.html")||path.endsWith("/")||path.endsWith("\\");
 const session=H.getSession();
 if(!isIndex){if(!session){location.replace("../index.html");return}
   if(path.endsWith("employee.html")&&session.role!=="employee"){location.replace("admin.html");return}
   if(["admin.html","employees.html","leaves.html","settings.html"].some(p=>path.endsWith(p))&&session.role!=="admin"){location.replace("employee.html");return}
   document.querySelectorAll("#currentUser").forEach(el=>el.textContent=session.name+" · "+session.role);
 }
 document.querySelectorAll("[data-logout]").forEach(btn=>btn.addEventListener("click",()=>{H.clearSession();location.href="../index.html"}));
 if(!isIndex)return;
 const company=H.getCompany(),setupPanel=document.querySelector("#setupPanel"),loginPanel=document.querySelector("#loginPanel");
 if(!company){setupPanel?.classList.remove("hidden");loginPanel?.classList.add("hidden")}
 const setupForm=document.querySelector("#setupForm");
 setupForm?.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(setupForm),name=f.get("name").trim(),email=f.get("email").trim().toLowerCase(),password=f.get("password"),companyName=f.get("company").trim();if(H.getUsers().some(u=>u.email.toLowerCase()===email)){H.setMessage(document.querySelector("#setupMessage"),"This email is already in use.","error");return}
   H.saveCompany({name:companyName,settings:{officeStart:"09:00",graceMinutes:15,leaveQuota:20,workingDays:[1,2,3,4,5]}});const admin={id:Date.now(),name,email,password,role:"admin",department:"Management",salary:1};H.saveUsers([admin]);H.setSession({id:admin.id,name:admin.name,email:admin.email,role:admin.role});location.href="pages/admin.html";
 });
 let role="admin";
 document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>{role=tab.dataset.role;document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t===tab));document.querySelector("#authDescription").textContent=role==="employee"?"Sign in to access your employee workspace.":"Enter your details to access your account."}));
 document.querySelector("#showSetup")?.addEventListener("click",()=>{setupPanel?.classList.remove("hidden");loginPanel?.classList.add("hidden")});
 document.querySelector("#loginForm")?.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget),email=f.get("email").trim().toLowerCase(),password=f.get("password"),user=H.getUsers().find(u=>u.email.toLowerCase()===email&&u.password===password&&u.role===role),msg=document.querySelector("#loginMessage");if(!user){H.setMessage(msg,"Email, password or account type is incorrect.","error");return}H.setSession({id:user.id,name:user.name,email:user.email,role:user.role});location.href=user.role==="admin"?"pages/admin.html":"pages/employee.html"});
 document.querySelector("#forgotBtn")?.addEventListener("click",()=>{const email=document.querySelector('#loginForm [name="email"]').value.trim();H.setMessage(document.querySelector("#loginMessage"),email?"Password reset is not available in this localStorage demo. Ask your administrator to reset the demo account.":"Enter your email address first.",email?"":"error")});
});