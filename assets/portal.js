const menu=document.querySelector('#mobileMenu');
const toggle=document.querySelector('.menu-toggle');
function closeMenu(){if(!menu||!toggle)return;menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu');}
toggle?.addEventListener('click',()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden));toggle.setAttribute('aria-label',menu.hidden?'Abrir menu':'Fechar menu');});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu?.hidden){closeMenu();toggle.focus();}});
menu?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header,#mobileMenu'))closeMenu();});
document.querySelectorAll('[data-term]').forEach(b=>b.addEventListener('click',()=>{location.href='busca.html?q='+encodeURIComponent(b.dataset.term);}));
const form=document.querySelector('#catalogForm');
if(form){
 const results=document.querySelector('#results'),count=document.querySelector('#resultCount');
 const category=location.pathname.split('/').pop().replace('.html','');
 let catalog=[];
 const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function restore(){const params=new URLSearchParams(location.search);for(const name of ['q','categoria','assunto','formato','ordem'])form.elements[name].value=params.get(name)|| (name==='ordem'?'recentes':'');if(!params.has('categoria')&&['trabalho','casa','cidade'].includes(category))form.elements.categoria.value=category;}
 function render(push=false){
  const values=Object.fromEntries(new FormData(form));
  if(push){const params=new URLSearchParams();for(const [k,v]of Object.entries(values))if(v)params.set(k,v);history.pushState(null,'',location.pathname+'?'+params);}
  const terms=norm(values.q.trim()).split(/\s+/).filter(Boolean);
  const found=catalog.filter(p=>(!values.categoria||p.category===values.categoria)&&(!values.assunto||p.topic===values.assunto)&&(!values.formato||(values.formato==='rapido'?p.quick:!p.quick))&&terms.every(t=>norm([p.title,p.description,p.topic,p.category,p.text].join(' ')).includes(t)));
  found.sort((a,b)=>values.ordem==='titulo'?a.title.localeCompare(b.title,'pt-BR'):values.ordem==='antigos'?a.date.localeCompare(b.date):b.date.localeCompare(a.date));
  results.replaceChildren();count.textContent=found.length+' conteúdo(s) encontrado(s)';
  if(!found.length){const p=document.createElement('p');p.className='empty-results';p.textContent='Nenhum conteúdo encontrado. Tente outro termo ou limpe os filtros.';results.append(p);return;}
  for(const post of found){const article=document.createElement('article');article.className='post-card';const body=document.createElement('div');body.className='post-body';const tag=document.createElement('span');tag.className='tag';tag.textContent=post.topic;const h=document.createElement('h3');const a=document.createElement('a');a.href=post.url;a.textContent=post.title;h.append(a);const p=document.createElement('p');p.textContent=post.description;const small=document.createElement('small');small.textContent=(post.status==='demo'?'Demonstração · ':'')+(post.quick?'Dica rápida':'Guia');const link=document.createElement('a');link.href=post.url;link.textContent='Abrir conteúdo →';body.append(tag,h,p,small,link);article.append(body);results.append(article);}
 }
 form.addEventListener('submit',e=>{e.preventDefault();render(true);});
 form.addEventListener('change',e=>{if(e.target.tagName==='SELECT')render(true);});
 document.querySelector('#clearFilters').addEventListener('click',()=>{form.reset();render(true);});
 window.addEventListener('popstate',()=>{restore();render();});
 restore();count.textContent='Carregando catálogo…';
 fetch('assets/catalog.json').then(r=>{if(!r.ok)throw Error('Catálogo indisponível');return r.json();}).then(data=>{catalog=data;render();}).catch(()=>{count.textContent='Não foi possível carregar os filtros. Os links abaixo continuam disponíveis. Recarregue a página para tentar novamente.';form.querySelectorAll('button,select,input').forEach(e=>e.disabled=true);});
}
