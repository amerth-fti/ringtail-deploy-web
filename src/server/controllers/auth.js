var ActiveDirectory = require('activedirectory')
  , config = require('../../../config');

exports.login = function login(req, res, next) {
    var adClient = new ActiveDirectory(config.ldap.config)
      , user = parseUser(req.body.user)
      , password = req.body.password;

    if(user) {
        var domainUser = user.user;

        adClient.getGroupMembershipForUser(domainUser, function(err, groups) {
            //is there an error?
            if(err){
                return res.send({
                    success: false,
                    error: "error"
                });
            }

            //does the user exist?
            if (!groups) {
                return res.send({
                    success: false,
                    error: "no user found"
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
                return res.send({
                    success: true
                });
            } else {
                return res.send({
                    success: false,
                    error: "user found, but does not have permission"
                });
            }
        });

    } else {
        //failed to submit a valid user
        return res.send({
            success: false,
            error: "bad user"
        });
    }
}

function parseUser(user) {
    var data = {
        user: null,
        domain: null
    };

    if(user) {
        if(user.indexOf("\\") > 0){
            data.domain = user.split("\\")[0];
            data.user = user.split("\\")[1];
        } else {
            data.user = user;
        }    

        return data;   
    } else {
        return false;
    }
}