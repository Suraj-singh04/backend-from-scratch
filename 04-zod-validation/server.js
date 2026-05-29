const express = require('express');
const { z } = require('zod');

const app = express();

app.use(express.json());

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.number().positive("Price must be a positive number")
})

 
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.issues});
    }
    req.body = result.data;
    next();
};


let products = [
    { id: 1, name: 'Laptop', price: 59999.99 },
    { id: 2, name: 'Smartphone', price: 14499.99 },
    { id: 3, name: 'Headphones', price: 2999.99 }
];

let nextId = 4;

app.get('/products', (req, res) => {
    res.json(products);
});

app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
})

app.post('/products', validate(productSchema), (req, res) => {
    const {name, price} = req.body;

    const newProduct = {
        id: nextId++,
        name,
        price
    }

    products.push(newProduct);
    res.status(201).json(newProduct);
})

app.put('/products/:id', validate(productSchema), (req, res) => {
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    products[index] = { id: parseInt(req.params.id), ...req.body };

    res.json(products[index]);
})

app.patch('/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const {id, ...rest} = req.body;

    products[index] = { ...products[index], ...rest };
    res.json(products[index]);  
})

app.delete('/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    const deletedProduct = products.splice(index, 1);
    res.json(deletedProduct[0]);
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});