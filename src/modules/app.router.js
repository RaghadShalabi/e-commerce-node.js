import connectDB from '../../DB/connection.js'
import categoriesRouter from './categories/categories.router.js'
import productsRouter from './products/products.router.js'
import authRouter from './auth/auth.router.js'

const initApp = (app, express) => {
    app.use(express.json())
    connectDB()
    app.get('/', (req, res) => {
        return res.status(200).json("Welcome...")
    })
    app.use('/auth', authRouter)
    app.use('/categories', categoriesRouter)
    app.use('/products', productsRouter)
    app.get('*', (req, res) => {
        return res.status(500).json({ message: "Page not found 404 x_x" })
    })
}
export default initApp;