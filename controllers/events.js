const db = require('../db');
const { EventValidator, EditEventValidator } = require('../models/User');

exports.addEvent = (req, res) => {
    const { title, description, start_time, end_time, date, location } = req.body;
    const image = req.file.path;


    const { isValid, errors } = EventValidator({ title, description, start_time, end_time, date, location, image });
    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }

    const query = `INSERT INTO events (title, description, start_time, end_time, date, location, image) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [title, description, start_time, end_time, date, location, image], (err, result) => {
        if (err) {
            console.error('Error creating event:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(201).json({ message: 'Event created successfully' });
    });
}


exports.editEvent = async (req, res) => {
    const id = req.query.id;
    const image = req.file ? req.file.path : null;
    const { title, description, start_time, end_time, date, location } = req.body

    const { isValid, errors } = EditEventValidator({ title, description, start_time, end_time, date, location, image });
    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }

    if (title) {
        await new Promise((resolve, reject) => {
            const query = 'UPDATE events SET title = ? WHERE id = ?';
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
            const query = 'UPDATE events SET description = ? WHERE id = ?';
            db.query(query, [description, id], (err) => {
                if (err) {
                    console.error('Error updating description:', err);
                    return reject(new Error('Error updating description'));
                }
                resolve();
            });
        });
    }

    if (start_time) {
        await new Promise((resolve, reject) => {
            const query = 'UPDATE events SET start_time = ? WHERE id = ?';
            db.query(query, [start_time, id], (err) => {
                if (err) {
                    console.error('Error updating start_time:', err);
                    return reject(new Error('Error updating Start time'));
                }
                resolve();
            });
        });
    }

    if (end_time) {
        await new Promise((resolve, reject) => {
            const query = 'UPDATE events SET end_time = ? WHERE id = ?';
            db.query(query, [end_time, id], (err) => {
                if (err) {
                    console.error('Error updating end_time:', err);
                    return reject(new Error('Error updating End time'));
                }
                resolve();
            });
        });
    }

    if (date) {
        await new Promise((resolve, reject) => {
            const query = 'UPDATE events SET date = ? WHERE id = ?';
            db.query(query, [date, id], (err) => {
                if (err) {
                    console.error('Error updating date:', err);
                    return reject(new Error('Error updating date'));
                }
                resolve();
            });
        });
    }

    if (location) {
        await new Promise((resolve, reject) => {
            const query = 'UPDATE events SET location = ? WHERE id = ?';
            db.query(query, [location, id], (err) => {
                if (err) {
                    console.error('Error updating location:', err);
                    return reject(new Error('Error updating location'));
                }
                resolve();
            });
        });
    }

    if (image) {
        await new Promise((resolve, reject) => {
            const query = 'UPDATE events SET image = ? WHERE id = ?';
            db.query(query, [image, id], (err) => {
                if (err) {
                    console.error('Error updating image:', err);
                    return reject(new Error('Error updating image'));
                }
                resolve();
            });
        });
    }


    console.log('Event Updated Successfully');
    res.status(200).json({ message: "Event Updated Successfully" });
};

exports.deleteEvent = (req, res) => {
    const id = req.query.id;

    const query = 'DELETE FROM events WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.log('Error deleting event', err);
            res.status(400).json({ message: 'Error deleting event' })
        }
        console.log('Event deleted Successfully');
        res.status(200).json({ message: "Event Deleted Successfully!" })

    })
}

exports.registerEvent = (req, res) => {
    const id = req.query.id;
    const user_id = req.session.user.id;

    const query = `INSERT INTO event_registrations (event_id, user_id, registered_at) 
                       VALUES (?, ?, NOW())`;

    db.query(query, [id, user_id], (err, result) => {
        if (err) {
            console.error('Error registering for event:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(200).json({ message: 'Registration successful' });
    });
}


exports.DeleteEventRegistration = (req, res) => {
    const id = req.query.id;
    const user_id = req.session.user.id;

    const query = `DELETE FROM event_registrations WHERE event_id = ? AND user_id = ?`;

    db.query(query, [id, user_id], (err, result) => {
        if (err) {
            console.error('Error deleting registering for event:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event registration not found' });
        }

        res.status(200).json({ message: 'Event registration deleted successful' });
    });
}


exports.eventStatus = (req, res) => {
    const user_id = req.session.user.id;

    const query = 'SELECT event_id FROM event_registrations WHERE user_id = ?';

    db.query(query, [user_id], (err, result) => {
        if (err) {
            console.error('Error fetching registered event:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(200).json(result);
    })

}


exports.allEvent = (req, res) => {
    const query = `SELECT *, 
                CASE 
                WHEN date = CURDATE() AND start_time <= NOW() THEN 'ongoing'
                WHEN date < CURDATE() THEN 'previous'
                ELSE 'upcoming'
            END AS event_status FROM events ORDER BY date, start_time ASC`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching events:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        const groupedEvents = {
            allevent: results,
            upcoming: results.filter(event => event.event_status === 'upcoming'),
            ongoing: results.filter(event => event.event_status === 'ongoing'),
            previous: results.filter(event => event.event_status === 'previous')
        };
        res.status(200).json(groupedEvents);

    });
}