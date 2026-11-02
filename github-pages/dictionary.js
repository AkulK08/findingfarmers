(() => {
  'use strict';
  const data = window.KISAN_DICTIONARY;
  const $ = selector => document.querySelector(selector);
  const evidenceLabels = {documented:'जिला रिपोर्ट',historical:'ऐतिहासिक अभिलेख · 1885',lexicon:'भोजपुरी शब्दकोश'};
  const languageLabels = {bho:'भोजपुरी',regional:'क्षेत्रीय शब्द · स्रोत में भाषा अलग नइखे दिहल'};
  const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f\u093c]/g, '').toLocaleLowerCase().trim();
  let shown = [], selectedId = '';
  const params = new URLSearchParams(location.search);
  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function link(text, url) {
    const a = element('a', text); a.href = url;
    if (url.startsWith('https://')) {a.target = '_blank'; a.rel = 'noopener noreferrer';}
    return a;
  }
  function fillSelect(select, options) {
    options.forEach(([value,label]) => { const option = element('option',label); option.value = value; select.append(option); });
  }
  fillSelect($('#place-filter'), Object.entries(data.places));
  fillSelect($('#category-filter'), [...new Set(data.entries.map(item=>item.category))].map(label=>[label,label]));
  const alphabet = [...new Set(data.entries.map(item => Array.from(item.word)[0]))].sort((a,b)=>a.localeCompare(b,'hi'));
  fillSelect($('#letter-filter'), alphabet.map(letter=>[letter,letter]));
  const letters=[['','सब'],...alphabet.map(letter=>[letter,letter])];
  letters.forEach(([value,label])=>{const button=element('button',label);button.type='button';button.dataset.letter=value;button.addEventListener('click',()=>{$('#letter-filter').value=value;update();});$('#alphabet').append(button);});
  $('#total-entries').textContent = data.entries.length;
  [['letter','#letter-filter'],['q','#dictionary-search'],['place','#place-filter'],['category','#category-filter'],['evidence','#evidence-filter']].forEach(([key,selector])=>{
    if (params.has(key)) {$(selector).value = params.get(key); if ($(selector).tagName==='SELECT' && $(selector).selectedIndex<0) $(selector).value='';}
  });
  function saveUrl(id) {
    const next = new URL(location.href);
    [['letter','#letter-filter'],['q','#dictionary-search'],['place','#place-filter'],['category','#category-filter'],['evidence','#evidence-filter']].forEach(([key,selector])=>{
      const value=$(selector).value.trim(); if(value)next.searchParams.set(key,value);else next.searchParams.delete(key);
    });
    next.hash = id ? 'word-'+id : '';
    try { history.replaceState(null,'',next); } catch { /* Local file previews may restrict history. */ }
  }
  function showEntry(item) {
    const panel = $('#entry-detail'); panel.replaceChildren(); selectedId = item ? item.id : '';
    if (!item) {panel.append(element('h2','अइसन शब्द अभी नइखे मिलल।'),element('p','खोज छोट करीं, रोमन लिखाई आजमाईं, भा जिला वाला फिल्टर हटाईं।')); return;}
    const mast=element('div',undefined,'entry-mast');
    mast.append(element('span','प्रविष्टि '+item.accession,'accession'),element('span',evidenceLabels[item.evidence],'entry-status '+item.evidence));panel.append(mast);
    panel.append(element('h2',item.word));
    const lexical=element('div',undefined,'lexical-line');lexical.setAttribute('aria-label','शब्द-भेद आ रोमन लिप्यंतरण');lexical.append(element('span',item.partOfSpeech,'word-class'),element('span',item.roman,'roman'));panel.append(lexical);
    panel.append(element('h3','परिभाषा','sense-label'));
    const sense=element('div',undefined,'sense');sense.append(element('span','1.','sense-number'),element('p',item.meaning,'meaning'));panel.append(sense);
    panel.append(element('h3','प्रयोग के क्षेत्र आ दस्तावेज','section-label'));
    const dl=element('dl');
    [['विषय',item.category],['भाषा',languageLabels[item.language]],['जगह',item.places.length?item.places.map(key=>data.places[key]).join(' / '):'खास जिला स्रोत में नइखे दिहल']].forEach(([term,description])=>{
      dl.append(element('dt',term),element('dd',description));
    }); panel.append(dl);
    if(item.aliases.length) panel.append(element('p','खोज में शामिल लिखाई: '+item.aliases.join(' / '),'entry-note'));
    if(item.note) panel.append(element('p',item.note,'entry-note'));
    if(item.evidence==='historical') panel.append(element('p','1885 के अभिलेख; आज के गाँव-स्तर प्रयोग अभी सत्यापित नइखे।','evidence-note'));
    if(item.evidence==='lexicon') panel.append(element('p','प्रकाशित भोजपुरी शब्द; जिला-स्तर प्रमाण अभी नइखे।','evidence-note'));
    panel.append(element('h3','स्रोत में देखीं'));
    const refs=element('ol',undefined,'entry-sources');
    item.sources.forEach(key=>{const s=data.sources[key],li=element('li');li.append(link(s.title,s.url),element('small',s.date));refs.append(li);});
    panel.append(refs,element('p','संदर्भ: '+item.ref,'entry-note'));
    if(item.related.length){const related=element('div',undefined,'related'); related.append(element('h3','जुड़ल शब्द'));item.related.forEach(id=>{
      const target=data.entries.find(entry=>entry.id===id); if(!target)return;
      const button=element('button',target.word);button.type='button';button.addEventListener('click',()=>{
        $('#filters').reset(); update(id); $('#entry-detail').scrollIntoView({block:'nearest',behavior:'smooth'});
      });related.append(button);
    });panel.append(related);}
    const actions=element('div',undefined,'entry-actions'); const share=element('button','शब्द के लिंक कॉपी करीं');share.type='button';
    const notice=element('p','');notice.setAttribute('role','status');
    share.addEventListener('click',async()=>{
      const wordUrl=new URL(location.href);wordUrl.hash='word-'+item.id;
      try{await navigator.clipboard.writeText(wordUrl.href);notice.textContent='लिंक कॉपी हो गइल।';}catch{notice.textContent='लिंक: '+wordUrl.href;}
    });actions.append(share,notice);panel.append(actions);
  }
  function update(preferredId) {
    const tokens=normalize($('#dictionary-search').value).split(/\s+/).filter(Boolean),place=$('#place-filter').value,category=$('#category-filter').value,evidence=$('#evidence-filter').value,letter=$('#letter-filter').value;
    shown=data.entries.filter(item=>{
      const haystack=normalize([item.word,item.roman,...item.aliases,item.meaning,item.english,item.category].join(' '));
      return tokens.every(token=>haystack.includes(token))&&(!place||item.places.includes(place))&&(!category||category===item.category)&&(!evidence||evidence===item.evidence)&&(!letter||item.word.startsWith(letter));
    });
    shown.sort((a,b)=>a.word.localeCompare(b.word,'hi'));
    document.querySelectorAll('#alphabet button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.letter===letter)));
    $('#result-count').textContent=shown.length+' / '+data.entries.length+' शब्द';
    $('#export').disabled=!shown.length;
    const list=$('#word-list');list.replaceChildren();
    const chosen=shown.find(item=>item.id===preferredId)||shown.find(item=>item.id===selectedId)||shown[0];
    shown.forEach(item=>{const button=element('button',undefined,'word-button');button.type='button';button.setAttribute('aria-pressed',String(item===chosen));
      button.append(element('span',item.word,'index-word'),element('span',item.partOfSpeech+' · '+item.category,'index-meaning'),element('small',item.accession+' / '+evidenceLabels[item.evidence]));
      button.addEventListener('click',()=>{update(item.id);if(matchMedia('(max-width: 760px)').matches)$('#entry-detail').scrollIntoView({behavior:'smooth',block:'start'});});list.append(button);
    });
    if(!shown.length){const empty=element('div',undefined,'empty');empty.append(element('h3','कवनो शब्द ना मिलल।'),element('p','सब फिल्टर साफ करके फेर खोजीं।'));list.append(empty);}
    showEntry(chosen);saveUrl(chosen?.id);
  }
  $('#filters').addEventListener('submit',event=>event.preventDefault());
  $('#dictionary-search').addEventListener('input',()=>update());
  document.querySelectorAll('#filters select').forEach(select=>select.addEventListener('change',()=>update()));
  $('#filters').addEventListener('reset',()=>setTimeout(()=>update(),0));
  function download(value,name){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json;charset=utf-8'}));const a=link(name,url);a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  $('#export').addEventListener('click',()=>download({version:data.version,researchedAt:data.researchedAt,scope:'Published documentary records; no field verification claimed',places:data.places,sources:data.sources,entries:shown},'kisan-khoj-regional-dictionary.json'));
  $('#contribution-form').addEventListener('submit',event=>{
    event.preventDefault();const form=event.currentTarget;
    const fields=Object.fromEntries([...new FormData(form)].map(([key,value])=>[key,String(value).trim()]));
    if(Object.values(fields).some(value=>!value)){ $('#contribution-status').textContent='हर जगह खाली स्पेस के बदले जानकारी लिखीं।';return; }
    download({status:'unreviewed-local-draft',createdAt:new Date().toISOString(),...fields},'kisan-khoj-word-draft.json');
    $('#contribution-status').textContent='ड्राफ्ट डाउनलोड शुरू भइल। ई अभी टीम के भेजल भा प्रकाशित नइखे भइल।';
  });
  Object.entries(data.sources).forEach(([key,source])=>{const article=element('article');article.id='source-'+key;article.append(element('h3',source.title),element('p',source.note),link('मूल स्रोत खोलीं',source.url));$('#source-list').append(article);});
  window.addEventListener('hashchange',()=>{const id=location.hash.replace('#word-',''); if(data.entries.some(item=>item.id===id))update(id);});
  const initialWord=location.hash.startsWith('#word-')?location.hash.slice(6):'';
  update(initialWord);
  if(initialWord)requestAnimationFrame(()=>$('#browse').scrollIntoView({block:'start'}));
})();
