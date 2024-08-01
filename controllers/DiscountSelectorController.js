import DiscountSelector from '../models/DiscountSelector.js';

export const addDiscountSelector = async (req, res) => {
    const { domain, selector } = req.body;

    if (!domain || !selector) {
        return res.status(400).json({ error: 'Dominio y selector son requeridos' });
    }
    try {

        const existingDiscountSelector = await DiscountSelector.findOne({ domain: domain });
        if (existingDiscountSelector) {
            existingDiscountSelector.selector = selector;
            await existingDiscountSelector.save();
            return res.json({ mensaje: 'Selector del dominio actualizada exitosamente' });
        } else {
            const newDiscountSelector = new DiscountSelector({ domain, selector });
            await newDiscountSelector.save();
            return res.status(201).json({ mensaje: 'Selector del dominio y dominio guardados exitosamente' });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Error al guardar el selector del dominio y dominio' });
    }
};

export const addListDiscountSelector = async (req, res) => {
    const discountSelectors = req.body;

    if (!Array.isArray(discountSelectors) || discountSelectors.length === 0) {
        return res.status(400).json({ error: 'Se requiere una lista de dominios y selectores' });
    }

    try {
        const results = [];

        for (const { domain, selector } of discountSelectors) {
            if (!domain || !selector) {
                return res.status(400).json({ error: 'Dominio y selector son requeridos para todos los elementos' });
            }

            const existingDiscountSelector = await DiscountSelector.findOne({ domain: domain });
            if (existingDiscountSelector) {
                existingDiscountSelector.selector = selector;
                await existingDiscountSelector.save();
                results.push({ domain, mensaje: 'Selector del dominio actualizado exitosamente' });
            } else {
                const newDiscountSelector = new DiscountSelector({ domain, selector });
                await newDiscountSelector.save();
                results.push({ domain, mensaje: 'Selector del dominio y dominio guardados exitosamente' });
            }
        }

        return res.status(201).json(results);
    } catch (err) {
        return res.status(500).json({ error: 'Error al guardar los selectores de dominio' });
    }
};