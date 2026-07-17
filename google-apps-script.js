// ---------------------------------------------------------------------------------
// RootNode Rebels - Google Apps Script (Resend API Proxy)
// ---------------------------------------------------------------------------------
// INSTRUCTIONS:
// 1. Go to script.google.com and click "New Project".
// 2. Paste this entire script.
// 3. 🚨 REPLACE 'YOUR_RESEND_API_KEY_HERE' below with your actual Resend API Key!
// 4. Click "Deploy" > "New deployment".
// 5. Select type "Web app".
// 6. Set "Execute as" to "Me" and "Who has access" to "Anyone".
// 7. Click Deploy, authorize permissions, and copy the Web App URL.
// 8. Paste that URL into the scriptURL variable in your script.js file.
// ---------------------------------------------------------------------------------

const RESEND_API_KEY = 'YOUR_RESEND_API_KEY_HERE';
const FROM_EMAIL = 'onboarding@resend.dev'; // Replace if you have a custom domain on Resend
const TO_EMAIL = 'contact@rootnode-rebels.cc.cd'; // Where you want to receive the messages

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const name = e.parameter.Name || "Unknown Name";
    const email = e.parameter.Email || "Unknown Email";
    const message = e.parameter.Message || "No message provided.";

    const htmlBody = `
      <h2>New Message from RootNode Rebels Website</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `;

    // Construct the payload for the Resend API
    const payload = {
      "from": `RootNode Rebels Contact <${FROM_EMAIL}>`,
      "to": [TO_EMAIL],
      "subject": `New Contact Submission from ${name}`,
      "html": htmlBody,
      "reply_to": email
    };

    const options = {
      'method': 'post',
      'contentType': 'application/json',
      'headers': {
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      'payload': JSON.stringify(payload),
      'muteHttpExceptions': true
    };

    // Call the Resend API
    const response = UrlFetchApp.fetch('https://api.resend.com/emails', options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();

    if (responseCode === 200 || responseCode === 201) {
      return ContentService
        .createTextOutput(JSON.stringify({ 'result': 'success', 'resend_response': JSON.parse(responseText) }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      throw new Error(`Resend API Error (${responseCode}): ${responseText}`);
    }

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Handle preflight OPTIONS request required for CORS
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
