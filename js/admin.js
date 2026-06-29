// =========================================
// Admin Dashboard
// =========================================

// Check Admin Login
const currentAdmin = JSON.parse(localStorage.getItem("currentAdmin"));

if (!currentAdmin) {
    window.location.href = "admin.html";
}

// Load Dashboard
loadDashboard();

function loadDashboard() {
    loadStatistics();
    loadLeaveRequests();
}

// =========================================
// Statistics
// =========================================

function loadStatistics() {

    const users = getUsers();
    const requests = getLeaveRequests();

    const employees = users.filter(user => user.role === "employee");

    document.getElementById("employeeCount").innerText = employees.length;
    document.getElementById("requestCount").innerText = requests.length;
    document.getElementById("pendingCount").innerText =
        requests.filter(r => r.status === "Pending").length;
    document.getElementById("approvedCount").innerText =
        requests.filter(r => r.status === "Approved").length;
    
    const rejected = requests.filter(r => r.status === "Rejected").length;

document.getElementById("rejectedCount").innerText = rejected;

const approved = requests.filter(r => r.status === "Approved").length;

const approvalRate =
    requests.length === 0
        ? 0
        : Math.round((approved / requests.length) * 100);

document.getElementById("approvalRate").innerText =
    approvalRate + "%";
}

// =========================================
// Status Badge
// =========================================

function getBadge(status) {

    if (status === "Approved")
        return "bg-success";

    if (status === "Rejected")
        return "bg-danger";

    return "bg-warning text-dark";

}

// =========================================
// Load Leave Requests
// =========================================

function loadLeaveRequests() {

    const table = document.getElementById("adminLeaveTable");

    table.innerHTML = "";

   let requests = getLeaveRequests();

const keyword = document
.getElementById("searchEmployee")
.value
.toLowerCase();

const status = document
.getElementById("statusFilter")
.value;

if (keyword !== "") {

    requests = requests.filter(function(request){

        return request.employeeName
        .toLowerCase()
        .includes(keyword);

    });

}

if (status !== "All") {

    requests = requests.filter(function(request){

        return request.status === status;

    });

}

    if (requests.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="7" class="text-center">
                No Leave Requests Found
            </td>
        </tr>
        `;

        return;

    }

    requests.forEach(function(request){

        table.innerHTML += `
        <tr>

            <td>${request.id}</td>

            <td>${request.employeeName}</td>

            <td>${request.leaveType}</td>

            <td>${request.startDate}</td>

            <td>${request.endDate}</td>

            <td>${calculateDays(request.startDate, request.endDate)}</td>

            <td>

            <span class="badge ${getBadge(request.status)}">

            ${request.status}

            </span>

            </td>

            <td>

             <button
class="btn btn-success btn-sm me-1"
onclick="approveLeave(${request.id})">

Approve

</button>

<button
class="btn btn-warning btn-sm me-1"
onclick="rejectLeave(${request.id})">

Reject

</button>

<button
class="btn btn-danger btn-sm"
onclick="deleteLeave(${request.id})">

Delete

</button>
                
            </td>

        </tr>
        `;

    });

}

// =========================================
// Approve Leave
// =========================================

function approveLeave(id) {

    let requests = getLeaveRequests();

    requests = requests.map(function (request) {

        if (request.id === id) {
            request.status = "Approved";
        }

        return request;

    });

    saveLeaveRequests(requests);

    loadDashboard();

}

// =========================================
// Reject Leave
// =========================================

function rejectLeave(id) {

    let requests = getLeaveRequests();

    requests = requests.map(function (request) {

        if (request.id === id) {
            request.status = "Rejected";
        }

        return request;

    });

    saveLeaveRequests(requests);

    loadLeaveRequests();

document
.getElementById("searchEmployee")
.onkeyup = loadLeaveRequests;

document
.getElementById("statusFilter")
.onchange = loadLeaveRequests;

}

// =========================================
// Delete Leave Request
// =========================================

function deleteLeave(id) {

    if (!confirm("Are you sure you want to delete this leave request?")) {
        return;
    }

    let requests = getLeaveRequests();

    requests = requests.filter(function (request) {

        return request.id !== id;

    });

    saveLeaveRequests(requests);

    loadDashboard();

}

// =========================================
// Calculate Leave Days
// =========================================

function calculateDays(startDate, endDate) {

    const start = new Date(startDate);

    const end = new Date(endDate);

    const difference = end.getTime() - start.getTime();

    const days = Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;

    return days;

}
