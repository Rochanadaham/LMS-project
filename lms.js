/* ==========================================================================
   VAVUNIYA UNIVERSITY LMS - CORE JAVASCRIPT ARCHITECTURE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const portalType = document.getElementById("portalType").value;
            
            // Core Authentication Mock Routing Matrix
            if (portalType === "student") {
                window.location.href = "student-dashboard.html";
            } else if (portalType === "faculty") {
                window.location.href = "faculty-dashboard.html";
            } else if (portalType === "admin") {
                window.location.href = "admin-dashboard.html";
            }
        });
    }

    const assignmentForm = document.getElementById("assignmentForm");
    if (assignmentForm) {
        assignmentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Success: Assignment parameters structural design has been deployed successfully to active rosters.");
            assignmentForm.reset();
        });
    }
});

/* --- Navigation Tab Switch Mechanism --- */
function switchTab(event, panelId) {
    const panels = document.querySelectorAll(".tab-content-panel");
    panels.forEach(panel => panel.style.display = "none");

    const tabLinks = document.querySelectorAll(".tab-link");
    tabLinks.forEach(link => link.classList.remove("active"));

    document.getElementById(panelId).style.display = "block";
    event.currentTarget.classList.add("active");
}

/* --- Student File Submission Processing Mock --- */
function handleFileUpload() {
    const fileInput = document.getElementById("assignmentFileInput");
    if (fileInput && fileInput.files.length > 0) {
        alert(`File uploaded: "${fileInput.files[0].name}" has been registered safely to database staging areas.`);
        fileInput.value = "";
    } else {
        alert("Action Required: Select a valid document structure format file prior to submission execution.");
    }
}

/* --- Grade Evaluation Mock Data Mutation --- */
function saveGradeMock() {
    alert("Database Transaction Completed: Student score evaluation parameters successfully saved.");
}