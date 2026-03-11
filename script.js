// 音樂觸發
document.body.addEventListener('click', () => {
  document.getElementById('bgm').play();
  document.getElementById('sakuraAudio').play();
}, { once: true });

// 出道天數
const debut = new Date("2023-06-01");
function updateDays(){
  const today = new Date();
  const diff = today - debut;
  const days = Math.floor(diff/(1000*60*60*24));
  document.getElementById("days").innerText = days;
}
updateDays();

// 倒數
function countdown(){
  const now = new Date();
  let next = new Date(now.getFullYear(),5,1);
  if(now>next) next=new Date(now.getFullYear()+1,5,1);
  const diff = next-now;
  document.getElementById("d").innerText=Math.floor(diff/(1000*60*60*24));
  document.getElementById("h").innerText=Math.floor(diff/(1000*60*60)%24);
  document.getElementById("m").innerText=Math.floor(diff/(1000*60)%60);
  document.getElementById("s").innerText=Math.floor(diff/1000%60);
}
setInterval(countdown,1000);

// Fanart Lightbox
const images=document.querySelectorAll(".grid img");
const lightbox=document.getElementById("lightbox");
const lightboxImg=document.getElementById("lightbox-img");
let currentIndex=0;
const clickAudio=document.getElementById('clickAudio');
function showImage(index){
  lightbox.style.display="flex";
  lightboxImg.src=images[index].src;
  currentIndex=index;
  clickAudio.play();
}
images.forEach((img,i)=>{img.onclick=()=>{showImage(i);}});
document.getElementById("prev").onclick=()=>{showImage((currentIndex-1+images.length)%images.length);};
document.getElementById("next").onclick=()=>{showImage((currentIndex+1)%images.length);};
lightbox.onclick=(e)=>{if(e.target===lightbox) lightbox.style.display="none";}

// 日/夜背景
const canvasStars=document.getElementById('stars');
const ctxStars=canvasStars.getContext('2d');
canvasStars.width=window.innerWidth;
canvasStars.height=window.innerHeight;
const canvasSakura=document.getElementById('sakura');
const ctxSakura=canvasSakura.getContext('2d');
canvasSakura.width=window.innerWidth;
canvasSakura.height=window.innerHeight;
let petals=[], stars=[];
for(let i=0;i<50;i++){petals.push({x:Math.random()*canvasSakura.width,y:Math.random()*canvasSakura.height,r:Math.random()*4+2,d:Math.random()});}
for(let i=0;i<150;i++){stars.push({x:Math.random()*canvasStars.width,y:Math.random()*canvasStars.height,r:Math.random()*1.5});}
const sakuraAudio=document.getElementById('sakuraAudio');
function draw(){
  ctxStars.clearRect(0,0,canvasStars.width,canvasStars.height);
  ctxSakura.clearRect(0,0,canvasSakura.width,canvasSakura.height);
  const hours=new Date().getHours();
  if(hours>=6 && hours<18){
    ctxStars.fillStyle="#0f1a3f";
    ctxStars.fillRect(0,0,canvasStars.width,canvasStars.height);
    stars.forEach(s=>{
      ctxStars.beginPath();
      ctxStars.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctxStars.fillStyle="white";
      ctxStars.fill();
      s.x+=Math.random()*0.5-0.25;
      s.y+=Math.random()*0.2;
      if(s.y>canvasStars.height) s.y=0;
    });
  } else {
    ctxSakura.fillStyle="#08101f";
    ctxSakura.fillRect(0,0,canvasSakura.width,canvasSakura.height);
    petals.forEach(p=>{
      ctxSakura.beginPath();
      ctxSakura.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctxSakura.fillStyle="pink";
      ctxSakura.fill();
      p.y+=p.d+1;
      p.x+=Math.sin(p.y*0.01);
      if(p.y>canvasSakura.height) p.y=-10;
    });
  }
}
setInterval(draw,33);

// 時間軸滑入 & 文字動畫
const tlItems=document.querySelectorAll(".timeline-item");
window.addEventListener('scroll',()=>{tlItems.forEach(item=>{const rect=item.getBoundingClientRect();if(rect.top<window.innerHeight-50)item.classList.add('show');});});
const animatedElems=document.querySelectorAll('.animated');
window.addEventListener('load',()=>{animatedElems.forEach(el=>el.classList.add('show'));});

// Resize
window.onresize=()=>{
  canvasStars.width=window.innerWidth; canvasStars.height=window.innerHeight;
  canvasSakura.width=window.innerWidth; canvasSakura.height=window.innerHeight;
}

// 分享按鈕
function share(platform){
  const url=encodeURIComponent(location.href);
  const text=encodeURIComponent("Check out this VTuber fanpage!");
  if(platform==='twitter') window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`);
  if(platform==='facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
  if(platform==='line') window.open(`https://social-plugins.line.me/lineit/share?url=${url}`);
}

// 小遊戲：點擊 VTuber avatar 顯示表情
const avatar=document.getElementById('vtuber-avatar');
avatar.addEventListener('click',()=>{
  alert("You clicked the VTuber! 🎉"); // 可以換成動畫效果
  clickAudio.play();
});

// 前端留言牆
// 取得元素
const sendBtn = document.getElementById('send-msg');
const clearBtn = document.getElementById('clear-msg');
const msgInput = document.getElementById('fan-msg');
const nameInput = document.getElementById('fan-name');
const messagesDiv = document.getElementById('messages');

// 箭頭滑動
const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');
const cardWidth = 265; // 卡片寬 + gap

leftArrow.addEventListener('click', () => {
  messagesDiv.scrollBy({
    left: -cardWidth,
    behavior: "smooth"
  });
});

rightArrow.addEventListener('click', () => {
  messagesDiv.scrollBy({
    left: cardWidth,
    behavior: "smooth"
  });
});

// 載入所有留言
function loadMessages() {

  const msgs = JSON.parse(localStorage.getItem('messages') || '[]');

  messagesDiv.innerHTML = '';

  msgs.forEach((m,index)=>{

    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg-card';

    msgDiv.innerHTML = `
      <div class="msg-name">${m.name}</div>
      <div class="msg-text">${m.msg}</div>
    `;

    messagesDiv.appendChild(msgDiv);

    setTimeout(()=>{
      msgDiv.classList.add('show');
    },index*80);

  });

  document.getElementById('total-msg').innerText = msgs.length;

}

loadMessages();


// 送出留言
sendBtn.addEventListener('click', () => {

  const name = nameInput.value || "Anonymous";
  const msg = msgInput.value;

  if(!msg) return alert("留言不能為空！");
  if(msg.length > 200) return alert("留言最多200字！");
  if(name.length > 20) return alert("暱稱最多20字！");

  const msgs = JSON.parse(localStorage.getItem('messages') || '[]');

  msgs.push({
    name:name,
    msg:msg
  });

  localStorage.setItem('messages', JSON.stringify(msgs));

  loadMessages();

  msgInput.value = "";
  nameInput.value = "";

});


// 清空留言
clearBtn.addEventListener('click', () => {

  if(confirm("確定要清空所有留言嗎？")){

    localStorage.removeItem('messages');

    loadMessages();

  }

});

// 前端投票系統
const voteBtns=document.querySelectorAll('.vote-btn');
const voteResults=document.getElementById('vote-results');
function loadVotes(){
  const votes=JSON.parse(localStorage.getItem('votes')||'{"Game Stream":0,"Chat Stream":0,"Special Event":0}');
  voteResults.innerHTML='';
  let total=0;
  for(let key in votes) total+=votes[key];
  for(let key in votes) voteResults.innerHTML+=`${key}: ${votes[key]} votes (${total?Math.round(votes[key]/total*100):0}%)<br>`;
  document.getElementById('total-votes').innerText=total;
  return votes;
}
let votes=loadVotes();
voteBtns.forEach(btn=>btn.addEventListener('click',()=>{
  const option=btn.dataset.option;
  votes=JSON.parse(localStorage.getItem('votes')||'{"Game Stream":0,"Chat Stream":0,"Special Event":0}');
  votes[option]+=1;
  localStorage.setItem('votes',JSON.stringify(votes));
  loadVotes();
}));
