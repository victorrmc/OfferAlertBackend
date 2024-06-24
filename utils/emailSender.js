import transporter from '../config/email.js';

export const sendEmail = async (productUrl, userEmail) => {
    const mailOptions = {
        from: process.env.EMAIL_USER_OFERT,
        to: userEmail,
        subject: 'Oferta Detectada',
        text: `Se ha detectado una oferta en el producto: ${productUrl}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado exitosamente');
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};