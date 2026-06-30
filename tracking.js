// 🔗 Google Apps Script URL
const API_URL = "https://script.google.com/macros/s/AKfycbwkLr7teLgbW949u01SidoZAqFBPZo9BxbEroNfGos6r4Hs0D-NZF2XXu54UlTk4wWD/exec";

async function trackTransaction() {

const txid = document.getElementById("txid").value.trim();

if (!txid) {
alert("Enter Transaction ID");
return;
}

document.getElementById("loading").style.display = "block";
document.getElementById("result").style.display = "none";
document.getElementById("progressCard").style.display = "none";
document.getElementById("messageCard").style.display = "none";

try {

const res = await fetch(API_URL);
const data = await res.json();

const tx = data.find(t => t["Transaction ID"] === txid);

document.getElementById("loading").style.display = "none";

if (!tx) {
document.getElementById("result").style.display = "block";
document.getElementById("details").innerHTML = `
❌ Transaction Not Found
`;
return;
}

/* =======================
   SHOW DETAILS
======================= */

document.getElementById("result").style.display = "block";

document.getElementById("details").innerHTML = `

<b>Transaction ID:</b> ${tx["Transaction ID"]}<br>
<b>Receiver:</b> ${tx["Receiver Name"]}<br>
<b>Bank:</b> ${tx["Bank"]}<br>
<b>Amount:</b> ${tx["Amount"]} ${tx["Currency"]}<br>
<b>Status:</b> ${tx["Status"]}<br>
`;

/* =======================
   PROGRESS STEPS
======================= */

document.getElementById("progressCard").style.display = "block";

const steps = [
{ key: "Created", label: "Transfer Created" },
{ key: "Verified", label: "Verification Completed" },
{ key: "Processing", label: "Processing" },
{ key: "Sent to Bank", label: "Sent to Receiving Bank" },
{ key: "Completed", label: "Completed" }
];

let html = "";

steps.forEach(s => {

const done = tx[s.key] === "YES";

html += `
<div class="step ${done ? "done" : ""}">
<div class="dot"></div>
<div>${s.label}</div>
</div>
`;

});

document.getElementById("progress").innerHTML = html;

/* =======================
   BANK MESSAGE
======================= */

document.getElementById("messageCard").style.display = "block";

if (tx["Completed"] === "YES") {

document.getElementById("bankMessage").innerHTML =
"This transfer has been completed successfully. Funds have been credited to the recipient's account.";

} else {

document.getElementById("bankMessage").innerHTML =
"Please allow up to 24 hours for the transfer to be completed. Processing time may vary depending on the receiving bank.";

}

} catch (error) {

document.getElementById("loading").style.display = "none";
alert("Error fetching data from server");

console.log(error);

}

}
