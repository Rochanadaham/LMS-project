const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const controllers = require('./controllers');
const { authenticateToken, authorizeRoles } = require('./authMiddleware');

// --- File Storage Staging Infrastructure Configuration ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Saves locally inside C:\Users\rocha\Downloads\VAU\LMS\API\uploads\submissions
        cb(null, path.join(__dirname, './uploads/submissions/'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${req.user.user_id}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// Enforce safe structural boundaries during multi-part file upload parsing 
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // Max 25 megabyte payload limitation
    fileFilter: (req, file, cb) => {
        const permittedExtensions = /pdf|docx|zip|mp4/;
        const matchExtension = permittedExtensions.test(path.extname(file.originalname).toLowerCase());
        if (matchExtension) {
            return cb(null, true);
        }
        cb(new Error('Extension Failure: The file format used is not accepted by safety filters.'));
    }
});

// ==========================================================================
// ROUTE REGISTRATION MATRIX
// ==========================================================================

// 1. Authentication Channel Route
router.post('/login', controllers.login);

// 2. Course Management Channel Routes
router.get('/courses', authenticateToken, controllers.getCourses);
router.post('/courses', authenticateToken, authorizeRoles(['admin']), controllers.createCourse);

// 3. Evaluation Rules Configuration Channel Routes
router.post('/assignments', authenticateToken, authorizeRoles(['faculty']), controllers.createAssignment);

// 4. Student Resource Document Submissions Channels
router.post('/submissions', authenticateToken, authorizeRoles(['student']), upload.single('submission_file'), controllers.submitAssignment);

// 5. Performance Metrics Assessment Interface Channels
router.put('/grades', authenticateToken, authorizeRoles(['faculty']), controllers.upsertGrade);

module.exports = router;