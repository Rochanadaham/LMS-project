const db = require('./db');
const bcrypt = require('bcrypt');

async function seedUsers() {
    try {
        // Generate secure crypt hashes for your testing environment
        const studentPassword = await bcrypt.hash('student123', 10);
        const facultyPassword = await bcrypt.hash('faculty123', 10);
        const adminPassword = await bcrypt.hash('admin123', 10);

        // Clean out prior matching test IDs if they exist
        await db.execute("DELETE FROM users WHERE user_id IN ('ST-9921', 'FA-3310', 'ADM-001')");

        // Insert fresh mock users matching the architecture profiles
        await db.execute(
            "INSERT INTO users (user_id, full_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
            ['ST-9921', 'Kasun Perera', 'kasun@vau.ac.lk', studentPassword, 'student']
        );
        await db.execute(
            "INSERT INTO users (user_id, full_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
            ['FA-3310', 'Dr. T. Silva', 'tsilva@vau.ac.lk', facultyPassword, 'faculty']
        );
        await db.execute(
            "INSERT INTO users (user_id, full_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
            ['ADM-001', 'System Administrator', 'admin@vau.ac.lk', adminPassword, 'admin']
        );

        console.log("🚀 [SEED SUCCESS]: Test users inserted into MySQL successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seed error:", error.message);
        process.exit(1);
    }
}

seedUsers();