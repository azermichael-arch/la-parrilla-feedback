let currentRating = "";

function rate(rating){

    currentRating = rating;

    if(rating=="Happy"){

        submitFeedback("");

        return;

    }

    document.getElementById("mainScreen").style.display="none";

    document.getElementById("reasonScreen").style.display="block";

    if(rating=="Sad")

        document.getElementById("reasonTitle").innerHTML="We're Sorry.<br>What went wrong?";

    else

        document.getElementById("reasonTitle").innerHTML="Thank you.<br>What can we improve?";

}

function sendReason(reason){

    submitFeedback(reason);

}

function submitFeedback(reason){

fetch(CONFIG.apiUrl,{

method:"POST",

body:JSON.stringify({

branch:CONFIG.branch,

device:CONFIG.device,

rating:currentRating,

reason:reason

})

})

.then(response=>response.text())

.then(data=>{

document.getElementById("mainScreen").style.display="none";

document.getElementById("reasonScreen").style.display="none";

document.getElementById("thankYou").style.display="block";

setTimeout(function(){

location.reload();

},2000);

});

}