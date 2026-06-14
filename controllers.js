const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./db');
const { JWT_SECRET } = require('./authMiddleware');

// ==========================================================================
// 1. AUTHENTICATION CONTROLLER
// ==========================================================================
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Structured Input Verification Bounds
        if (!username || !password) {
            return res.status(400).json({ error: 'Validation Failure: Missing username or password parameters.' });
        }

        // Query targeted user identity using parameterized constraints
        const [users] = await db.execute('SELECT user_id, full_name, email, password_hash, role FROM users WHERE user_id = ?', [username]);
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Authentication Failure: Provided identification parameters do not match.' });
        }

        const user = users[0];

        // Evaluate user secret hash matching requirements securely
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Authentication Failure: Provided identification parameters do not match.' });
        }

        // Token generation process incorporating security role contexts
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.status(200).json({
            message: 'Authentication validated successfully.',
            token: token,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Exception: Error handling your login flow.', details: error.message });
    }
};

// ==========================================================================
// 2. COURSE MANAGEMENT CONTROLLER
// ==========================================================================
exports.getCourses = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        let query = '';
        let params = [];

        // Dynamic Query Separation Determined By Token Metadata Layer Role 
        if (role === 'student') {
            // Evaluates exact course student assignment matrices matching active roles
            query = `
                SELECT c.course_id, c.course_name, c.course_code, u.full_name AS instructor_name
                FROM courses c
                INNER JOIN assignments a ON c.course_id = a.course_id
                INNER JOIN submissions s ON a.assignment_id = s.assignment_id
                LEFT JOIN users u ON c.faculty_instructor_id = u.user_id
                WHERE s.student_id = ?
                GROUP BY c.course_id
            `;
            params = [user_id];
        } else if (role === 'faculty') {
            // Isolates exact courses administered directly by checking current identity values [cite: 32]
            query = `
                SELECT course_id, course_name, course_code 
                FROM courses 
                WHERE faculty_instructor_id = ?
            `;
            params = [user_id];
        } else if (role === 'admin') {
            // Administrative roles retain full context access tracking over whole schemas
            query = 'SELECT course_id, course_name, course_code, faculty_instructor_id FROM courses';
        }

        const [courses] = await db.execute(query, params);
        return res.status(200).json({ courses });
    } catch (error) {
        return res.status(500).json({ error: 'Database Retrieval Error: Failed processing current course arrays.', details: error.message });
    }
};

exports.createCourse = async (req, res) => {
    try {
        const { course_id, course_name, course_code, instructor_id } = req.body;

        if (!course_id || !course_name || !course_code) {
            return res.status(400).json({ error: 'Validation Failure: course_id, course_name, and course_code parameters are necessary.' });
        }

        // Validate target faculty entity initialization mapping structures inside records
        if (instructor_id) {
            const [instructorCheck] = await db.execute('SELECT user_id FROM users WHERE user_id = ? AND role = "faculty"', [instructor_id]);
            if (instructorCheck.length === 0) {
                return res.status(400).json({ error: 'Conflict Failure: The defined instructor identity path does not belong to active faculty accounts.' });
            }
        }

        await db.execute(
            'INSERT INTO courses (course_id, course_name, course_code, faculty_instructor_id) VALUES (?, ?, ?, ?)',
            [course_id, course_name, course_code, instructor_id || null]
        );

        return res.status(201).json({
            message: 'Course unit initialization execution context generated cleanly.',
            course: { course_id, course_name, course_code, faculty_instructor_id: instructor_id || null }
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Resource Mapping Exception: A course entry mapping properties using these identities already exists.' });
        }
        return res.status(500).json({ error: 'Execution Context Error: Core course generation failed.', details: error.message });
    }
};

// ==========================================================================
// 3. EVALUATIONS & ASSIGNMENTS CONTROLLER
// ==========================================================================
exports.createAssignment = async (req, res) => {
    try {
        const { course_id, title, points_possible, due_date } = req.body;

        if (!course_id || !title || !points_possible || !due_date) {
            return res.status(400).json({ error: 'Validation Failure: Missing dynamic assignment verification mapping parameters.' });
        }

        // Ensure current authenticated faculty member manages the selected course
        const [courseCheck] = await db.execute('SELECT course_id FROM courses WHERE course_id = ? AND faculty_instructor_id = ?', [course_id, req.user.user_id]);
        if (courseCheck.length === 0) {
            return res.status(403).json({ error: 'Access Denied: You cannot create evaluations for courses you do not instruct.' });
        }

        const [result] = await db.execute(
            'INSERT INTO assignments (course_id, title, points_possible, due_date) VALUES (?, ?, ?, ?)',
            [course_id, title, points_possible, due_date]
        );

        return res.status(201).json({
            message: 'Evaluation architecture constraints saved safely.',
            assignment: {
                assignment_id: result.insertId,
                course_id,
                title,
                points_possible,
                due_date
            }
        });
    } catch (error) {
        return res.status(500).json({ error: 'Execution Context Error: Core evaluation setup failed.', details: error.message });
    }
};

// ==========================================================================
// 4. SUBMISSIONS & FILE STORAGE CONTROLLER
// ==========================================================================
exports.submitAssignment = async (req, res) => {
    try {
        const { assignment_id } = req.body;
        const student_id = req.user.user_id;

        if (!assignment_id) {
            return res.status(400).json({ error: 'Validation Failure: An explicit structural evaluation assignment identity target is required.' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Validation Failure: File payload data body not detected.' });
        }

        // Verify assignment exists before continuing
        const [assignmentCheck] = await db.execute('SELECT assignment_id FROM assignments WHERE assignment_id = ?', [assignment_id]);
        if (assignmentCheck.length === 0) {
            return res.status(404).json({ error: 'Not Found Exception: The target assignment code path could not be located.' });
        }

        const filePathReference = `/uploads/submissions/${req.file.filename}`;

        const [result] = await db.execute(
            'INSERT INTO submissions (assignment_id, student_id, file_path_reference) VALUES (?, ?, ?)',
            [assignment_id, student_id, filePathReference]
        );

        return res.status(201).json({
            message: 'Resource tracking files logged cleanly and registered safely to the staging catalog.',
            submission: {
                submission_id: result.insertId,
                assignment_id: parseInt(assignment_id),
                student_id,
                file_path_reference: filePathReference
            }
        });
    } catch (error) {
        return res.status(500).json({ error: 'Processing Context Error: Document target validation process failure.', details: error.message });
    }
};

// ==========================================================================
// 5. GRADEBOOK ASSESSMENT CONTROLLER (UPSERT)
// ==========================================================================
exports.upsertGrade = async (req, res) => {
    try {
        const { submission_id, score_achieved } = req.body;
        const graded_by_faculty_id = req.user.user_id;

        if (submission_id === undefined || score_achieved === undefined) {
            return res.status(400).json({ error: 'Validation Failure: Missing targeted tracking variables inside body properties.' });
        }

        // Authorization Guard: Verify if the current faculty manages the assignment tied to this submission
        const [submissionMetadata] = await db.execute(`
            SELECT s.submission_id, a.points_possible, c.faculty_instructor_id 
            FROM submissions s
            INNER JOIN assignments a ON s.assignment_id = a.assignment_id
            INNER JOIN courses c ON a.course_id = c.course_id
            WHERE s.submission_id = ?`, 
            [submission_id]
        );

        if (submissionMetadata.length === 0) {
            return res.status(404).json({ error: 'Not Found Exception: Target submission context was not found.' });
        }

        if (submissionMetadata[0].faculty_instructor_id !== graded_by_faculty_id) {
            return res.status(403).json({ error: 'Access Denied: You cannot modify evaluation properties outside your course parameters.' });
        }

        if (score_achieved > submissionMetadata[0].points_possible || score_achieved < 0) {
            return res.status(400).json({ error: `Validation Failure: Provided score ranges outside allowed parameters (0 - ${submissionMetadata[0].points_possible}).` });
        }

        // Perform clean Upsert logic checking for existing grade targets
        const [existingGrade] = await db.execute('SELECT grade_id FROM grades WHERE submission_id = ?', [submission_id]);

        if (existingGrade.length > 0) {
            // Perform explicit update action operations [cite: 43]
            await db.execute(
                'UPDATE grades SET score_achieved = ?, graded_by_faculty_id = ?, date_graded = CURRENT_TIMESTAMP WHERE submission_id = ?',
                [score_achieved, graded_by_faculty_id, submission_id]
            );
        } else {
            // Perform explicit insertion storage setup commands
            await db.execute(
                'INSERT INTO grades (submission_id, graded_by_faculty_id, score_achieved) VALUES (?, ?, ?)',
                [submission_id, graded_by_faculty_id, score_achieved]
            );
        }

        return res.status(200).json({
            message: 'Database Transaction Completed: Performance metrics score parameter recorded successfully.'
        });
    } catch (error) {
        return res.status(500).json({ error: 'Database Modification Error: Processing metrics updates failed execution.', details: error.message });
    }
};