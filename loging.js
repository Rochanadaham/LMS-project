<!-- Replace the script block at the bottom of your code verbatim with this clean version -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const loginForm = document.querySelector('.login-form');
            const portalSelect = document.getElementById('portal-type');
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');

            if (loginForm) {
                loginForm.addEventListener('submit', (e) => {
                    e.preventDefault(); // Stop the page from reloading normally

                    const selectedPortal = portalSelect.value;
                    const enteredUser = usernameInput.value.trim();
                    const enteredPass = passwordInput.value;

                    // 1. STUDENT PORTAL LOGIN VALIDATION
                    if (selectedPortal === 'student') {
                        if (enteredUser === 'student123' && enteredPass === 'student@2026') {
                            // Success vibration pattern: single short pulse
                            if (window.navigator.vibrate) window.navigator.vibrate(100);
                            
                            alert('Access Granted: Redirecting to Student Dashboard...');
                            window.location.href = "C:\\Users\\rocha\\Downloads\\VAU\\LMS\\API\\Public\\stu dashboard 10.html";
                        } else {
                            // Error vibration pattern: double short alert buzzes
                            if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
                            
                            alert('Invalid Student Credentials!\nUse ID: student123\nPassword: student@2026');
                        }
                    }

                    // 2. FACULTY PORTAL LOGIN VALIDATION
                    else if (selectedPortal === 'faculty') {
                        if (enteredUser === 'faculty123' && enteredPass === 'faculty@2026') {
                            // Success vibration
                            if (window.navigator.vibrate) window.navigator.vibrate(100);
                            
                            alert('Access Granted: Redirecting to Faculty Dashboard...');
                            window.location.href = "C:\\Users\\rocha\\Downloads\\VAU\\LMS\\faculty-dashboard.html";
                        } else {
                            // Error vibration
                            if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
                            
                            alert('Invalid Faculty Credentials!\nUse ID: faculty123\nPassword: faculty@2026');
                        }
                    }

                    // 3. ADMINISTRATOR PORTAL LOGIN VALIDATION
                    else if (selectedPortal === 'admin') {
                        if (enteredUser === 'admin123' && enteredPass === 'admin@2026') {
                            // Success vibration
                            if (window.navigator.vibrate) window.navigator.vibrate(100);
                            
                            alert('Access Granted: Redirecting to Admin Console...');
                            window.location.href = "C:\\Users\\rocha\\Downloads\\VAU\\LMS\\admin-dashboard.html";
                        } else {
                            // Error vibration
                            if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
                            
                            alert('Invalid Administrator Credentials!\nUse ID: admin123\nPassword: admin@2026');
                        }
                    }
                });
            }
        });
    </script>