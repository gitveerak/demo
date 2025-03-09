    const form = document.querySelector(".left_form");
    const input1 = document.querySelector(".name_input");
    const input2 = document.querySelector(".time_input");
    const cf_input1 = document.querySelector("#name");
    const cf_input2 = document.querySelector("#timing");
    const visibility = document.querySelector(".background_cf");
    const opacity = document.querySelector(".opacity_bottom_form");
    const del_conf = document.querySelector(".cbf_btn1");
    const form_name_tag = document.querySelector(".name_data");
    const form_btn_tag = document.querySelector(".delete_data");
    const info = document.querySelector(".notification");

    form.addEventListener("submit", async function(event) {
        event.preventDefault(); // Stop page reload
        let formData = new FormData(this); // Capture form data
        let response = await fetch("/timer", {
            method: "POST",
            body: formData
        });
        startTimer(input2.value);
        input1.value = "";
        input2.value = "";
        await message("✔ Form Submitted Successfully","green");        
        setTimeout(() => {
            window.location.reload(); 
        }, 2000);
    });

    input1.addEventListener('keydown', function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); 
            input2.focus();
        }
    });
    input2.addEventListener('keydown', function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            if (form.checkValidity()) {
                visibility.style.display='block';
                // startTimer(input2.value);
                cf_input1.innerText=input1.value;
                cf_input2.innerText=input2.value;
            }
            else{
                form.reportValidity();
            }
        }
    });
    let timerInterval;
    let startTime;
    let timeLeft;

function startTimer(time) {
if (timerInterval) clearInterval(timerInterval); // Stop any existing timer

startTime = Date.now(); // Store the exact start time
localStorage.setItem("timerStart", startTime); // Save it in localStorage
localStorage.setItem("timerDuration", ((time * 60)+1)); // Save total duration in seconds

updateTimer(); // Start countdown
timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
let storedStart = localStorage.getItem("timerStart");
let storedDuration = localStorage.getItem("timerDuration");

if (!storedStart || !storedDuration) return; // No timer stored, do nothing

let elapsed = Math.floor((Date.now() - storedStart) / 1000); // Time passed in seconds
timeLeft = storedDuration - elapsed; // Remaining time

if (timeLeft == 0) {
    clearInterval(timerInterval);
    timerInterval = null;
    localStorage.removeItem("timerStart");
    localStorage.removeItem("timerDuration");
    document.getElementById("timer").textContent = "00:00";
    play_alarm();
    return;
}

let min = Math.floor(timeLeft / 60);
let sec = timeLeft % 60;
document.getElementById("timer").textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function resetTimer() {
if(timerInterval){
    clearInterval(timerInterval);
    timerInterval = null;
    localStorage.removeItem("timerStart");
    localStorage.removeItem("timerDuration");
    document.getElementById("timer").textContent = "00:00";
    cancelForm();
    message("🚨 Timer is Stops!","red");
}
else {
    if(input1.value || input2.value){
        input1.value = "";
        input2.value = "";
        message("🚨 The input values are resets!","red");
    }
    else    
        message("🚨 There's no timer active currently...","red");
}
}

// Restore the timer when the page reloads
window.onload = function () {
if (localStorage.getItem("timerStart")) {
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
}
};


    function cancel(){
        if(visibility){
            visibility.style.display='none';
            input1.value = "";
            input2.value = "";}
        if(opacity){
            opacity.style.display='none';
        }
    }
    
    function t_submit(event){
        event.preventDefault();
        visibility.style.display='block';
        startTimer(input2.value);
        message("✔  Data Successfully Created!!");
        setTimeout(() => {
            form.submit();
        }, 2500);
    }

    function play_alarm(){
        if (count<3){
            updateForm();
            alarm();
        }
    }
    let count=0;
    function alarm(){
        let audio = document.getElementById("audioPlayer");
        if (count<3){
            audio.play();
            count++;
            audio.onended = function () {
                setTimeout(() => {
                    alarm(); 
                }, 2500);
            };
        }
    }

    
    async function updateForm() { 
        let response = await fetch("/updated_data", { method: "POST" });
        let data = await response.json();

        if (data.status === "✅") {
            let statusElement = document.getElementById(`status-${data._id}`);
            if (statusElement) {
                statusElement.innerText = "✅"; // Update status in table
                message("🚨 Times Up!...","darkred");
            }
        }
    }

    async function cancelForm() { 
        let response = await fetch("/canceled_data", { method: "POST" });
        let data = await response.json();

        if (data.status === "❌") {
            let statusElement = document.getElementById(`status-${data._id}`);
            if (statusElement) {
                statusElement.innerText = "❌"; // Cancel status in table
            }
        }
    }

    let doc_id = null; 
    function del_confirm(selectedId){
        doc_id=selectedId;
        opacity.style.display="block";

    }
    async function delete_row() {
        opacity.style.display="none";
        let response = await fetch(`/delete/${doc_id}`, { method: "DELETE" });

        if (response.ok) {
            message("🚨 Document deleted successfully!");
            let row = document.querySelector(".row-"+doc_id);
            if(row) row.remove();
            doc_id = null;
        } else {
            message("🚨 Failed to delete document!");
        }
        
    }
    

    function message(sos,color="black"){
        info.style.display="block";
        info.style.color = color;
        info.innerHTML=sos;
        setTimeout(() => {
            info.style.color = color;
            info.innerHTML="";
            info.style.display = "none";
        }, 5000);
    }
    

    function updateClock() {
        const now = new Date();
        document.getElementById("clock").innerText =
            now.toLocaleTimeString('en-GB', { hour12: false });
    }
    setInterval(updateClock, 1000);
    updateClock(); // Run once immediately
