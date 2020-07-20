const db = require('../models');
const User = db.User;
const bcrypt = require('bcryptjs');
const { use } = require('chai');

let userController = {
  loginPage: (req, res) => {
    return res.render('login');
  },
  login: (req, res) => {
    User.findAll({
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    }).then((users) => {
      console.log(users);
      users = users.map((user) => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings//.map((d) => d.id).includes(user.id)
      }));
      users = users
        .sort((a, b) => b.FollowerCount - a.FollowerCount)
        .slice(0, 6);
      res.locals.topUsers = users;
      req.flash('success_messages', 'Login successfully');
      return res.redirect('/tweets');
    });
  },
  signUpPage: (req, res) => {
    return res.render('signup');
  },
  signup: (req, res) => {
    //password and confirmPassword must be the same
    if (req.body.password !== req.body.confirmPassword) {
      return res.render('signup', {
        error_messages: 'Please check your confirm password',
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
      });
    }
    //check if account name has been used
    User.findOne({ where: { account: req.body.account } }).then((user) => {
      // if the account name has been used
      if (user) {
        return res.render('signup', {
          error_messages: 'This account name is not available',
          name: req.body.name,
          account: req.body.account,
          email: req.body.email,
          password: req.body.password,
          confirmPassword: req.body.confirmPassword
        });
      } else {
        // the account name is available, check if email has been used
        User.findOne({ where: { email: req.body.email } }).then((user) => {
          if (user) {
            return res.render('signup', {
              error_messages: 'This email has been registered',
              name: req.body.name,
              account: req.body.account,
              email: req.body.email,
              password: req.body.password,
              confirmPassword: req.body.confirmPassword
            });
          }
          User.create({
            name: req.body.name,
            account: req.body.account,
            email: req.body.email,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10, null)
            ),
            avatar: 'https://i.imgur.com/73A1th4.png',
            role: 'user'
          })
            .then((user) => {
              req.flash('success_messages', 'Signup successfully');
              return res.redirect('/login');
            })
            .catch((err) => console.log(err));
        });
      }
    });
  }
};

module.exports = userController;
