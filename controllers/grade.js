const db = require('../db');
const { GradeValidator } = require('../models/User');

exports.addGrade = (req, res) => {
    const { name } = req.body;

    const { isValid, errors } = GradeValidator({ name });
    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }

    const query = 'INSERT INTO grade (name) VALUES (?)';
    db.query(query, [name], (err, result) => {
        if (err) {
            res.status(400).json({ message: "Failed to add grade"});
            console.log(err)
        }else{
            res.status(200).json({ message: "grade added successfully"});
            console.log(result)
        }
    })
}

exports.getAllGrade = (req, res) => {
    const query = 'SELECT * FROM grade';
    db.query(query, (err, result) => {
        if (err) {
            res.status(400).json({ message: "Failed to load grade"});
        } else {
            res.status(200).json(result)
        }
    })
}


exports.deleteGrade = (req, res) => {
    const id = req.query.id;
    const query = 'DELETE FROM grade WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(400).json({message: "Failed to delete grade"});
        }else{
            res.status(200).json({message: "grade deleted successfully"});
        }
    })
}