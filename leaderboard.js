const express = require('express');
const router = express.Router();
const { dbOps } = require('../config/database');

// Get leaderboard data
router.get('/', async (req, res) => {
    try {
        // Get top innovators
        const topInnovators = await dbOps.all(`
            SELECT 
                u.username as name,
                COUNT(i.id) as innovations
            FROM users u
            LEFT JOIN innovations i ON u.id = i.user_id
            GROUP BY u.id
            ORDER BY innovations DESC
            LIMIT 5
        `);

        // Get recent achievements (completed innovations)
        const recentAchievements = await dbOps.all(`
            SELECT 
                i.title,
                i.description,
                u.username as user,
                i.updated_at as date
            FROM innovations i
            JOIN users u ON i.user_id = u.id
            WHERE i.status = 'completed'
            ORDER BY i.updated_at DESC
            LIMIT 5
        `);

        // Get statistics
        const stats = {
            total: 0,
            completed: 0,
            activeInnovators: 0
        };

        const totalCount = await dbOps.get('SELECT COUNT(*) as count FROM innovations');
        stats.total = totalCount.count;

        const completedCount = await dbOps.get("SELECT COUNT(*) as count FROM innovations WHERE status = 'completed'");
        stats.completed = completedCount.count;

        const activeInnovatorsCount = await dbOps.get(`
            SELECT COUNT(DISTINCT user_id) as count 
            FROM innovations 
            WHERE updated_at >= datetime('now', '-30 days')
        `);
        stats.activeInnovators = activeInnovatorsCount.count;

        // Get innovation trends (last 6 months)
        const trends = {
            labels: [],
            values: []
        };

        const trendData = await dbOps.all(`
            SELECT 
                strftime('%Y-%m', created_at) as month,
                COUNT(*) as count
            FROM innovations
            WHERE created_at >= datetime('now', '-6 months')
            GROUP BY month
            ORDER BY month ASC
        `);

        trendData.forEach(item => {
            trends.labels.push(item.month);
            trends.values.push(item.count);
        });

        // Get monthly highlights
        const monthlyHighlights = await dbOps.all(`
            SELECT 
                i.title,
                i.description,
                u.username as team
            FROM innovations i
            JOIN users u ON i.user_id = u.id
            WHERE i.created_at >= datetime('now', '-30 days')
            AND i.status != 'draft'
            ORDER BY i.created_at DESC
            LIMIT 3
        `);

        res.json({
            topInnovators,
            recentAchievements,
            stats,
            trends,
            monthlyHighlights
        });

    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard data' });
    }
});

module.exports = router;
