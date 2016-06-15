var ActiveDirectory = require('activedirectory')
  , config = require('../../../config');

exports.login = function login(req, res, next) {
    var adClient = new ActiveDirectory(config.ldap.config)
      , user = parseUser(req.body.user)
      , password = req.body.password;
    if(user && password) {
        var domainUser = user.user;
        if(user.domain) {
            domainUser = domainUser + '@' + user.domain;
        }
        adClient.authenticate(domainUser, password, function(err, auth) {
            if(err) {
                if(err && err.name == 'InvalidCredentialsError') {
                    return res.json({
                        success: false,
                        error: 'Invalid Credentials'
                    });
                }
                return res.json({
                    success: false,
                    error: err
                });
            }

            if(!auth) {
                return res.json({
                    success: false,
                    error: 'Could not authenticate'
                });
            }

            adClient.getGroupMembershipForUser(user.user, function(err, groups) {
                //is there an error?
                if(err){
                    return res.json({
                        success: false,
                        error: err.message
                    });
                }

                //does the user exist?
                if (!groups) {
                    return res.json({
                        success: false,
                        error: 'User could not be found.'
                    });
                }

                //does the user have permission?
                var hasRequiredGroup = false;

                groups.forEach(function(group){
                    if(config.ldap.groups.indexOf(group.cn) >= 0) {
                        hasRequiredGroup = true;
                    }
                });

                if(hasRequiredGroup) {
                    //user has access
                    res.cookie('auth', domainUser, { maxAge: 900000, signed: true});

                    return res.json({
                        success: true
                    });
                } else {
                    return res.json({
                        success: false,
                        error: 'User found, but does not have permissions.'
                    });
                }
            });
        });

    } else {
        //failed to submit a valid user
        return res.json({
            success: false,
            error: 'Missing User/Password.'
        });
    }
};

function parseUser(user) {
    var data = {
        user: null,
        domain: null
    };

    if(user) {
        if(user.indexOf('\\') > 0){
            data.domain = user.split('\\')[0];
            data.user = user.split('\\')[1];
        } else {
            data.user = user;
        }    

        return data;   
    } else {
        return false;
    }
}