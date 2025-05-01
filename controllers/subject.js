const db = require('../db');
const { SubjectValidator } = require('../models/User');

exports.addSubject = (req, res) => {
    const { name } = req.body;

    const { isValid, errors } = SubjectValidator({ name });
    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }

    const query = 'INSERT INTO subject (name) VALUES (?)';
    db.query(query, [name], (err, result) => {
        if (err) {
            console.log('Error inserting subject:', err);
            res.status(500).json({message:'Error inserting subject'});
        } else {
            console.log('subject added successfully');
            res.status(200).json({ message: 'subject added successfully' })
        }
    })
}

exports.deleteSubject = (req, res) => {
    const id = req.query.id;

    const query = 'DELETE FROM subject WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.log('Error deleting subject:', err);
            res.status(400).json({ message: 'Error deleting subject' })
        }
        console.log('Subject Deleted Successfully!')
        res.status(200).json({message: 'Subject Deleted Successfully!'})
    })
}

exports.allSubject = (req, res) => {
    const query = 'SELECT * FROM subject ORDER BY name ASC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching subjects:', err);
            res.status(500).json({message:'Error fetching subjects'});
        } else {
            res.status(200).json(results);
        }
    });
}