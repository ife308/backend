const express = require('express');
const router = express.Router();

const Admin = require('./controllers/admin');
const userAuth = require('./controllers/userAuth');
const EditProfile = require('./controllers/EditProfile');
const contact = require('./controllers/contact')
const subject = require('./controllers/subject');
const event = require('./controllers/events');
const news = require('./controllers/news');
const prompts = require('./controllers/prompts');
const aitools = require('./controllers/aitools');
const team = require('./controllers/teams');
const grade = require('./controllers/grade');
const forgotPassword = require('./controllers/forgotpassword');
const { isAuthenticated, ensureSuper, ensureAdmin } = require('./middleware/middleware');
const { upload, eventImage, newsImage, aitoolImage, teamImage } = require('./cloudinary');
const multerErrorHandler = require('./middleware/multerSizeLimit');



router.post('/api/login/admin', Admin.adminLogin);
router.post('/api/addadmin', ensureSuper,  Admin.addAdmin);
router.get('/api/admin', Admin.admin);
router.post('/api/adminLogout', Admin.adminLogout);
router.post('/api/signup', userAuth.signup);
router.post('/api/login', userAuth.login);
router.get('/api/user', userAuth.user);
router.post('/api/forgot-password', forgotPassword.forgotPassword);
router.post('/api/reset-password', forgotPassword.resetPassword);
router.post('/api/logout', userAuth.logout);
router.put('/api/editUser', isAuthenticated, multerErrorHandler(upload), EditProfile.edit);
router.post('/api/deletePhoto', isAuthenticated, EditProfile.deletePhoto);
router.post('/api/contact', contact.contact);
router.post('/api/addSubject', ensureAdmin, subject.addSubject);
router.delete('/api/deleteSubject', ensureAdmin, subject.deleteSubject);
router.get('/api/subjects', subject.allSubject);
router.get('/api/events', event.allEvent);
router.post('/api/events/register', isAuthenticated, event.registerEvent);
router.get('/api/registeredevent', isAuthenticated, event.eventStatus);
router.delete('/api/cancelRegistration', isAuthenticated, event.DeleteEventRegistration);
router.post('/api/addEvents', ensureAdmin, multerErrorHandler(eventImage), event.addEvent);
router.put('/api/updateEvent', ensureAdmin, multerErrorHandler(eventImage), event.editEvent);
router.delete('/api/deleteEvent', ensureAdmin, event.deleteEvent)
router.get('/api/news', news.allNews);
router.post('/api/addNews', ensureAdmin, multerErrorHandler(newsImage), news.addNews);
router.put('/api/editNews', ensureAdmin, multerErrorHandler(newsImage), news.editNews);
router.delete('/api/deleteNews', ensureAdmin, news.deleteNews);
router.post('/api/addPrompt', isAuthenticated, prompts.addPrompt);
router.post('/api/adminaddPrompt', ensureAdmin, prompts.AdminAddPrompt);
router.get('/api/userprompt', prompts.userPrompt);
router.get('/api/prompts', prompts.allPrompt);
router.put('/api/editprompt', isAuthenticated, prompts.editPrompt);
router.post('/api/filterprompt', prompts.filterPrompt);
router.put('/api/updatepromptstatus', ensureAdmin, prompts.ApprovePrompt);
router.get('/api/pendingprompt', ensureAdmin, prompts.pendingPrompt);
router.get('/api/userpendingprompt', prompts.userPendingPrompt);
router.get('/api/userapprovedprompt', prompts.userApprovedPrompt);
router.delete('/api/deleteprompt', isAuthenticated, prompts.deletePrompt);
router.post('/api/addAitools', ensureAdmin, multerErrorHandler(aitoolImage), aitools.addAitools);
router.get('/api/dashboard/aitools', aitools.dashboardTools);
router.get('/api/aitools', aitools.allAitools);
router.put('/api/editaitool', ensureAdmin, multerErrorHandler(aitoolImage), aitools.editAiTool);
router.delete('/api/deleteAitool', ensureAdmin, aitools.deleteAiTool);
router.post('/api/addTeam', ensureAdmin, multerErrorHandler(teamImage), team.addTeam);
router.get('/api/allteam', team.allTeam);
router.delete('/api/deleteteam', ensureAdmin, team.deleteTeam);
router.post('/api/addgrade', ensureAdmin, grade.addGrade);
router.delete('/api/deletegrade', ensureAdmin, grade.deleteGrade);
router.get('/api/getallgrade', grade.getAllGrade);


module.exports = router;