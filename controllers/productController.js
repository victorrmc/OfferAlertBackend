import Product from '../models/Product.js';

export const addProduct = async (req, res) => {
    try {
        const { url, email } = req.body;
        if (!url || !email) {
            return res.status(400).send({ error: 'URL y email son requeridos' });
        }
        const product = new Product({ url, email });
        await product.save();
        res.status(201).send(product);
    } catch (error) {
        console.error('Error al añadir producto:', error);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.send(products);
    } catch (error) {
        res.status(500).send(error);
    }
};