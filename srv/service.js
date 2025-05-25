const cds = require('@sap/cds');
const axios = require('axios'); // For making HTTP requests to the Flask app

module.exports = async (srv) => {

    // Define the URL of your Flask application deployed on Render.
    // This URL is crucial for connecting to your ML model.
    const FLASK_APP_URL = 'https://salespredictionapp.onrender.com/predict';

    /**
     * Event handler for the custom action 'predictSales'.
     * This action is triggered when a client (e.g., a UI) requests a sales prediction.
     * It expects all the necessary input parameters for the Flask model.
     *
     * @param {object} req - The request object containing input data for the action.
     * @returns {object} The SalesData entity with the predicted sales, after being stored in the database.
     */
    srv.on('predictSales', async (req) => {
        const inputData = req.data; // Extract input parameters from the request

        console.log("Received input for sales prediction:", inputData);

        try {
            // 1. Prepare Payload for Flask Application
            // Ensure the keys in this payload exactly match the input features
            // that your Flask ML model expects.
            const flaskPayload = {
                Item_Identifier: inputData.Item_Identifier,
                Item_Weight: parseFloat(inputData.Item_Weight),
                Item_Fat_Content: inputData.Item_Fat_Content,
                Item_Visibility: parseFloat(inputData.Item_Visibility),
                Item_Type: inputData.Item_Type,
                Item_MRP: parseFloat(inputData.Item_MRP),
                Outlet_Identifier: inputData.Outlet_Identifier,
                Outlet_Establishment_Year: parseInt(inputData.Outlet_Establishment_Year),
                Outlet_Size: inputData.Outlet_Size,
                Outlet_Location_Type: inputData.Outlet_Location_Type,
                Outlet_Type: inputData.Outlet_Type
            };
            

            // 2. Call the Flask Machine Learning Model
            console.log("Sending prediction request to Flask:", flaskPayload);
            const flaskResponse = await axios.post(FLASK_APP_URL, flaskPayload);

            // Assuming Flask returns JSON like: { "predicted_sales": 1234.56 }
            const predictedSales = flaskResponse.data.predicted_sales;
            if (predictedSales === undefined || predictedSales === null) {
                throw new Error("Flask response did not contain 'predicted_sales' field.");
            }
            console.log("Successfully received prediction from Flask:", predictedSales);

            // 3. Prepare Data for Database Storage
            // Combine the original input data with the newly obtained prediction.
            const dataToStore = {
                ...inputData,
                Predicted_sales: predictedSales
            };

            // Get the SalesData entity from the service for database operations.
            const { SalesData } = srv.entities;

            // 4. Store/Update the Sales Data in the CAPM Database
            let finalRecord; // To hold the record that will be returned

            // Check if a record with the given Item_Identifier already exists.
            // Item_Identifier is assumed to be the primary key.
            const existingRecord = await cds.run(
                SELECT.one.from(SalesData).where({ Item_Identifier: inputData.Item_Identifier })
            );

            if (existingRecord) {
                // If a record exists, update its 'Predicted_sales' value.
                console.log(`Updating existing record for Item_Identifier: ${inputData.Item_Identifier}`);
                await cds.run(
                    UPDATE(SalesData)
                        .set({ Predicted_sales: predictedSales })
                        .where({ Item_Identifier: inputData.Item_Identifier })
                );
                // Fetch the updated record to ensure the returned object is complete and current.
                finalRecord = await cds.run(
                    SELECT.one.from(SalesData).where({ Item_Identifier: inputData.Item_Identifier })
                );
            } else {
                // If no record exists, insert a new one with all the data.
                console.log(`Inserting new record for Item_Identifier: ${inputData.Item_Identifier}`);
                // The INSERT operation itself returns the inserted entry.
                finalRecord = await cds.run(
                    INSERT.into(SalesData).entries(dataToStore)
                );
            }

            // 5. Return the Stored SalesData Record
            // This record will include the predicted sales value.
            return finalRecord;

        } catch (error) {
            // Centralized error handling for the prediction process.
            console.error("An error occurred during sales prediction or database operation:");

            if (axios.isAxiosError(error)) {
                // Handle errors specifically from the Axios HTTP request (e.g., network issues, Flask errors)
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error("  Flask API responded with error status:", error.response.status);
                    console.error("  Flask API response data:", error.response.data);
                    req.error(error.response.status, `Flask API Error: ${JSON.stringify(error.response.data)}`);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error("  No response received from Flask API. Network error or Flask app is down.");
                    req.error(503, "Could not connect to Flask prediction service. Please try again later.");
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error("  Error setting up Flask API request:", error.message);
                    req.error(500, `Internal Server Error: ${error.message}`);
                }
            } else {
                // Handle other types of errors (e.g., database errors, logic errors)
                console.error("  General error:", error.message);
                req.error(500, `Failed to process sales prediction: ${error.message}`);
            }
        }
    });

    // You can add other handlers for the SalesData entity (e.g., for general READ, DELETE)
    // if you want to allow clients to interact with the stored sales data directly.
    /*
    srv.on('READ', 'SalesData', async (req) => {
        // Example: Allow reading all stored sales data
        return cds.run(req.query);
    });
    */
};







