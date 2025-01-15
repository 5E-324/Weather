import express from 'express';
import { Readable } from "stream";
import cors from "cors";

const app = express();
const port = 3000;
const apiKey = process.env.OWM_API_KEY;

if (!apiKey) {
    console.error('Error: OWM_API_KEY environment variable not found.');
    process.exit(1);
}

app.use(cors());

app.use('/weather', async (req, res) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${req.query.q}&appid=${apiKey}`;

    try {
        const response = await fetch(url);

        res.set('content-type', 'application/json');
        res.status(response.status);
        Readable.fromWeb(response.body).pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});