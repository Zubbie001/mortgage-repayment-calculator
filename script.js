const form = document.getElementById("mortgage-form");
const amount = document.getElementById("amount");
const term = document.getElementById("term");
const interest = document.getElementById("interest");

const amountError = document.getElementById("amount-error");
const termError = document.getElementById("term-error");
const interestError = document.getElementById("interest-error");

const amountBox = document.getElementById("amount-box");
const termBox = document.getElementById("term-box");
const interestBox = document.getElementById("interest-box");

const monthlyPayment = document.getElementById("monthly-payment");
const totalPayment = document.getElementById("total-payment");
const emptyResult = document.getElementById("empty-result");
const resultBox = document.getElementById("result-box");
const clearBtn = document.getElementById("clear-btn");

// Start with results hidden
resultBox.style.display = "none";

// Format mortgage amount with commas while typing
amount.addEventListener("input", function () {
    let value = this.value;

    // Remove everything except numbers
    value = value.replace(/[^0-9]/g, "");

    // Add commas every three digits
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    this.value = value;
});

function clearErrors() {
    [amountError, termError, interestError].forEach(error => {
        error.textContent = "";
    });

    [amountBox, termBox, interestBox].forEach(box => {
        box.classList.remove("error");
    });
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    // Remove commas before calculating
    const principal = parseFloat(amount.value.replace(/,/g, ""));
    const years = parseFloat(term.value);
    const annualRate = parseFloat(interest.value);

    const mortgageType = document.querySelector('input[name="mortgageType"]:checked');

    let isValid = true;

    if (!amount.value || isNaN(principal) || principal <= 0) {
        amountError.textContent = "This field is required";
        amountBox.classList.add("error");
        isValid = false;
    }

    if (!term.value || isNaN(years) || years <= 0) {
        termError.textContent = "This field is required";
        termBox.classList.add("error");
        isValid = false;
    }

    if (!interest.value || isNaN(annualRate) || annualRate <= 0) {
        interestError.textContent = "This field is required";
        interestBox.classList.add("error");
        isValid = false;
    }

    if (!mortgageType) {
        return;
    }

    if (!isValid) return;

    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;

    let monthly;
    let total;

    if (mortgageType.value === "repayment") {
        monthly =
            principal *
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        total = monthly * numberOfPayments;
    } else {
        monthly = principal * monthlyRate;
        total = monthly * numberOfPayments + principal;
    }

    monthlyPayment.textContent =
        "£" +
        monthly.toLocaleString("en-GB", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    totalPayment.textContent =
        "£" +
        total.toLocaleString("en-GB", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    emptyResult.style.display = "none";
    resultBox.style.display = "block";
});

// Clear All
clearBtn.addEventListener("click", function (e) {
    e.preventDefault();

    form.reset();
    clearErrors();

    monthlyPayment.textContent = "£0.00";
    totalPayment.textContent = "£0.00";

    resultBox.style.display = "none";
    emptyResult.style.display = "block";
});
