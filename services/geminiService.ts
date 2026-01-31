
import { GoogleGenAI, Type } from "@google/genai";
import { TimeEntry, Project } from "../types";

export const analyzeTimeReports = async (entries: TimeEntry[], projects: Project[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const dataSummary = entries.map(e => {
    const project = projects.find(p => p.id === e.projectId);
    return `Projekt: ${project?.name}, Timmar: ${e.hours}, Typ: ${e.workType}, Beskrivning: ${e.description}`;
  }).join("\n");

  const prompt = `Analysera följande tidrapporter för ett byggföretag och ge en sammanfattning på SVENSKA. Fokusera på projektframdrift, eventuella avvikelser (t.ex. mycket ÄTA-arbete eller övertid) och ge konkreta rekommendationer för projektledningen.
  
  Rapporter:
  ${dataSummary}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Övergripande sammanfattning" },
            efficiency: { type: Type.STRING, description: "Analys av effektivitet" },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Lista på åtgärder"
            }
          },
          required: ["summary", "efficiency", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return null;
  }
};
