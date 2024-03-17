// app.js
const axios = require('axios');
const mongoose = require('mongoose');
const Fixture = require('./models');
const cron = require('node-cron');

// Connect to your MongoDB database
mongoose.connect('mongodb+srv://akramennaseh01:uwyx6kog4xlf5cZ7@cluster0.po80phe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the task as a function
async function fetchFixtures() {
    // Get today's date
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    try {
        // Fetch data from the API
        const response = await axios({
            method: 'GET',
            url: `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${formattedDate}&timezone=Europe%2FParis`,
            headers: {
                'x-rapidapi-key': 'e059107b6amsh786a3462d5bef7bp1b8c05jsnd5dbec4ebb3e',
                'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
            }
        });

        // Extract the data from the response
        const data = response.data.response;

        // Delete all documents in the Fixture collection
        await Fixture.deleteMany({});

        // Create a new document in the database for each fixture
        for (const fixture of data) {
            const newFixture = new Fixture(fixture);
            await newFixture.save();
        }
    } catch (error) {
        console.error(error);
    }
}

// Run the task immediately
fetchFixtures();

// Schedule the task to run every 24 hours
cron.schedule('0 0 * * *', fetchFixtures);