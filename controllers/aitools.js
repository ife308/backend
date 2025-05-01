const db = require('../db');
const { AiToolValidator, EditAiToolValidator } = require('../models/User');

exports.addAitools = (req, res) => {
    if (!req.file || !req.file.path) {
        console.error('File is undefined');
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const image = req.file.path;
    const { name, description, url } = req.body;

    const { isValid, errors } = AiToolValidator({ name, description, url, image });
    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }

    const query = 'INSERT INTO aitools (name, description, url, image) VALUES (?, ?, ?, ?)';
    db.query(query, [name, description, url, image], (err, result) => {
        if (err) {
            console.error('Error adding AiTool:', err);
            return res.status(500).json({ message: 'Failed to add AiTool' });
        }
        res.status(200).json({ message: 'Ai Tool added successfully!' });
    });
};


exports.dashboardTools = (req, res) => {
    const query = 'SELECT * FROM aitools ORDER BY id LIMIT 6';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching AI tools:', err);
            res.status(500).json({ message: 'Error fetching AI tools' });
        } else {
            res.status(200).json(results);
        }
    });
};


exports.allAitools = (req, res) => {
    const query = 'SELECT * FROM aitools ORDER BY id';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching AI tools:', err);
            res.status(500).json({ message: 'Error fetching AI tools' });
        } else {
            res.status(200).json(results);
        }
    });
};


exports.editAiTool = async (req, res) => {
    const id = req.query.id;
    const image = req.file ? req.file.path : null;
    const { name, description, url } = req.body;

    const { isValid, errors } = EditAiToolValidator({ name, description, url, image });
    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }

    if (name) {
        await new Promise((resolve, reject) => {
            const query = 'UPDATE aitools SET name = ? WHERE id = ?';
            db.query(query, [name, id], (err) => {
                if (err) {
                    console.error('Error updating name:', err);
                    return reject(new Error('Error updating name'));
                }
                resolve();
            });
        });
    }

    if (description) {
        await new Promise((resolve, reject) => {
            const query = 'UPDATE aitools SET description = ? WHERE id = ?';
            db.query(query, [description, id], (err) => {
                if (err) {
                    console.error('Error updating description:', err);
                    return reject(new Error('Error updating description'));
                }
                resolve();
            });
        });
    }

    if (url) {
        await new Promise((resolve, reject) => {
            const query = 'UPDATE aitools SET url = ? WHERE id = ?';
            db.query(query, [url, id], (err) => {
                if (err) {
                    console.error('Error updating url:', err);
                    return reject(new Error('Error updating url'));
                }
                resolve();
            });
        });
    }

    if (image) {
        await new Promise((resolve, reject) => {
            const query = 'UPDATE aitools SET image = ? WHERE id = ?';
            db.query(query, [image, id], (err) => {
                if (err) {
                    console.error('Error updating image:', err);
                    return reject(new Error('Error updating image'));
                }
                resolve();
            });
        });
    }

    console.log('Ai Tool Updated Successfully');
    res.status(200).json({ message: "Ai Tool Updated Successfully" });
};

exports.deleteAiTool = (req, res) => {
    const id = req.query.id;

    const query = 'DELETE FROM aitools WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.log('Error deleting Ai Tool', err);
            res.status(400).json({ message: 'Error deleting Ai Tool' })
        }
        console.log('Ai Tool deleted Successfully');
        res.status(200).json({ message: "Ai Tool Deleted Successfully!" })

    })
}
