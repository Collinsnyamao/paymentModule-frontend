let payment_amount = 10;
let payName, payEmail;

var generate_ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
};

let confirmPayment = function (paymentID, paymentREF) {
    let returned = '';

    $.post("http://localhost:3000/confirmation",
        {
            txID: paymentID,
            txREF: paymentREF
        },
        function(data, status){
            console.log("Data: " + data, "Status: " + status);
            setTimeout(function () {
                if (data === 'successful' && status === 'success'){
                    returned = 'successful';
                }else {
                    returned = 'failed'
                }
            },3000);
        });
    return returned;
}

let abbreviationGenerator = function (fullString) {
    return fullString.match(/\b([A-Z])/g).join('');
}



function checkForm() {
    let inputName = document.getElementById('payName').value;
    let inputEmail = document.getElementById('payEmail').value;
    let inputNumber = document.getElementById('payNumber').value;

    let transactionReference = abbreviationGenerator(inputName) + generate_ID();
    console.log(transactionReference);
    if (inputName){
        if (inputEmail){
            if (inputNumber){
                console.log(inputName,inputEmail,inputNumber)
                makePayment(inputName,inputEmail,inputNumber,transactionReference);
            }

        }else {

        }
    }else {

    }
}

document.getElementById('totalAmount').innerText = payment_amount;
document.getElementsByClassName('currency').innerText = 'KES. ';

function makePayment(inputName,inputEmail,inputNumber,tx_ref) {
    amount_to_pay = payment_amount;
    FlutterwaveCheckout({
        public_key: "FLWPUBK-ae68600a9e39f08764f156cf16ac9e2c-X",
        tx_ref: tx_ref,
        amount: amount_to_pay,
        currency: "KES",
        /*meta: {
            consumer_id: 23,
            consumer_mac: "92a3-912ba-1192a",
        },*/
        customer: {
            email: inputEmail,
            phone_number: inputNumber,
            name: inputName
        },
        callback: function (data) {
            console.log(data);

            $.ajax({
                type: "POST",
                url: "http://localhost:3000/confirmation",
                data: {
                    txID: data.transaction_id,
                    txREF: data.tx_ref
                },
                success: function (success) {
                    console.log(success);
                    if (success.status === "successful"){
                        console.log('redirecting success', success);
                        window.location.replace(window.location.href+"paymentSuccess.html"+ '?tx_ref='+ success.tx_ref +'&transaction_id='+ success.id +'&status='+ success.status +'');
                        logger(success);
                    }else {
                        console.log('redirect fail', success);
                        window.location.replace(window.location.href+"paymentSuccess.html"+ '?tx_ref='+ success.tx_ref +'&transaction_id='+ 0 +'&status='+ data.status +'');
                        logger(data);
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        },
        onclose: function () {
            // close modal
        },
        customizations: {
            title: "Freelance marketplace",
            description: "Payment for Services",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/1200px-M-PESA_LOGO-01.svg.png",
        },
    });
}

let logger = function (data) {
    console.log('data sent : ', data);
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/db",
        data: data,
        success: function (success) {
            console.log('success sent ', success);
        },
        error: function (error) {
            console.log('error ', error);
        }
    });
}

