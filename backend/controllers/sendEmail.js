const nodemailer = require('nodemailer');

const ssendEmail = async options = > {
    const transporter = nodemailer.createTransport({
        host:"smtp.mailtrap.io",
        port:2525,
        auth:{
            user : 'ec'
        }
    })
}