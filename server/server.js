import app from "./app.js"
import { config } from "dotenv";
config();
import databaseConnection from "./config/db.connect.js";

const PORT = process.env.PORT

async function startServer() {
    try {
        await databaseConnection()
        app.listen(PORT || 5100, () => {
            console.log(`Server is running on this port http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log(error.message)
    }
}

startServer();


