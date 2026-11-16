import Product from "../models/productsModel.js";
import Cart from "../models/cartModel.js"




export const addToCart = async (req, res) => {

    try {

        const user = req.user;

        const { id, price, quantity = 1 } = req.body;
        console.log(id, price);
        const isCartExist = await Cart.findOne({ user: user._id });

        if (!isCartExist) {

            const newCart = await Cart.create({ user: user._id, items: [{ product: id, price: price }], totalPrice: price })

            return res.status(201).json({ success: true, message: "Item added to cart", newCart })

        }

        const isProductExist = isCartExist.items.some((item) => item.product == id);

        if (!isProductExist) {
            isCartExist.items.push({ product: id, price: price })
            isCartExist.totalPrice = isCartExist.items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
            await isCartExist.save()
            return res.status(201).json({ success: true, message: "Item added to cart", isCartExist })
        }

        isCartExist.items = isCartExist.items.map((item) => {
            if (item.product == id) {
                item.quantity += 1
            }
            return item

        })
        isCartExist.totalPrice = isCartExist.items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
        await isCartExist.save()
        return res.status(201).json({ success: true, message: "Item added to cart", isCartExist })


    } catch (error) {

        res.status(500).json({ error: error.message, success: false })



    }

}










export const getUserCart = async (req, res) => {
    try {
        const user = req.user;

        const userCart = await Cart.findOne({
            user: user._id
        }).populate("items.product");

        if (!userCart || userCart.items.length === 0) {
            return res.status(200).json({
                success: true,
                cart: userCart,
                subtotal: 0,
                originalTotal: 0,
                savings: 0,
                delivery: 0,
                total: 0
            });
        }

        const subtotal = userCart.items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        const originalTotal = userCart.items.reduce(
            (acc, item) => {
                return acc + (item.product.price * item.quantity);
            },
            0
        );

        const savings = originalTotal - subtotal;

        const delivery = subtotal >= 999 ? 0 : 50;

        const total = subtotal + delivery;

        return res.status(200).json({
            success: true,
            cart: userCart,
            subtotal,
            originalTotal,
            savings,
            delivery,
            total
        });

    } catch (error) {
        console.error("Get cart error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


