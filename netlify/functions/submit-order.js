const { google } = require('googleapis');

// Google Sheets API setup
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Spreadsheet ID from environment variable
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        // Parse request body
        const orderData = JSON.parse(event.body);

        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode', 'country', 'items', 'subtotal', 'shipping', 'total'];
        const missingFields = requiredFields.filter(field => !orderData[field]);

        if (missingFields.length > 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    error: `Champs manquants: ${missingFields.join(', ')}`
                }),
            };
        }

        // Prepare order data for Google Sheets
        const articles = orderData.items.map(item => `${item.name} (x${item.quantity})`).join('; ');
        const totalQuantity = orderData.items.reduce((sum, item) => sum + item.quantity, 0);
        const date = new Date().toLocaleString('fr-FR');
        const shippingText = orderData.shipping === 0 ? 'Gratuite' : orderData.shipping.toFixed(2) + ' DH';

        // Prepare row data
        const rowData = [
            date,
            orderData.firstName,
            orderData.lastName,
            orderData.email,
            orderData.phone,
            orderData.address,
            orderData.city,
            orderData.postalCode,
            orderData.country,
            articles,
            totalQuantity,
            orderData.subtotal.toFixed(2) + ' DH',
            shippingText,
            orderData.total.toFixed(2) + ' DH'
        ];

        // Check if spreadsheet exists and has headers
        try {
            const sheet = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: 'A1:N1',
            });

            // If no headers exist, add them
            if (!sheet.data.values || sheet.data.values.length === 0) {
                await sheets.spreadsheets.values.append({
                    spreadsheetId: SPREADSHEET_ID,
                    range: 'Sheet1!A1',
                    valueInputOption: 'RAW',
                    resource: {
                        values: [[
                            'Date',
                            'Prénom',
                            'Nom',
                            'Email',
                            'Téléphone',
                            'Adresse',
                            'Ville',
                            'Code Postal',
                            'Pays',
                            'Articles',
                            'Quantité Totale',
                            'Sous-total',
                            'Livraison',
                            'Total'
                        ]],
                    },
                });
            }
        } catch (error) {
            // If sheet doesn't exist or error, create headers
            await sheets.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID,
                range: 'Sheet1!A1',
                valueInputOption: 'RAW',
                resource: {
                    values: [[
                        'Date',
                        'Prénom',
                        'Nom',
                        'Email',
                        'Téléphone',
                        'Adresse',
                        'Ville',
                        'Code Postal',
                        'Pays',
                        'Articles',
                        'Quantité Totale',
                        'Sous-total',
                        'Livraison',
                        'Total'
                    ]],
                },
            });
        }

        // Append order data
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:N',
            valueInputOption: 'RAW',
            resource: {
                values: [rowData],
            },
        });

        // Generate order ID
        const orderId = `NOOR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Commande enregistrée avec succès',
                orderId: orderId,
                order: {
                    date: date,
                    firstName: orderData.firstName,
                    lastName: orderData.lastName,
                    email: orderData.email,
                    total: orderData.total.toFixed(2) + ' DH'
                }
            }),
        };
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la commande:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: 'Erreur lors de l\'enregistrement de la commande',
                details: error.message
            }),
        };
    }
};

