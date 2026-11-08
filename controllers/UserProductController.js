import UserProduct from '../models/UserProduct.js';
import { isSupportedUrl, SUPPORTED_STORES } from '../services/stores/index.js';
import { checkForOffers, checkProduct } from '../services/offerChecker.js';

// Accepts both the mobile app body ({ url, email }) and the old one ({ productUrl, userEmail }).
export const addUserProduct = async (req, res) => {
    const productUrl = (req.body.url ?? req.body.productUrl)?.trim();
    const userEmail = (req.body.email ?? req.body.userEmail)?.trim().toLowerCase();

    if (!productUrl || !userEmail) {
        return res.status(400).send({ error: 'url y email son requeridos' });
    }
    if (!isSupportedUrl(productUrl)) {
        return res.status(400).send({ error: `Tienda no soportada. Tiendas: ${SUPPORTED_STORES.join(', ')}` });
    }

    try {
        const existing = await UserProduct.findOne({ productUrl, userEmail });
        if (existing) {
            return res.status(200).send(existing);
        }
        const userProduct = new UserProduct({ productUrl, userEmail });
        await userProduct.save();

        // First check right away so the app gets name and price (and an email if it is already on sale).
        try {
            await checkProduct(userProduct);
        } catch (error) {
            userProduct.lastError = error.message;
            await userProduct.save();
        }
        res.status(201).send(userProduct);
    } catch (error) {
        console.error('Error al añadir producto:', error);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
};

export const getUsersProducts = async (req, res) => {
    try {
        const filter = req.query.email ? { userEmail: req.query.email.trim().toLowerCase() } : {};
        const products = await UserProduct.find(filter).sort({ createdAt: -1 });
        res.send(products);
    } catch (error) {
        res.status(500).send({ error: 'Error interno del servidor' });
    }
};

export const deleteUserProduct = async (req, res) => {
    try {
        const deleted = await UserProduct.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).send({ error: 'Producto no encontrado' });
        res.send({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(400).send({ error: 'Id no válido' });
    }
};

export const checkNow = async (req, res) => {
    checkForOffers().catch((error) => console.error('Error en la comprobación manual:', error));
    res.status(202).send({ message: 'Comprobación iniciada' });
};
