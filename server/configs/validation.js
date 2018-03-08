"use strict"

let valid = {
  
    email: function(email) {
        let re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    },
    usernameLength: function(username) {
        if(username.length > 3 && username.length < 100){
          return true;
        }
        else{
          return false;
        }
    },
    emailLength: function(email) {
        if(email.length > 3 && email.length < 200){
          return true;
        }
        else{
          return false;
        }
    },
    passwordLength: function(password) {
        if(password.length > 5 && password.length < 200){
          return true;
        }
        else{
          return false;
        }
    }
}

module.exports = valid;
