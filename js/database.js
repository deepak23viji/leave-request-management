// ================================
// Leave Request Management System
// Database
// ================================

initializeDatabase();

function initializeDatabase() {

    // Users

    if (!localStorage.getItem("users")) {

        let users = [

            {

                id: 1,

                name: "Administrator",

                email: "admin@company.com",

                password: "admin123",

                role: "admin"

            }

        ];

        localStorage.setItem("users", JSON.stringify(users));

    }

    // Leave Requests

    if (!localStorage.getItem("leaveRequests")) {

        localStorage.setItem(

            "leaveRequests",

            JSON.stringify([])

        );

    }

}

function getUsers() {

    return JSON.parse(

        localStorage.getItem("users")

    ) || [];

}

function saveUsers(users) {

    localStorage.setItem(

        "users",

        JSON.stringify(users)

    );

}

function getLeaveRequests() {

    return JSON.parse(

        localStorage.getItem("leaveRequests")

    ) || [];

}

function saveLeaveRequests(requests) {

    localStorage.setItem(

        "leaveRequests",

        JSON.stringify(requests)

    );

}
