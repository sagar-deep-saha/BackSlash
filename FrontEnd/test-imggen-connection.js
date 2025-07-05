/**
 * Test script to verify FrontEnd connection to hosted IMGGEN service
 * Run with: node test-imggen-connection.js
 */

import axios from 'axios';

async function testIMGGENConnection() {
  console.log('🧪 Testing FrontEnd connection to hosted IMGGEN service...\n');

  const testPrompt = 'A beautiful sunset over mountains';
  
  try {
    console.log(`📝 Testing with prompt: "${testPrompt}"`);
    console.log('🌐 Connecting to: https://imggen-amber.vercel.app/api/generate-image');
    
    const response = await axios.post(
      'https://imggen-amber.vercel.app/api/generate-image',
      { prompt: testPrompt },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sagar_1234567890123456'
        },
        responseType: 'arraybuffer',
        timeout: 120000
      }
    );

    if (response.status === 200 && response.data) {
      const imageBuffer = Buffer.from(response.data);
      console.log('✅ Success! Connected to hosted IMGGEN service');
      console.log(`📊 Image size: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
      console.log(`🎨 Generation method: ${response.headers['x-generation-method'] || 'unknown'}`);
      console.log(`🔗 Service URL: ${response.config.url}`);
      console.log('\n🎉 FrontEnd is ready to use the hosted IMGGEN service!');
    } else {
      console.log(`❌ Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Connection failed:');
    console.log(`   Error: ${error.message}`);
    
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Status Text: ${error.response.statusText}`);
      
      if (error.response.data) {
        try {
          const errorText = error.response.data.toString();
          console.log(`   Response: ${errorText}`);
        } catch {
          console.log('   Response: [Binary data]');
        }
      }
    }
    
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if the IMGGEN service is deployed and running');
    console.log('2. Verify the API key is correct');
    console.log('3. Check if the service URL is accessible');
    console.log('4. Ensure CORS is properly configured on the hosted service');
  }
}

// Run the test
testIMGGENConnection().catch(console.error); 