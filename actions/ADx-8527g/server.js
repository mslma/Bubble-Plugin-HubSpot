async function(properties, context) {
    const axios = require('axios');

    const contactId = properties.contactId; // Assuming contactId is passed in properties

    // Validate contactId: HubSpot IDs are numeric strings
    if (!contactId || !/^\d+$/.test(String(contactId))) {
        return {
            hsid: null,
            error: true,
            errormessage: 'Invalid contact ID format.'
        };
    }
    const inputArray = properties.contactinfo;
    let outputJson = {
        properties: {}
    };

    inputArray.forEach(item => {
        outputJson.properties[item.key] = item.value;
    });

    console.log(JSON.stringify(outputJson, null, 2));

    // Retrieve your HubSpot API key from context.keys
    const apiKey = context.keys['API Key'];

    // HubSpot API endpoint for updating contacts
    // Adjust the URL to include the contact ID
    const url = `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`;

    try {
        const response = await axios.patch(url, outputJson, {
            headers: {
                Authorization: `${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Contact updated:', response.data);

        return {
            hsid: contactId, // Return the same contact ID
            error: false,
            errormessage: null
        };
        
    } catch (error) {
        console.error('Error updating contact:', error);
        return {
            hsid: null,
            error: true,
            errormessage: error.message
        };
    }
}
