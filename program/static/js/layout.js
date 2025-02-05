document.addEventListener('DOMContentLoaded', function () {
    const refresh =document.querySelector(".logo");
    refresh.addEventListener('click',function(){
        window.location.href='/home';
    });
});