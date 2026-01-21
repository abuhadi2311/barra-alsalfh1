// --------------------- بيانات اللعبة ---------------------
const categories = {
  "أشياء":["ساعة","جوال","كتاب","قلم","نظارة","كرسي","طاولة","سماعة","شنطة","كمبيوتر",
            "كيبورد","فأرة","مرآة","مصباح","شاحن","بطارية","محفظة","مسبحة","حزام","دفتر",
            "مقص","مظلة","قبعة","ساعة حائط","سوار","كاميرا","ريموت","كرت","مايك"],
  "أماكن":["مدرسة","مطار","مستشفى","شاطئ","مقهى","مطعم","مسجد","جامعة","سينما","متحف",
           "مكتبة","حديقة","بر","مخيم","سوق","شارع","فندق","منتجع","استراحة","شاليه",
           "بيت","مزرعة","قاعة","ملعب","صالة","محطة","جسر","نفق","موقف","مستودع"],
  "أكل":["كبسة","مندي","بيتزا","برجر","شاورما","سوشي","باستا","فلافل","رز","دجاج",
        "سمك","كباب","كنافة","لقيمات","آيسكريم","كيك","قهوة","شاي","تمر","فشار",
        "معصوب","تميس","فطاير","كرواسون","تبولة","فتوش","عصير","شوكولاتة","تشيزكيك","بيض"],
  "رياضة":["كرة قدم","كرة سلة","كرة طائرة","تنس","سكواش","سباحة","جري","دراجات",
        "ملاكمة","جودو","تايكواندو","كاراتيه","كروس فيت","رفع أثقال","يوغا",
        "بيلاتس","تزلج","ركمجة","سباقات","رماية","قفز","قفز مظلي","رمي رمح",
        "رمي قرص","ماراثون","ترياتلون","سباق سيارات","فروسية","رالي","مصارعة"],
  "حيوانات":["أسد","نمر","ذئب","ثعلب","حصان","جمل","كلب","قط","فيل","زرافة",
            "غزال","دب","باندا","قرد","كنغر","حوت","دلفين","قرش","نسر","صقر",
            "حمامة","عصفور","بط","دجاج","ديك","سمكة","سلحفاة","ثعبان","سحلية","تمساح"],
  "سيارات":["تويوتا","نيسان","هوندا","هيونداي","كيا","مرسيدس","BMW","أودي","بورش","تسلا",
        "فورد","شفر","جيب","لاندكروزر","كامري","سوناتا","النترا","كورولا","يارس","هايلكس",
        "باترول","تاهو","سوبربان","رنج روفر","فولفو","مازدا","سوبارو","فيراري","لامبورغيني","ماكلارين"],
  "تقنية":["ذكاء اصطناعي","برمجة","خوارزمية","سيرفر","شبكة","أمن سيبراني","هكر أخلاقي",
        "تطبيق","موقع","واجهة","باك اند","فرونت اند","داتا","تحليل","سحابة",
        "API","بوت","أتمتة","نظام","سوفتوير","هاردوير","معالج","ذاكرة",
        "تخزين","بلوكشين","عملة رقمية","تشفير","Firewall","Linux","Windows"],
  "مشاعر":["فرح","حزن","غضب","خوف","توتر","حماس","قلق","راحة","اطمئنان","غيرة",
           "ندم","أمل","يأس","فخر","خجل","ملل","تعب","نشاط","حب","كراهية",
           "تفاؤل","تشاؤم","ارتياح","ضيق","سعادة","رهبة","دهشة","استغراب","حنين","شوق"]
};

let players = [], roles = {}, word = "", revealIndex = 0, showingRole = false;
let questionPairs = [], questionIndex = 0, lastQuestion = null;
let votingIndex = 0, votes = {};
let selectedCategory = null;

// --------------------- العناصر ---------------------
const home = document.getElementById("screen-home");
const playersScreen = document.getElementById("screen-players");
const playScreen = document.getElementById("screen-play");
const passText = document.getElementById("passText");
const roleModal = document.getElementById("roleModal");
const roleTitle = document.getElementById("roleTitle");
const roleText = document.getElementById("roleText");
const voteModal = document.getElementById("voteModal");
const voteTitle = document.getElementById("voteTitle");
const voteOptions = document.getElementById("voteOptions");

// --------------------- الذكاء الاصطناعي لتحديد الجنس ---------------------
function aiDetectGender(name){
  name = name.trim();
  if(name.endsWith("ة") || name.endsWith("ى") || name.endsWith("ن")) return {ready:"جاهز/ة", see:"تشوفين"};
  return {ready:"جاهز/ة", see:"تشوف/ين"};
}

// --------------------- الكاتاقوري ---------------------
Object.keys(categories).forEach(cat => {
  const btn = document.createElement("button");
  btn.className = "btn secondary";
  btn.textContent = cat;
  btn.onclick = () => selectedCategory = cat;
  document.getElementById("categories").appendChild(btn);
});

// --------------------- بدء اللعبة ---------------------
document.getElementById("startBtn").onclick = () => {
  players = document.getElementById("playerNames").value
    .split(",").map(x=>x.trim()).filter(Boolean);
  if(players.length < 3){ showToast("⚠️ أدخل/ي لاعبين على الأقل!", "warning"); return; }
  if(!selectedCategory){ showToast("⚠️ اختار/ي كاتاقوري!", "warning"); return; }

  roles = {}; revealIndex = 0; showingRole = false;
  word = categories[selectedCategory][Math.floor(Math.random()*categories[selectedCategory].length)];
  roles[players[Math.floor(Math.random()*players.length)]] = "out";
  players.forEach(p=>roles[p]=roles[p]||"in");

  home.classList.add("hidden");
  playersScreen.classList.remove("hidden");
  updatePassText();
};

function updatePassText(){ passText.textContent = `✋ عطوا الجوال: ${players[revealIndex]}`; }

// --------------------- كشف الدور ---------------------
document.getElementById("revealBtn").onclick = ()=>{
  roleModal.classList.add("show");
  roleTitle.textContent = players[revealIndex];
  roleText.textContent = "👀 جاهز/ة تشوف/ين دورك؟"; showingRole=false;
};
document.getElementById("roleNextBtn").onclick = ()=>{
  const player = players[revealIndex];
  const pronoun = aiDetectGender(player);

  if(!showingRole){
    roleText.textContent = roles[player]==="out"
      ? `😶‍🌫️ ${pronoun.ready} برا السالفة`
      : `✅ ${pronoun.ready} في السالفة\n🔑 الكلمة: ${word}`;
    showingRole=true;
  } else {
    roleModal.classList.remove("show");
    revealIndex++;
    showingRole=false;
    if(revealIndex>=players.length){ startGame(); } else { updatePassText(); }
  }
};

// --------------------- الأسئلة ---------------------
function startGame(){
  playersScreen.classList.add("hidden");
  playScreen.classList.remove("hidden");
  generateQuestions();
  showNextQuestion();
}

function generateQuestions(){
  const shuffled=[...players].sort(()=>Math.random()-0.5);
  questionPairs=[];
  for(let i=0;i<shuffled.length;i++){
    questionPairs.push({asker:shuffled[i],asked:shuffled[(i+1)%shuffled.length]});
  }
}

function showNextQuestion(){
  let q = questionPairs[questionIndex];
  if(lastQuestion && q.asker===lastQuestion.asker && q.asked===lastQuestion.asked){
    questionIndex = (questionIndex+1)%questionPairs.length;
    q = questionPairs[questionIndex];
  }
  document.getElementById("questionBox").textContent = `🎲 ${q.asker} اسأل/ي ${q.asked}`;
  lastQuestion=q;
  questionIndex=(questionIndex+1)%questionPairs.length;
}

document.getElementById("nextQuestionBtn").onclick = showNextQuestion;

// --------------------- التصويت ---------------------
document.getElementById("voteBtn").onclick = ()=>{
  votingIndex=0; votes={}; showVotingTurn();
};

function showVotingTurn(){
  if(votingIndex>=players.length){ finishVoting(); return; }
  const voter=players[votingIndex];
  voteTitle.textContent=`🗳️ دور ${voter} ت/يصوّت`; voteOptions.innerHTML="";
  players.filter(p=>p!==voter).forEach(p=>{
    const btn=document.createElement("button");
    btn.className="btn"; btn.textContent=p;
    btn.onclick=()=>{ votes[p]=(votes[p]||0)+1; votingIndex++; showVotingTurn(); };
    voteOptions.appendChild(btn);
  });
  voteModal.classList.add("show");
}

function finishVoting(){
  voteModal.classList.remove("show");
  const maxVotes=Math.max(...Object.values(votes));
  const suspected=Object.keys(votes).find(k=>votes[k]===maxVotes);
  const realOut=Object.keys(roles).find(k=>roles[k]==="out");
  const pronoun=aiDetectGender(realOut);

  if(suspected===realOut){
    const guess=prompt(`${realOut} حاول/ي تخمن/ين الكلمة`);
    if(guess===word){
      showToast("✅ صح! لقد خمنت/ي الكلمة!", "success", 5000);
    } else {
      showToast(`❌ غلط! الكلمة كانت: ${word}`, "error", 5000);
    }
  } else {
    showToast(`❌ غلط! برا السالفة هو/هي: ${realOut}\n🔑 الكلمة: ${word}`, "error", 5000);
  }
  setTimeout(()=>location.reload(),5200);
}

// --------------------- إشعار احترافي ---------------------
function showToast(message,type="success",duration=5000){
  const toast=document.getElementById("toast");
  toast.textContent=message;
  toast.className=`toast ${type} show`;
  if(type==="error"){ toast.style.animation="shake 0.5s"; }
  else if(type==="success"){ toast.style.animation="pop 0.5s"; }
  else { toast.style.animation=""; }
  setTimeout(()=>{ toast.className=`toast ${type}`; toast.style.animation=""; }, duration);
}

function detectDevice() {
    const ua = navigator.userAgent;
    if (/Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(ua)) {
        document.body.classList.add("mobile");
        document.body.classList.remove("desktop");
    } else {
        document.body.classList.add("desktop");
        document.body.classList.remove("mobile");
    }
}

// نفعل الكشف عند تحميل الصفحة
window.addEventListener("load", detectDevice);
