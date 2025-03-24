document.addEventListener('DOMContentLoaded', function () {

    const refresh =document.querySelector(".logo");
    refresh.addEventListener('click',function(){
        window.location.href='/home';
    });

    const menu = document.querySelector(".menu");
    let b1 = document.querySelector(".b1");
    let b2 = document.querySelector(".b2");
    let b3 = document.querySelector(".b3");
    let is_alive = false;
    let menu_drpbx = document.querySelector(".menu_container");

    menu.addEventListener('click', function(){
        is_alive = !is_alive;
        hamburger(is_alive);
    });

    function hamburger(status){
        if(status){
            b1.style.transform = "rotate(45deg)";
            b1.style.top = "7px"; 
            b2.style.opacity= "0"; 
            b3.style.transform = "rotate(-45deg)";
            b3.style.top = "-3px"; 
            menu_drpbx.style.display = "block"; 
        }
        else {
            b1.style.transform = "rotate(0deg)";
            b1.style.top = "0";
            b2.style.opacity = "1";
            b3.style.transform = "rotate(0deg)";
            b3.style.top = "0";
            menu_drpbx.style.display = "none"; 
        }
    }
    
    //Show password
    let passwordInput = document.getElementById("password");
    let togglePassword = document.querySelector(".show_hide");

    let showIcon = togglePassword.src; 
    let hideIcon = showIcon.replace("show.png", "hide.png"); 

    togglePassword.addEventListener("click", function() {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.src = hideIcon; // Swap to hide icon
        } else {
            passwordInput.type = "password";
            togglePassword.src = showIcon; // Swap back to show icon
        }
    });
});