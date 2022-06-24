const { pageTitle } = require('../utility');
const PAGE = 'login';
const fs = require('fs');
const path = require('path')

exports.get = (req, res) => {
    res.render('template', { page: PAGE, title: pageTitle[PAGE], msg: null })
}

exports.post = (req, res) => {
    const { data } = JSON.parse(fs.readFileSync(path.resolve('data', 'admin.json')));
    if (req.body.username == data[0].username) {
        if (req.body.password == data[0].password) {
            req.session.user = {
                name: `${data[0].firstname} ${data[0].lastname}`,
                userid: data[0].id,
                usertype: data[0].usertype,
            };
            res.redirect('/');
        } else {
            res.render('template', { page: PAGE, title: pageTitle[PAGE], msg: 'Password is incorrect'  })
        }
    } else {
        res.render('template', { page: PAGE, title: pageTitle[PAGE], msg: 'User data is not exist'  })
    }
}