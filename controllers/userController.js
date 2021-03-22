const User = require('../models/user');

exports.login = (req, res)=>{
    res.render('login'); //Está puxando o View login
};

exports.loginAction = (req, res) => {
    const auth = User.authenticate();

    auth(req.body.email, req.body.password, (error, result) => {
        if(!result) {
            req.flash('error', 'Seu e-mail e/ou senha estão errados!');
            res.redirect('/users/login');
            return;
        }

        req.login(result, ()=>{});

        req.flash('success', 'Você foi logado com sucesso!');
        res.redirect('/');
    });
};

exports.register = (req, res) => {
    res.render('register'); //Está puxando o View register
};

exports.registerAction = (req, res) => {
    const newUser = new User(req.body);
    User.register(newUser, req.body.password, (error)=>{
        if(error){

            req.flash('error', 'Ocorreu um erro, tente mais tarde');
            res.redirect('/users/register');
            return;
        }
        
        req.flash('sucess', 'Registro efetuado com sucesso. Faça o login');
        res.redirect('/users/login');
    }); //criação do usuário
};

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};

