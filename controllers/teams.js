const db = require('../db');
const { TeamValidator } = require('../models/User');

exports.addTeam = (req, res) => {
    const image = req.file.path;
    const { name, role } = req.body;

    const { isValid, errors } = TeamValidator({ name, role, image });
    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }

    const query = 'INSERT INTO team (name, role, image) VALUES (?, ?, ?)';
    db.query(query, [name, role, image], (err, result) => {
        if (err) {
            console.error('Error adding team member:', err);
            return res.status(500).json('Failed to add team member');
        }
        res.status(200).json('Team member added successfully!');
    });
};


exports.allTeam = (req, res) => {
    const query = 'SELECT * FROM team';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching team members:', err);
            return res.status(500).json({message:'Failed to fetch team members'});
        }
        res.status(200).json(results);
    });
};

exports.deleteTeam = (req, res) => {
    const  id  = req.query.id;
    const query = 'DELETE FROM team WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(400).json({message: 'Failed to delete team member'});
        }else{
            res.status(200).json({message: 'Team member deleted successfully'})
        }
    })
}
