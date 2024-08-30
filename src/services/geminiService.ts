import { GoogleAIFileManager } from '@google/generative-ai/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'node:fs';
import os from 'node:os';
import detect from 'magic-bytes.js';

dotenv.config();

class GeminiService {
  private fileManager: GoogleAIFileManager;
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async uploadImage(base64Image: string, displayName: string) {
    const buffer = Buffer.from(base64Image, 'base64');    
    const [fileType] = detect(buffer);
    const mimeType = fileType?.mime || 'application/octet-stream';

    const tempFilePath = `${os.tmpdir()}/${displayName}`;

    fs.writeFileSync(tempFilePath, buffer);

    try {
      const uploadResponse = await this.fileManager.uploadFile(tempFilePath, {
        mimeType,
        displayName
      });

      return uploadResponse;
    } finally {
      fs.unlinkSync(tempFilePath);
    }
  }

  async getMeasurementFromImage(base64Image: string, displayName: string) {
    const uploadResponse = await this.uploadImage(base64Image, displayName);
    const imageUrl = uploadResponse.file.uri;

    const model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
    }); 

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: imageUrl,
        },
      },
      { text: 'Extraia a medição numérica desta imagem, ignorando qualquer texto. Apenas forneça um número inteiro correspondente à medição.' }
    ]);

    const measureValue = result.response.text();

    return { 
        measureValue,
        imageUrl,
     };
  }
}

export default GeminiService;
