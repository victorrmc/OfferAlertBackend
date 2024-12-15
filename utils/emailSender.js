import { Resend } from 'resend';

export const sendEmail = async (productUrl, userEmail) => {
    const resend = new Resend('re_YqiWsH7a_GMqA8N4YAXxEgN4LutXvLsA2');
    try {
        const { data, error } = await resend.emails.send({
            from: 'Ofertas <onboarding@resend.dev>', // Es mejor incluir un nombre descriptivo
            to: 'victortenemc@gmail.com',
            subject: 'Oferta Detectada',
            html: `<p>Se ha detectado una <strong>oferta</strong> en el producto!<br> ${productUrl}</p>`
        });

        if (error) {
            console.error('Error al enviar el correo:', error);
            return { success: false, error };
        }

        console.log('Correo enviado exitosamente:', data);
        return { success: true, data };

    } catch (error) {
        console.error('Error en la ejecución:', error);
        return { success: false, error };
    }
};