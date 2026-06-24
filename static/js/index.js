document.addEventListener('DOMContentLoaded', function () {

    var stripe = Stripe(STRIPE_PUBLIC_KEY);
    var elements = stripe.elements();

    var style = {
        base: {
            color: "#000",
            fontSize: "16px",
            lineHeight: "2.4",
        }
    };

    var card = elements.create("card", { style: style });
    card.mount("#card-element");

    card.on('change', function(event) {
        var displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
            displayError.classList.add('alert', 'alert-danger');
        } else {
            displayError.textContent = '';
            displayError.classList.remove('alert', 'alert-danger');
        }
    });

});
