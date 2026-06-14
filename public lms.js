/* ==========================================================================
   VAVUNIYA UNIVERSITY LMS - API INTEGRATION CLIENT SCRIPT
   ========================================================================== */

const API_BASE = '/api';

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. SEAMLESS AUTHENTICATION INTEGRATION ---
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const usernameInput = document.getElementById("username").value;
            const passwordInput = document.getElementById("password").value;

            try {
                const response = await fetch(`${API_BASE}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: usernameInput, password: passwordInput })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Authentication credentials rejected.');
                }

                // Preserve session token & user context properties locally
                localStorage.setItem('lms_token', data.token);
                localStorage.setItem('user_role', data.user.role);
                localStorage.setItem('user_name', data.user.full_name);

                // Role-Based Router Gateway Matrix
                if (data.user.role === 'student') {
                    window.location.href = "student-dashboard.html";
                } else if (data.user.role === 'faculty') {
                    window.location.href = "faculty-dashboard.html";
                } else if (data.user.role === 'admin') {
                    window.location.href = "admin-dashboard.html";
                }
            } catch (error) {
                alert(`Login Failed: ${error.message}`);
            }
        });
    }

    // Initialize course loading if on the student dashboard page
    if (window.location.pathname.includes('student-dashboard.html')) {
        loadStudentCourses();
    }
});

// --- Helper function to append Authorization headers securely ---
function getAuthHeaders() {
    const token = localStorage.getItem('lms_token');
    return {
        'Authorization': `Bearer ${token}`
    };
}

// --- 2. DYNAMIC COURSE POPULATION INTEGRATION ---
async function loadStudentCourses() {
    try {
        const response = await fetch(`${API_BASE}/courses`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        const gridContainer = document.querySelector('.card-grid');
        if (!gridContainer) return;

        // Clear layout container placeholders and render real SQL data rows
        gridContainer.innerHTML = '';
        data.courses.forEach(course => {
            gridContainer.innerHTML += `
                <div class="card">
                    <h3>${course.course_name}</h3>
                    <p>Code: ${course.course_code}</p>
                    <p>Instructor: ${course.instructor_name || 'TBD'}</p>
                    <button class="btn-primary" style="margin-top: 16px; width: 100%;" 
                            onclick="location.href='student-course.html?id=${course.course_id}'">
                        Enter Course
                    </button>
                </div>
            `;
        });
    } catch (error) {
        console.error('Failed to populate courses:', error.message);
    }
}

// --- 3. MULTIPART FILE SUBMISSION INTEGRATION ---
async function handleFileUpload() {
    const fileInput = document.getElementById("assignmentFileInput");
    
    // Read the active dynamic course context from query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const assignmentId = 1; // Fallback context tracking value or extract from DOM/URL

    if (!fileInput || fileInput.files.length === 0) {
        return alert("Action Required: Select a valid document format prior to submission execution.");
    }

    // Initialize HTML5 FormData boundary array for file streams 
    const formData = new FormData();
    formData.append('assignment_id', assignmentId);
    formData.append('submission_file', fileInput.files[0]);

    try {
        const response = await fetch(`${API_BASE}/submissions`, {
            method: 'POST',
            headers: getAuthHeaders(), // Keep standard JSON headers clear; let browser append Multipart flags
            body: formData
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        alert("Database Transaction Completed: File registered safely to database staging areas.");
        fileInput.value = "";
    } catch (error) {
        alert(`Submission Processing Error: ${error.message}`);
    }
}