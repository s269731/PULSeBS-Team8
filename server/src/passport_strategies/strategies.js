
const saml = require('passport-saml');
const fs = require('fs');
const path=require('path');
function passportConfig(passport){

    let dir=__dirname.split(path.sep);
    dir.pop()
    dir.pop()
    let str=""
    dir.forEach((e)=>{
        str=str+e+"/";
    })

    const samlStrategy = new saml.Strategy({
        // config options here
        callbackUrl: 'http://localhost:3001/login/callback',
        entryPoint: 'http://localhost:8080/simplesaml/saml2/idp/SSOService.php',
        issuer: 'http://app.example.com',
        validateInResponseTo: false,
        disableRequestedAuthnContext: true,
        forceAuthn: true,
        decryptionPvk: fs.readFileSync(str + 'certs/key.pem', 'utf8'),
        privateCert: fs.readFileSync(str  + 'certs/key.pem', 'utf8'),
        identifierFormat: null,
    }, function(profile, done) {
        
        return done(null, profile);
    });
    return samlStrategy;
}

exports.passportConfig = passportConfig;