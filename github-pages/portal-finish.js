const workspaceGuide=document.createElement('div');
workspaceGuide.className='workspace-guide';
workspaceGuide.innerHTML='<article><span>01</span><h4>अपना जिला</h4><p>पाँच उपलब्ध जिला में से अपना इलाका चुनीं।</p></article><article><span>02</span><h4>फसल के अवस्था</h4><p>रोपनी, फूल आ दाना भरला पर जरूरत बदल जाला।</p></article><article><span>03</span><h4>सात दिन के नजर</h4><p>बरखा, तापमान आ खेत के काम एक साथे देखीं।</p></article>';
document.querySelector('#result-placeholder').append(workspaceGuide);

const outlook=document.createElement('section');
outlook.className='weather-outlook';
outlook.setAttribute('aria-label','सात दिन के मौसम');
document.querySelector('.risk-heading').before(outlook);
const originalRender=render;
render=function(result,district){
  originalRender(result,district);
  const maxRain=Math.max(10,...result.forecast.map(day=>day.rain));
  outlook.innerHTML='<h4>अगिला सात दिन के मौसम</h4><div class="weather-days">'+result.forecast.map(day=>{
    const date=new Date(day.date+'T12:00:00Z').toLocaleDateString('hi-IN',{day:'numeric',month:'short'});
    return `<div class="weather-day"><span>${date}</span><div class="weather-bar"><i style="height:${Math.max(2,day.rain/maxRain*100)}%"></i></div><b>${round(day.rain)} mm</b><small>${round(day.max)} °C</small></div>`;
  }).join('')+'</div>';
  const labels=['पानी जमाव','गरमी तनाव','रोग दबाव','सिंचाई जरूरत'];
  document.querySelectorAll('.risk-top>span').forEach((label,index)=>label.textContent=labels[index]);
};

function clearAdvice(){
  lastRun=null;
  document.querySelector('#result-content').hidden=true;
  document.querySelector('#result-placeholder').hidden=false;
  document.querySelector('#error').hidden=true;
}
document.querySelectorAll('#district,#crop,#stage').forEach(field=>field.addEventListener('change',clearAdvice));
document.querySelectorAll('[data-pick-district]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelector('#district').value=button.dataset.pickDistrict;
  renderMap();clearAdvice();
  document.querySelector('#model').scrollIntoView({behavior:'smooth'});
}));
document.querySelectorAll('[data-map-district]').forEach(pin=>{
  pin.setAttribute('tabindex','0');pin.setAttribute('role','button');
  pin.setAttribute('aria-label',districts[pin.dataset.mapDistrict].bho+' जिला चुनीं');
  const choose=()=>{document.querySelector('#district').value=pin.dataset.mapDistrict;renderMap();clearAdvice();};
  pin.addEventListener('click',choose);
  pin.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();choose();}});
});

const motionReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.field-film,.story-media').forEach(section=>{
  const video=section.querySelector('video');
  let button=section.querySelector('.film-toggle');
  if(!button){button=document.createElement('button');button.type='button';button.className='film-toggle';section.append(button);}
  let stopped=motionReduced;
  const update=()=>{button.textContent=video.paused?'वीडियो चलाईं':'वीडियो रोकीं';button.setAttribute('aria-label',button.textContent);};
  if(motionReduced)video.pause();
  button.addEventListener('click',()=>{stopped=!video.paused;if(stopped)video.pause();else video.play().catch(()=>{});update();});
  video.addEventListener('play',update);video.addEventListener('pause',update);update();
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting&&!stopped)video.play().catch(()=>{});else video.pause();});},{threshold:.1});
  observer.observe(section);
});
