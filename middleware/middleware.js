const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

const ensureAdmin = (req, res, next) => {
    if (req.session.admin && (req.session.admin.role === 'admin' || req.session.admin.role === 'superuser')) {
        return next();
    }
    res.status(403).json({ message: 'Admin access required' });
};

const ensureSuper = (req, res, next) => {
    if (req.session.admin && (req.session.admin.role === 'superuser')) {
        return next();
    }
    res.status(403).json({ message: 'Super access required' });
};


module.exports = {isAuthenticated, ensureAdmin, ensureSuper};