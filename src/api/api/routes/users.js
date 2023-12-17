let User = require('../model/user');

function getUser(req, res) {
    let username = req.params.username;

    User.findOne({ username: username }, (err, user) => {
        if (err) { res.send(err) }
        res.json(user);
    });
}

module.exports = { getUser };
