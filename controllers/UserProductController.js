import UserProduct from '../models/UserProduct.js';

export const addUserProduct = async (req, res) => {
    try {
        const { productUrl, userEmail } = req.body;
        if (!productUrl || !userEmail) {
            return res.status(400).send({ error: 'productUrl y userEmail son requeridos' });
        }
        const userProduct = new UserProduct({ productUrl, userEmail });
        await userProduct.save();
        res.status(201).send(userProduct);
    } catch (error) {
        console.error('Error al añadir userProduct:', error);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
};

export const getUsersProducts = async (req, res) => {
    try {
        const usersProducts = await UserProduct.find();
        res.send(usersProducts);
    } catch (error) {
        res.status(500).send(error);
    }
};