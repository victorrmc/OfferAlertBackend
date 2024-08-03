import StoreCheckerTest from '../models/StoreCheckerTest.js';

export const addStoreCheckerTest = async (req, res) => {
    try {
        const { storeUrl, firstItemCode } = req.body;
        if (!storeUrl || !firstItemCode) {
            return res.status(400).send({ error: 'storeUrl y firstItemCode son requeridos' });
        }
        const storeCheckerTest = new StoreCheckerTest({ storeUrl, firstItemCode });
        await storeCheckerTest.save();
        res.status(201).send(storeCheckerTest);
    } catch (error) {
        console.error('Error al añadir storeCheckerTest:', error);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
};

export const getStoreCheckerTests = async (req, res) => {
    try {
        const storeCheckerTests = await StoreCheckerTest.find();
        res.send(storeCheckerTests);
    } catch (error) {
        res.status(500).send(error);
    }
};