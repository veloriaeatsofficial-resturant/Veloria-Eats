const API_URL = "https://script.google.com/macros/s/AKfycbxs6ne3Hh9IodRqP0sKQefgeX2W3lcRT41lQ42d-3yz1XbjqVHaKfGRaA9PQftfFCJE/exec";

async function trackTransaction() {

const txid = document.getElementById("txid").value.trim();

if (!txid) {
alert("Enter Transaction ID");
return;
}

document.getElementById("loading").style.display = "block";

try {

const res = await fetch(API_URL);
const data = await res.json();

console.log(data); // DEBUG

const tx = data.find(t =>
(String(t["Transaction ID"] || "").trim() === txid)
);

document.getElementById("loading").style.display = "none";

if (!tx) {
document.getElementById("result").style.display = "block";
document.getElementById("details").innerHTML =
"❌ Transaction Not Found";
return;
}

/* SHOW DATA */

document.getElementById("result").style.display = "block";

document.getElementById("details").innerHTML = `
<b>ID:</b> ${tx["Transaction ID"]}<br>
<b>Receiver:</b> ${tx["Receiver Name"]}<br>
<b>Bank:</b> ${tx["Bank"]}<br>
<b>Amount:</b> ${tx["Amount"]} ${tx["Currency"]}<br>
<b>Status:</b> ${tx["Status"]}<br>
`;

/* PROGRESS */

document.getElementById("progressCard").style.display = "block";

const steps = [
["Created","Transfer Created"],
["Verified","Verification Completed"],
["Processing","Processing"],
["Sent to Bank","Sent to Bank"],
["Completed","Completed"]
];

let html = "";

steps.forEach(s => {

const done = tx[s[0]] === "YES";

html += `
<div class="step ${done ? "done" : ""}">
<div class="dot"></div>
<div>${s[1]}</div>
</div>
`;

});

document.getElementById("progress").innerHTML = html;

/* MESSAGE */

document.getElementById("messageCard").style.display = "block";

if (tx["Completed"] === "YES") {
document.getElementById("bankMessage").innerHTML =
"Transfer completed successfully. Funds have been credited.";
} else {
document.getElementById("bankMessage").innerHTML =
"Please allow up to 24 hours for processing.";
}

} catch (e) {
console.log(e);
alert("Server Error / CORS Issue");
document.getElementById("loading").style.display = "none";
}

  }
