const nodemailer = require('nodemailer');

const sendWelcomeEmail = async (name, email) => {
    try {
        
        let testAccount = await nodemailer.createTestAccount();

      
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user, 
                pass: testAccount.pass, 
            },
        });

        let info = await transporter.sendMail({
            from: '"Assignment 2 API" <no-reply@example.com>', 
            to: email, 
            subject: "Welcome to our Platform!", 
            text: `Hello ${name}, welcome to our platform! We are glad to have you.`, 
            html: `<h3>Hello ${name},</h3><p>Welcome to our platform! We are glad to have you.</p>`, 
        });

        console.log("Welcome message sent: %s", info.messageId);
       
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("Error sending welcome email", error);
    }
};

module.exports = { sendWelcomeEmail };
