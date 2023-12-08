import {OpenAI, toFile} from 'openai';

interface OpenAIConfig {
  openAiOrganization: string;
  openAiApiKey: string;
}

export class OpenAIClient {
  private client: OpenAI;

  constructor(config: OpenAIConfig) {
    this.client = new OpenAI({
      apiKey: config.openAiApiKey,
      organization: config.openAiOrganization,
    });
  }

  public async sendQueryToChatGPT(query: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        messages: [{role: 'user', content: query}],
        model: 'gpt-3.5-turbo',
      });

      if (response?.choices) {
        return response.choices[0].message.content as string;
      } else {
        throw new Error('No response from ChatGPT');
      }
    } catch (error) {
      console.error('Error sending query to ChatGPT:', error);
      throw new Error(`Error sending query to ChatGPT: ${error}`);
    }
  }
  public async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    try {
      const file = await toFile(audioBuffer, 'audio.mp3');
      const transcriptionResponse = await this.client.audio.transcriptions.create({
        file: file,
        model: 'whisper-1',
      });
      return transcriptionResponse.text;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw new Error(`Error transcribing audio: ${error}`);
    }
  }

  public async convertTextToSpeech(text: string): Promise<Buffer> {
    try {
      const speechResponse = await this.client.audio.speech.create({
        model: 'tts-1',
        voice: 'alloy',
        input: text,
      });
      return Buffer.from(await speechResponse.arrayBuffer());
    } catch (error) {
      console.error('Error converting text to speech:', error);
      throw new Error(`Error converting text to speech: ${error}`);
    }
  }
}
