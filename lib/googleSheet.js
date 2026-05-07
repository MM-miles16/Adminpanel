import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export async function getGoogleSheet() {
  try {
    // 1. Pull the JSON string from .env and turn it back into an object
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

    // 2. Set up Auth using the fields directly from the JSON object
    const serviceAccountAuth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);

    await doc.loadInfo(); 
    return doc.sheetsByIndex[0]; 
  } catch (error) {
    console.error("Google Sheets Connection Detail:", error.message);
    throw new Error(`Authentication Failed: ${error.message}`);
  }
}