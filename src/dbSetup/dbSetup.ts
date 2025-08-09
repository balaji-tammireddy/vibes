import mongoose from "mongoose";

export async function connect(){
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("Mongoose successfully connected");
        })

        connection.on("error", (err) => {
            console.log("Mongoose connection error: ", err);
            process.exit();
        })
    } catch (error) {
        console.log("Mongoose connection error: ", error);
    }
}