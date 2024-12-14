const express = require('express');
const router = express.Router();
const { dbOps } = require('../config/database');
const auth = require('../middleware/auth');
const notificationService = require('../services/notificationService');
const achievementService = require('../services/achievementService');

// Get all nominations
router.get('/', auth, async (req, res) => {
    try {
        const nominations = await dbOps.all(`
            SELECT 
                n.*,
                nominee.username as nominee_name,
                nominator.username as nominator_name,
                (
                    SELECT COUNT(*) 
                    FROM nomination_votes 
                    WHERE nomination_id = n.id
                ) as votes,
                EXISTS (
                    SELECT 1 
                    FROM nomination_votes 
                    WHERE nomination_id = n.id AND voter_id = ?
                ) as has_voted,
                datetime('now') > n.expiry_date as is_expired
            FROM nominations n
            JOIN users nominee ON n.nominee_id = nominee.id
            JOIN users nominator ON n.nominator_id = nominator.id
            ORDER BY n.created_at DESC
        `, [req.user.id]);

        res.json(nominations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch nominations' });
    }
});

// Create a new nomination
router.post('/', auth, async (req, res) => {
    try {
        const { nominee_id, category, reason } = req.body;
        
        // Check if user is nominating themselves
        if (nominee_id === req.user.id) {
            return res.status(400).json({ error: 'You cannot nominate yourself' });
        }

        // Check if user has already nominated this person in this category recently
        const existingNomination = await dbOps.get(
            'SELECT id FROM nominations WHERE nominee_id = ? AND nominator_id = ? AND category = ? AND created_at > datetime("now", "-30 days")',
            [nominee_id, req.user.id, category]
        );

        if (existingNomination) {
            return res.status(400).json({ error: 'You have already nominated this person in this category recently' });
        }

        const result = await dbOps.run(
            'INSERT INTO nominations (nominee_id, nominator_id, category, reason) VALUES (?, ?, ?, ?)',
            [nominee_id, req.user.id, category, reason]
        );

        // Send notification
        await notificationService.sendNominationNotification(result.lastID);

        // Check achievements
        await achievementService.checkAchievements(nominee_id);

        const nomination = await dbOps.get(`
            SELECT 
                n.*,
                nominee.username as nominee_name,
                nominator.username as nominator_name
            FROM nominations n
            JOIN users nominee ON n.nominee_id = nominee.id
            JOIN users nominator ON n.nominator_id = nominator.id
            WHERE n.id = ?
        `, [result.lastID]);

        res.status(201).json(nomination);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create nomination' });
    }
});

// Vote for a nomination
router.post('/:id/vote', auth, async (req, res) => {
    try {
        const nominationId = req.params.id;
        
        // Check if nomination exists and is not expired
        const nomination = await dbOps.get(`
            SELECT * FROM nominations 
            WHERE id = ? AND datetime('now') <= expiry_date
        `, [nominationId]);

        if (!nomination) {
            return res.status(404).json({ error: 'Nomination not found or expired' });
        }

        // Check if user has already voted
        const existingVote = await dbOps.get(
            'SELECT id FROM nomination_votes WHERE nomination_id = ? AND voter_id = ?',
            [nominationId, req.user.id]
        );

        if (existingVote) {
            // Remove vote
            await dbOps.run(
                'DELETE FROM nomination_votes WHERE nomination_id = ? AND voter_id = ?',
                [nominationId, req.user.id]
            );
            
            res.json({ message: 'Vote removed', voted: false });
        } else {
            // Add vote
            await dbOps.run(
                'INSERT INTO nomination_votes (nomination_id, voter_id) VALUES (?, ?)',
                [nominationId, req.user.id]
            );

            // Check achievements after vote
            await achievementService.checkAchievements(nomination.nominee_id);
            
            res.json({ message: 'Vote added', voted: true });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to process vote' });
    }
});

// Get user achievements
router.get('/achievements/:userId', auth, async (req, res) => {
    try {
        const achievements = await achievementService.getUserAchievements(req.params.userId);
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch achievements' });
    }
});

// Update notification settings
router.put('/settings', auth, async (req, res) => {
    try {
        const { email_notifications } = req.body;

        await dbOps.run(`
            INSERT INTO notification_settings (user_id, email_notifications)
            VALUES (?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
            email_notifications = excluded.email_notifications
        `, [req.user.id, email_notifications]);

        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// Get nomination categories
router.get('/categories', auth, (req, res) => {
    const categories = [
        {
            id: 'innovation_champion',
            name: 'Innovation Champion',
            description: 'Recognizes individuals who consistently drive innovation'
        },
        {
            id: 'problem_solver',
            name: 'Outstanding Problem Solver',
            description: 'For those who excel at finding creative solutions'
        },
        {
            id: 'collaboration_star',
            name: 'Collaboration Star',
            description: 'Celebrates team players who foster collaboration'
        },
        {
            id: 'rising_innovator',
            name: 'Rising Innovator',
            description: 'For emerging talent showing great potential'
        },
        {
            id: 'impact_maker',
            name: 'Impact Maker',
            description: 'Recognizes those whose innovations made significant impact'
        }
    ];
    
    res.json(categories);
});

module.exports = router;
