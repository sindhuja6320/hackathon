const { dbOps } = require('../config/database');

class Innovation {
    static async create({ title, description, department, category, userId }) {
        const result = await dbOps.run(
            'INSERT INTO innovations (title, description, department, category, user_id) VALUES (?, ?, ?, ?, ?)',
            [title, description, department, category, userId]
        );
        return { id: result.lastID, title, description, department, category, user_id: userId };
    }

    static async findById(id) {
        const innovation = await dbOps.get('SELECT * FROM innovations WHERE id = ?', [id]);
        if (innovation) {
            innovation.milestones = await dbOps.all(
                'SELECT * FROM milestones WHERE innovation_id = ?',
                [id]
            );
        }
        return innovation;
    }

    static async list(filters = {}) {
        let query = 'SELECT i.*, u.username as creator_name FROM innovations i LEFT JOIN users u ON i.user_id = u.id';
        const params = [];

        if (filters.userId) {
            query += ' WHERE i.user_id = ?';
            params.push(filters.userId);
        }

        query += ' ORDER BY i.created_at DESC';
        return await dbOps.all(query, params);
    }

    static async update(id, updates) {
        const allowedUpdates = ['title', 'description', 'department', 'category', 'status'];
        const updateFields = [];
        const updateValues = [];

        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updateFields.push(`${key} = ?`);
                updateValues.push(updates[key]);
            }
        });

        if (updateFields.length === 0) return null;

        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(id);
        
        const query = `UPDATE innovations SET ${updateFields.join(', ')} WHERE id = ?`;
        await dbOps.run(query, updateValues);
        return await this.findById(id);
    }

    static async delete(id) {
        // Delete associated milestones first
        await dbOps.run('DELETE FROM milestones WHERE innovation_id = ?', [id]);
        // Then delete the innovation
        return await dbOps.run('DELETE FROM innovations WHERE id = ?', [id]);
    }

    static async addMilestone(innovationId, { title, description, targetDate }) {
        const result = await dbOps.run(
            'INSERT INTO milestones (innovation_id, title, description, target_date) VALUES (?, ?, ?, ?)',
            [innovationId, title, description, targetDate]
        );
        return { id: result.lastID, innovation_id: innovationId, title, description, target_date: targetDate };
    }

    static async updateMilestone(id, updates) {
        const allowedUpdates = ['title', 'description', 'status', 'target_date', 'completed_date'];
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
        const query = `UPDATE milestones SET ${updateFields.join(', ')} WHERE id = ?`;
        await dbOps.run(query, updateValues);
        return await dbOps.get('SELECT * FROM milestones WHERE id = ?', [id]);
    }

    static async deleteMilestone(id) {
        return await dbOps.run('DELETE FROM milestones WHERE id = ?', [id]);
    }

    static async getStats() {
        const stats = {
            total: 0,
            byStatus: {},
            recentActivity: []
        };

        // Get total count and status breakdown
        const statusCounts = await dbOps.all(
            'SELECT status, COUNT(*) as count FROM innovations GROUP BY status'
        );
        statusCounts.forEach(({ status, count }) => {
            stats.total += count;
            stats.byStatus[status] = count;
        });

        // Get recent activity
        stats.recentActivity = await dbOps.all(
            `SELECT i.*, u.username as creator_name 
             FROM innovations i 
             LEFT JOIN users u ON i.user_id = u.id 
             ORDER BY i.updated_at DESC LIMIT 5`
        );

        return stats;
    }
}

module.exports = Innovation;
