let alreadySubmitted = false;

let currentRating = "";

function rate(rating){

    if(alreadySubmitted) return;

    alreadySubmitted = true;

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

    // Immediately hide the other screens
    document.getElementById("mainScreen").style.display="none";
    document.getElementById("reasonScreen").style.display="none";
    document.getElementById("thankYou").style.display="block";

    // Send feedback in the background
fetch(CONFIG.apiUrl,{
    method:"POST",
    body:JSON.stringify({
        branch:CONFIG.branch,
        device:CONFIG.device,
        rating:currentRating,
        reason:reason
    })
})
})
.then(response=>{
    console.log("Status:", response.status);
    return response.text();
})
.then(data=>{
    console.log("Response:", data);
})
.catch(error=>{
    console.error("Fetch Error:", error);
});
}
