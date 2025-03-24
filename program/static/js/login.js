const info= document.querySelector('.message');
if(!info.innerHTML==""){ 
    info.style.display="block";
    setTimeout(() => { 
    info.style.display="none";}, 8000);
}