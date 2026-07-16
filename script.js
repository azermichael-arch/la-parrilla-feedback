let promotionIndex = 0;

let promotionTimer = null;

let currentRating = "";

let feedbackSubmitted = false;

let ratingSelected = false;


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

    if (!PROMOTIONS || PROMOTIONS.length === 0) {

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

        submitFeedback("");

        return;

    }


    if (rating === "Sad") {

        document.getElementById("reasonTitle").innerHTML =
            "We're sorry.<br>What went wrong?";

    } else {

        document.getElementById("reasonTitle").innerHTML =
            "Thank you.<br>What can we improve?";

    }

    showScreen("reason");

}


function sendReason(reason) {

    if (feedbackSubmitted) {

        return;

    }

    submitFeedback(reason);

}


function submitFeedback(reason) {

    if (feedbackSubmitted) {

        return;

    }

    feedbackSubmitted = true;


    // Give the customer immediate confirmation.

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

       That header causes a CORS preflight problem with
       Google Apps Script when hosted on GitHub Pages.
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


function resetFeedbackScreen() {

    currentRating = "";

    feedbackSubmitted = false;

    ratingSelected = false;

    showScreen("feedback");

}
