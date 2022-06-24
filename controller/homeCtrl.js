const { pageTitle } = require('../utility');
const PAGE = 'home';

exports.get = (req, res) => {
    res.render('template', { page: PAGE, title: pageTitle[PAGE], sessiondata: req.session.user, })
}