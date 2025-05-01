const db = require('../db');
const { NewsValidator, NewsEditValidator } = require('../models/User');

exports.addNews = (req, res) => {
    if (!req.file || !req.file.path) { console.error('File is undefined'); return res.status(400).json({message:'No file uploaded'}); }
    
    const image = req.file.path
    const { author, title, description } = req.body;

    const { isValid, errors } = NewsValidator({ author, title, description, image });
    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }

    const query = 'INSERT INTO news (author, title, description, image) VALUES (?, ?, ?, ?)';
    db.query(query, [author, title, description, image], (err, result) => {
        if (err) {
            console.error('Error adding news:', err);
            return res.status(500).json({message:'Failed to add news'});
        }
        res.status(200).json({message:'News added successfully!'});
    });
}

exports.allNews = (req, res) => {
    const query = 'SELECT * FROM news ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching news:', err);
            return res.status(500).json({message:'Failed to fetch news'});
        }
        res.status(200).json(results);
    });
}

exports.editNews = async (req, res) => {
    const id = req.query.id;
    const image = req.file ? req.file.path : null;
    const { author, title, description } = req.body;

    const { isValid, errors } = NewsEditValidator({ author, title, description, image });
    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }

    if (!author && !title && !description && !image) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    if (author) {
        await new Promise((resolve, reject) => {
            const query = 'UPDATE news SET author = ? WHERE id = ?';
            db.query(query, [author, id], (err) => {
                if (err) {
                    console.error('Error updating author:', err);
                    return reject(new Error('Error updating author'));
                }
                resolve();
            });
        });
    }

    if (title) {
        await new Promise((resolve, reject) => {
            const query = 'UPDATE news SET title = ? WHERE id = ?';
            db.query(query, [title, id], (err) => {
                if (err) {
                    console.error('Error updating title:', err);
                    return reject(new Error('Error updating title'));
                }
                resolve();
            });
        });
    }

    if (description) {
        await new Promise((resolve, reject) => {
            const query = 'UPDATE news SET description = ? WHERE id = ?';
            db.query(query, [description, id], (err) => {
                if (err) {
                    console.error('Error updating description:', err);
                    return reject(new Error('Error updating description'));
                }
                resolve();
            });
        });
    }

    if (image) {
        await new Promise((resolve, reject) => {
            const query = 'UPDATE news SET image = ? WHERE id = ?';
            db.query(query, [image, id], (err) => {
                if (err) {
                    console.error('Error updating image:', err);
                    return reject(new Error('Error updating image'));
                }
                resolve();
            });
        });
    }

        console.log('News Updated Successfully');
        res.status(200).json({ message: "News Updated Successfully"});

}

exports.deleteNews = (req, res) => {
    const id = req.query.id;

    const query = 'DELETE FROM news WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.log('Error deleting News', err);
            res.status(400).json({message: 'Error deleting News'})
        }
        console.log('News deleted Successfully');
        res.status(200).json({message: "News deleted Successfully"})

    })
}
