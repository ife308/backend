module.exports = function multerErrorHandler(uploader) {
    return (req, res, next) => {
        uploader(req, res, function (err) {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ success: false, message: 'Image size should not be more than 5MB' });
                }
                return res.status(400).json({ success: false, message: err.message });
            }
            next();
        });
    };
};
