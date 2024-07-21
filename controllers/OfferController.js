import Offer from '../models/Offer.js';


// Ruta para añadir o actualizar una oferta
export const addCodePage = async (req, res) => {
    const { page, code } = req.body;

    if (!page || !code) {
        return res.status(400).json({ error: 'Pagina y codigo son requeridos' });
    }
    try {

        const existingOffer = await Offer.findOne({ page: page });
        if (existingOffer) {
            existingOffer.code = code;
            await existingOffer.save();
            return res.json({ mensaje: 'Codigo de la pagina actualizada exitosamente' });
        } else {
            const nuevaOferta = new Offer({ page, code });
            await nuevaOferta.save();
            return res.status(201).json({ mensaje: 'Codigo de la pagina y pagina guardada exitosamente' });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Error al guardar el codigo de la pagina y pagina' });
    }
};
