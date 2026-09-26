document.querySelectorAll('footer a').forEach(link=>{
  const label=link.textContent.trim();
  if(label==='Sobre') link.href='sobre.html';
  if(label==='Política editorial') link.href='politica-editorial.html';
});
