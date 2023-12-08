import {OpenAIClient} from '../connections/connections/openApi';

exports.handler = async (event: any) => {
  try {
    // Parse the incoming event to get the audio data
    const audioBuffer = Buffer.from(event.body, 'base64');

    // Initialize your OpenAI client
    const openAiClient = new OpenAIClient({
      openAiOrganization: process.env.OPENAI_ORGANIZATION as string,
      openAiApiKey: process.env.OPENAI_API_KEY as string,
    });

    // Transcribe the audio
    const transcribedText = await openAiClient.transcribeAudio(audioBuffer);

    // Send the transcribed text to ChatGPT
    const chatGptResponse = await openAiClient.sendQueryToChatGPT(transcribedText);

    // Convert the ChatGPT response to speech
    const speechAudioBuffer = await openAiClient.convertTextToSpeech(chatGptResponse);

    // Return the speech audio buffer in the response
    return {
      statusCode: 200,
      headers: {'Content-Type': 'audio/mpeg'},
      body: speechAudioBuffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({error: 'Internal server error'}),
    };
  }
};
