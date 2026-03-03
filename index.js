const fs=require("fs");const path=require("path");const AIR=require("./lib/air");
const AGENTS_DIR=path.join(__dirname,"agents");
function loadAllAgents(){const a={};const files=fs.readdirSync(AGENTS_DIR).filter(f=>f.endsWith(".js"));
for(const f of files){try{const m=require(path.join(AGENTS_DIR,f));if(m.id)a[m.id]={id:m.id,name:m.fullName,dept:m.department,jd:m.jobDescription};}catch(e){}}
console.log("Loaded",Object.keys(a).length,"JDs");return a;}
const AGENTS=loadAllAgents();
module.exports={AGENTS,AIR,process:AIR.process,count:Object.keys(AGENTS).length};