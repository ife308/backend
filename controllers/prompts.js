const db = require('../db');
const { AddPromptValidator, filterPromptValidator, EditPromptValidator, AdminAddPromptValidator } = require('../models/User');

exports.addPrompt = (req, res) => {
    const id = req.session.user.id
    const { name, description, subject_id, grade_id } = req.body;

    const { isValid, errors } = AddPromptValidator({ name, description, subject_id, grade_id });
    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }

    const query = 'INSERT INTO prompt (name, description, subject_id, grade_id, user_id) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, description, subject_id, grade_id, id], (err, result) => {
        if (err) {
            console.error('Error adding prompt:', err);
            return res.status(500).json({ message: 'Failed to add prompt' });
        }
        res.status(200).json({ message: 'prompt added successfully!' });
    });
};

exports.AdminAddPrompt = (req, res) => {
    const id = req.session.admin.id
    const { name, description = null, subject_id, grade_id } = req.body;

    const { isValid, errors } = AdminAddPromptValidator({ name, subject_id, grade_id });
    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }

    const query = 'INSERT INTO prompt (name, description, subject_id, grade_id, user_id, status) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [name, description, subject_id, grade_id, id, "approved"], (err, result) => {
        if (err) {
            console.error('Error adding prompt:', err);
            return res.status(500).json({ message: 'Failed to add prompt' });
        }
        res.status(200).json({ message: 'prompt added successfully!' });
    });
};


//Approve or decline prompt
exports.ApprovePrompt = (req, res) => {
    const prompt_id = req.query.id;
    const { status } = req.body;

    if (!['approved', 'decline'].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
    }

    const query = 'UPDATE prompt SET status = ? WHERE id = ?';
    db.query(query, [status, prompt_id], (err, result) => {
        if (err) {
            console.error("Failed to update prompt status", err);
            res.status(400).json({ message: "Failed to update prompt status" });
        } else {
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Prompt not found' });
            }

            console.log(`Prompt updated successfully`);
            res.status(200).json({ message: `Prompt ${status}` })
        }
    });
};


//Fetching Pending prompt for the admin to approve or decline
exports.pendingPrompt = (req, res) => {
    const query = 'SELECT * FROM prompt WHERE status = "pending"';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching prompts', err);
            res.status(400).json({ message: 'Error fetching prompts', err })
        } else {
            res.status(200).json(result)
        }
    });
};

//All user prompt
exports.userPrompt = (req, res) => {
    const userId = req.session.user.id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' }); // User not signed in
    }

    const query = 'SELECT * FROM prompt WHERE user_id = ? ORDER BY id DESC';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user prompts:', err);
            res.status(500).json({ message: 'Failed to fetch prompts' });
        } else {
            res.status(200).json(results);
        }
    });
};

//User pending prompt
exports.userPendingPrompt = (req, res) => {
    const userId = req.session.user.id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' }); // User not signed in
    }

    const query = 'SELECT * FROM prompt WHERE user_id = ? AND status = "pending" ORDER BY id DESC';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user prompts:', err);
            res.status(500).json({ message: 'Failed to fetch prompts' });
        } else {
            res.status(200).json(results);
        }
    });
};

//User approved prompt
exports.userApprovedPrompt = (req, res) => {
    const userId = req.session.user.id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const query = 'SELECT * FROM prompt WHERE user_id = ? AND status = "approved" ORDER BY id DESC';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user prompts:', err);
            res.status(500).json({ message: 'Failed to fetch prompts' });
        } else {
            res.status(200).json(results);
        }
    });
};


exports.allPrompt = (req, res) => {
    const query = 'SELECT * FROM prompt ORDER BY id DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching prompts:', err);
            res.status(500).json({ message: 'Error fetching prompts' });
        } else {
            res.status(200).json(results);
        }
    });
};


exports.filterPrompt = (req, res) => {
    const { subject_id, grade_id } = req.body;

    const { isValid, errors } = filterPromptValidator({ subject_id, grade_id });
    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }

    const query = 'SELECT * FROM prompt WHERE subject_id = ? AND grade_id = ? ORDER BY id DESC';
    db.query(query, [subject_id, grade_id], (err, result) => {
        if (err) {
            console.error('Error fetching prompts:', err);
            res.status(500).json({ message: 'Error fetching prompts' });
        } else {
            res.status(200).json(result);
        }
    })
}

exports.editPrompt = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const id = req.query.id;
        const userId = req.session.user.id;
        const { name, description } = req.body;

        const { isValid, errors } = EditPromptValidator({ name, description });
        if (!isValid) {
            return res.status(400).json({ success: false, errors });
        }

        if (!name && !description) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        if (name) {
            await new Promise((resolve, reject) => {
                const query = 'UPDATE prompt SET name = ? WHERE id = ? AND user_id = ?';
                db.query(query, [name, id, userId], (err, result) => {
                    if (err) {
                        console.error('Error updating name:', err);
                        return reject(new Error('Error updating prompt name'));
                    }
                    if (result.affectedRows === 0) { return res.status(404).json({ message: 'Prompt not found or not authorized to update' }); }

                    resolve();


                });
            });
        }

        if (description) {
            await new Promise((resolve, reject) => {
                const query = 'UPDATE prompt SET description = ? WHERE id = ? AND user_id = ?';
                db.query(query, [description, id, userId], (err, result) => {
                    if (err) {
                        console.error('Error updating description:', err);
                        return reject(new Error('Error updating prompt description'));
                    }
                    if (result.affectedRows === 0) { return res.status(404).json({ message: 'Prompt not found or not authorized to update' }); }

                    resolve();


                });
            });
        }

        res.status(200).json({ message: 'prompt updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}


exports.deletePrompt = (req, res) => {
    const id = req.query.id;
    const userId = req.session.user.id;
    const query = 'DELETE FROM prompt WHERE id = ? AND user_id = ?'
    db.query(query, [id, userId], (err, result) => {
        if (err) {
            res.status(400).json({ message: 'error deleting prompt' });
        } else {
            if (result.affectedRows === 0) { return res.status(404).json({ message: 'Prompt not found or not authorized to delete' }); }
            res.status(200).json({ message: 'prompt deleted successfully' });
        }
    })
}
