import { Resend } from 'resend';

const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const sendOfferEmail = async (product) => {
    if (!process.env.API_KEY_RESEND) {
        console.error('Falta API_KEY_RESEND: no se puede enviar el aviso');
        return { success: false, error: 'API_KEY_RESEND missing' };
    }
    const resend = new Resend(process.env.API_KEY_RESEND);
    const to = process.env.NOTIFY_EMAIL || product.userEmail;
    const name = product.name ?? 'Tu producto';
    const priceLine =
        product.price !== null && product.price !== undefined
            ? `<p><s>${product.oldPrice ?? ''} €</s> → <strong>${product.price} €</strong>` +
              (product.discountPercentage ? ` (-${product.discountPercentage}%)` : '') +
              '</p>'
            : '';

    try {
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'OfferAlert <onboarding@resend.dev>',
            to,
            subject: `Rebajado: ${name}${product.price ? ` a ${product.price} €` : ''}`,
            html:
                `<h2>${escapeHtml(name)}${product.color ? ` – ${escapeHtml(product.color)}` : ''}</h2>` +
                priceLine +
                `<p><a href="${escapeHtml(product.productUrl)}">Ver producto</a></p>`,
        });
        if (error) {
            console.error('Error al enviar el correo:', error);
            return { success: false, error };
        }
        console.log(`Aviso enviado a ${to}`);
        return { success: true, data };
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return { success: false, error };
    }
};
