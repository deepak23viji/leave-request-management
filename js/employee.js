// =========================================
// Employee Dashboard
// =========================================

// Check Login
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "index.html";
}

// Display Employee Details
document.getElementById("employeeName").textContent = currentUser.name;
document.getElementById("employeeEmail").textContent = currentUser.email;

// Load Existing Requests
loadLeaveRequests();

loadLeaveBalance();

// Submit Leave Form
const leaveForm = document.getElementById("leaveForm");

leaveForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const leaveType = document.getElementById("leaveType").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const reason = document.getElementById("reason").value.trim();
// Calculate requested leave days
const requestedDays = calculateDays(startDate, endDate);

// Get current leave balance
let availableBalance = 0;

switch (leaveType) {

    case "Annual":
        availableBalance = parseInt(document.getElementById("annualBalance").innerText);
        break;

    case "Medical":
        availableBalance = parseInt(document.getElementById("medicalBalance").innerText);
        break;

    case "Casual":
        availableBalance = parseInt(document.getElementById("casualBalance").innerText);
        break;

    case "Emergency":
        availableBalance = parseInt(document.getElementById("emergencyBalance").innerText);
        break;

}
if (requestedDays > availableBalance) {

    alert("You do not have enough leave balance.");

    return;

}

    if (reason === "") {

        alert("Please enter a reason.");

        return;

    }

    const requests = getLeaveRequests();

    const request = {

        id: Date.now(),

        employeeId: currentUser.id,

        employeeName: currentUser.name,

        employeeEmail: currentUser.email,

        leaveType: leaveType,

        startDate: startDate,

        endDate: endDate,

        reason: reason,

        status: "Pending"

    };

    requests.push(request);

    saveLeaveRequests(requests);

    alert("Leave Request Submitted Successfully.");

    leaveForm.reset();

    loadLeaveRequests();

    loadLeaveBalance();

});

// Load Requests
function loadLeaveRequests() {

    const table = document.getElementById("leaveTable");

    table.innerHTML = "";

    const requests = getLeaveRequests();

    const myRequests = requests.filter(r => r.employeeId === currentUser.id);

    document.getElementById("totalRequests").innerText = myRequests.length;

    const pending = myRequests.filter(r => r.status === "Pending");

    document.getElementById("pendingRequests").innerText = pending.length;

    myRequests.forEach(function (request) {
table.innerHTML += `
<tr>
    <td>${request.id}</td>
    <td>${request.leaveType}</td>
    <td>${request.startDate}</td>
    <td>${request.endDate}</td>

    <td>${calculateDays(request.startDate, request.endDate)}</td>
    <td>
        <span class="badge ${
            request.status === "Approved"
                ? "bg-success"
                : request.status === "Rejected"
                ? "bg-danger"
                : "bg-warning text-dark"
        }">
            ${request.status}
        </span>
    </td>
    <td>
        ${
            request.status === "Pending"
                ? `<button class="btn btn-danger btn-sm" onclick="cancelLeave(${request.id})">Cancel</button>`
                : "-"
        }
    </td>
</tr>
`;


    });

}
 // =========================================
// Get Status Badge Class
// =========================================

function getStatusBadge(status) {

    switch (status) {

        case "Approved":
            return "bg-success";

        case "Rejected":
            return "bg-danger";

        default:
            return "bg-warning text-dark";

    }

}

// =========================================
// Cancel Leave Request
// =========================================

function cancelLeave(id) {

    if (!confirm("Are you sure you want to cancel this leave request?")) {

        return;

    }

    let requests = getLeaveRequests();

    requests = requests.filter(function (request) {

        return request.id !== id;

    });

    saveLeaveRequests(requests);

    alert("Leave Request Cancelled.");

    loadLeaveRequests();

    loadLeaveBalance();

}

// =========================================
// Refresh Dashboard Statistics
// =========================================

function refreshStatistics() {

    const requests = getLeaveRequests();

    const myRequests = requests.filter(request => request.employeeId === currentUser.id);

    document.getElementById("totalRequests").innerText = myRequests.length;

    document.getElementById("pendingRequests").innerText =
        myRequests.filter(request => request.status === "Pending").length;

} 

// =========================================
// Calculate Leave Days
// =========================================

function calculateDays(startDate, endDate) {

    const start = new Date(startDate);

    const end = new Date(endDate);

    const difference = end.getTime() - start.getTime();

    return Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;

}
// =========================================
// Leave Balance
// =========================================

loadLeaveBalance();

function loadLeaveBalance() {

    const requests = getLeaveRequests();

    const approved = requests.filter(function (request) {

        return request.employeeId === currentUser.id &&
               request.status === "Approved";

    });

    let annual = 20;
    let medical = 10;
    let casual = 7;
    let emergency = 5;

    approved.forEach(function(request){

        const days = calculateDays(
            request.startDate,
            request.endDate
        );

        switch(request.leaveType){

            case "Annual":
                annual -= days;
                break;

            case "Medical":
                medical -= days;
                break;

            case "Casual":
                casual -= days;
                break;

            case "Emergency":
                emergency -= days;
                break;

        }

    });

    document.getElementById("annualBalance").innerText = annual;

    document.getElementById("medicalBalance").innerText = medical;

    document.getElementById("casualBalance").innerText = casual;

    document.getElementById("emergencyBalance").innerText = emergency;

}
