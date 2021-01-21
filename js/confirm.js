const queryString = window.location.search;
console.log(queryString);

const urlParams = new URLSearchParams(queryString);
console.log(urlParams);

let status = urlParams.get('status');

console.log(status);

if (status === 'code404' || status === 'failed'){
    console.log('check 2')
    document.getElementById('failDIV').hidden = false;
    document.getElementById('successDIV').hidden = true;
}else if (status === 'successful'){
    console.log('check 2')
    document.getElementById('failDIV').hidden = true;
    document.getElementById('successDIV').hidden = false;
}
