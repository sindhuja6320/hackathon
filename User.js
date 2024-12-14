const bcrypt = require('bcryptjs');
const { dbOps } = require('../config/database');

class User {
    static async create({ username, email, password, role = 'user' }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await dbOps.run(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role]
        );
        return { id: result.lastID, username, email, role };
    }

    static async findByEmail(email) {
        return await dbOps.get('SELECT * FROM users WHERE email = ?', [email]);
    }

    static async findById(id) {
        return await dbOps.get('SELECT * FROM users WHERE id = ?', [id]);
    }

    static async verifyPassword(user, password) {
        return await bcrypt.compare(password, user.password);
    }

    static async updateProfile(id, updates) {
        const allowedUpdates = ['username', 'email'];
        const updateFields = [];
        const updateValues = [];

        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updateFields.push(`${key} = ?`);
                updateValues.push(updates[key]);
            }
        });

        if (updateFields.length === 0) return null;

        updateValues.push(id);
        const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
        await dbOps.run(query, updateValues);
        return await this.findById(id);
    }

    static async list() {
        return await dbOps.all('SELECT id, username, email, role, created_at FROM users');
    }
}

module.exports = User;
