// ==========================================
// GLOBAL VARIABLES
// ==========================================

let promotionIndex = 0;

let promotionTimer = null;

let currentRating = "";

let feedbackSubmitted = false;

let ratingSelected = false;


// ==========================================
// REASON LISTS
// ==========================================

const HAPPY_REASONS = [

    "🍔 Food Taste",

    "👨‍🍳 Friendly Staff",

    "⚡ Fast Service",

    "🧼 Cleanliness",

    "💰 Great Value",

    "⭐ Everything was Excellent"

];


const NEUTRAL_REASONS = [

    "🍔 Food Quality",

    "⏱ Waiting Time",

    "👨‍🍳 Staff Service",

    "🧼 Cleanliness",

    "💰 Value for Money",

    "📝 Other"

];


const SAD_REASONS = [

    "🍔 Food Quality",

    "⏱ Long Waiting Time",

    "👨‍🍳 Staff Attitude",

    "🧼 Cleanliness",

    "❌ Order Accuracy",

    "📝 Other"

];


// ==========================================
// APPLICATION START
// ==========================================

window.onload = function () {

    if (CONFIG.mode === "promotion") {

        startPromotion();

    } else {

        showScreen(CONFIG.mode);

    }

};


// ==========================================
// SCREEN MANAGEMENT
// ==========================================

function showScreen(name) {

    const screens = document.querySelectorAll(".screen");

    screens.forEach(function (screen) {

        screen.style.display = "none";

    });


    switch (name) {

        case "promotion":

            document.getElementById("promotionScreen")
                .style.display = "flex";

            break;


        case "feedback":

            document.getElementById("feedbackScreen")
                .style.display = "flex";

            break;


        case "reason":

            document.getElementById("reasonScreen")
                .style.display = "flex";

            break;


        case "video":

            document.getElementById("videoScreen")
                .style.display = "flex";

            break;


        case "menu":

            document.getElementById("menuScreen")
                .style.display = "flex";

            break;


        case "thankyou":

            document.getElementById("thankYouScreen")
                .style.display = "flex";

            break;

    }

}


// ==========================================
// PROMOTION FUNCTIONS
// ==========================================

function startPromotion() {

    if (
        typeof PROMOTIONS === "undefined" ||
        PROMOTIONS.length === 0
    ) {

        console.error("No promotions were found.");

        return;

    }

    showPromotion();

    promotionTimer = setInterval(
        showPromotion,
        CONFIG.promotionTime
    );

}


function showPromotion() {

    showScreen("promotion");

    const item = PROMOTIONS[promotionIndex];

    document.getElementById("promotionImage").src =
        item.image;

    document.getElementById("promotionTitle").textContent =
        item.title;

    document.getElementById("promotionPrice").textContent =
        item.price;

    promotionIndex++;

    if (promotionIndex >= PROMOTIONS.length) {

        promotionIndex = 0;

    }

}


// ==========================================
// FEEDBACK FUNCTIONS
// ==========================================

function rate(rating) {

    if (ratingSelected || feedbackSubmitted) {

        return;

    }

    ratingSelected = true;

    currentRating = rating;


    if (rating === "Happy") {

        document.getElementById("reasonTitle").innerHTML =
            "What did you enjoy the most today?";

        loadReasons(HAPPY_REASONS);

        showScreen("reason");

        return;

    }


    if (rating === "Neutral") {

        document.getElementById("reasonTitle").innerHTML =
            "What can we improve?";

        loadReasons(NEUTRAL_REASONS);

        showScreen("reason");

        return;

    }


    document.getElementById("reasonTitle").innerHTML =
        "We're sorry.<br>What disappointed you today?";

    loadReasons(SAD_REASONS);

    showScreen("reason");

}


// ==========================================
// LOAD REASON BUTTONS
// ==========================================

function loadReasons(reasonList) {

    const buttons =
        document.querySelectorAll("#reasonButtons button");

    for (let i = 0; i < buttons.length; i++) {

        if (reasonList[i]) {

            buttons[i].innerHTML = reasonList[i];

            buttons[i].style.display = "block";

        } else {

            buttons[i].style.display = "none";

        }

    }

}


// ==========================================
// REASON SELECTED
// ==========================================

function sendReason(reason) {

    if (feedbackSubmitted) {

        return;

    }

    const cleanReason = reason

        .replace("🍔", "")

        .replace("👨‍🍳", "")

        .replace("⚡", "")

        .replace("🧼", "")

        .replace("💰", "")

        .replace("⭐", "")

        .replace("⏱", "")

        .replace("❌", "")

        .replace("📝", "")

        .trim();

    submitFeedback(cleanReason);

}


// ==========================================
// SUBMIT FEEDBACK
// ==========================================

function submitFeedback(reason) {

    if (feedbackSubmitted) {

        return;

    }

    feedbackSubmitted = true;


    // Show confirmation immediately.

    showScreen("thankyou");


    const feedbackData = {

        branch: CONFIG.branch,

        device: CONFIG.device,

        rating: currentRating,

        reason: reason

    };


    console.log("Submitting feedback:", feedbackData);


    /*
       Do not add an application/json Content-Type header.
       This avoids the Google Apps Script CORS preflight problem.
    */

    fetch(CONFIG.apiUrl, {

        method: "POST",

        body: JSON.stringify(feedbackData),

        keepalive: true

    })

    .then(function (response) {

        console.log(
            "Feedback request completed:",
            response.status
        );

    })

    .catch(function (error) {

        console.error(
            "Feedback submission error:",
            error
        );

    });


    setTimeout(function () {

        resetFeedbackScreen();

    }, CONFIG.thankYouTime);

}


// ==========================================
// RESET FEEDBACK
// ==========================================

function resetFeedbackScreen() {

    currentRating = "";

    feedbackSubmitted = false;

    ratingSelected = false;

    showScreen("feedback");

}
