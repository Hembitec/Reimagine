
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { ChatMessage, AppMode, SuggestedStyle } from "../types";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || 'MISSING_KEY' });

/**
 * Professional Prompt Builder
 * Constructs a high-fidelity prompt based on mode, analysis, and intent.
 */
const buildProfessionalPrompt = (mode: AppMode, basePrompt: string, analysis?: string, referenceDescription?: string) => {
    let systemRole = "";
    let technicalSpecs = "8k resolution, photorealistic, highly detailed, professional lighting, depth of field, sharp focus";
    
    if (mode === 'interior') {
        systemRole = "Interior Design Visualization. Preserve structural integrity (walls, ceiling, floor plan).";
    } else if (mode === 'product') {
        systemRole = "High-End Product Photography. Product is the hero. Perfect commercial lighting.";
    } else {
        systemRole = "Brand Asset Creation. Seamless integration of logo/art onto surface.";
    }

    // Combine elements
    let prompt = `${systemRole} ${basePrompt}.`;
    
    // Only add text reference if provided and we aren't doing direct image-to-image style transfer
    if (referenceDescription) {
        prompt += ` MATCH STYLE OF REFERENCE: ${referenceDescription}.`;
    }
    
    if (analysis) {
        // Use analysis to ensure lighting consistency
        prompt += ` Ensure lighting matches subject: ${analysis}.`;
    }

    prompt += ` ${technicalSpecs}.`;
    return prompt;
};

export const analyzeStyleReference = async (base64Image: string): Promise<string> => {
    try {
        const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
        const prompt = `
            Act as a professional Visual Director. 
            Analyze the provided reference image to extract a comprehensive "Style DNA" for a style transfer task.

            Deconstruct the image into these core visual pillars:
            1. **Lighting Design**: Precise setup (e.g., "Soft north-facing window light", "High-contrast studio rim lighting", "Warm candlelight", "Cyberpunk neon"). Note shadows and highlights.
            2. **Color Science**: Specific palette and grading (e.g., "Desaturated sage and cream", "Vibrant Wes Anderson pastels", "Moody teal and orange", "Monochromatic grayscale").
            3. **Material Physics**: Dominant textures (e.g., "Rough hewn timber", "Polished Carrara marble", "Distressed leather", "Brushed aluminum").
            4. **Atmosphere**: The intangible mood (e.g., "Serene and airy", "Oppressive and dark", "Luxurious and sterile", "Rustic and cozy").

            **OUTPUT DIRECTIVE**:
            Combine these into a dense, high-fidelity descriptive paragraph. 
            Do NOT mention the subject matter (e.g. do not say "a living room with a sofa"). 
            ONLY describe the *aesthetic qualities* so they can be applied to *any* subject.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { data: cleanBase64, mimeType: 'image/jpeg' } },
                    { text: prompt }
                ]
            }
        });

        return response.text || "Professional studio lighting, high fidelity.";
    } catch (error) {
        console.error("Style analysis failed:", error);
        return "Professional studio lighting, high fidelity.";
    }
};

export const analyzeImageAndSuggestStyles = async (base64Image: string, mode: AppMode): Promise<SuggestedStyle[]> => {
    try {
        const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
        
        let prompt = "";
        if (mode === 'interior') {
            prompt = `Analyze this room. Identify the room type and key architectural features. Suggest 4 distinct redesign styles that respect the geometry.`;
        } else if (mode === 'product') {
            prompt = `Analyze this product. Identify what it is (e.g. perfume, shoe, drink). Suggest 4 distinct advertising backgrounds that fit this specific product perfectly.`;
        } else {
            prompt = `Analyze this image (Logo or Art). Suggest 4 creative mockup placements (e.g. on a building, a hoodie, a coffee cup) that would look professional.`;
        }

        prompt += ` Return JSON: [{ "label": "Short Title", "description": "Why it fits", "prompt": "Full generation prompt", "color": "Tailwind gradient class (e.g. from-blue-500 to-cyan-500)" }]`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { data: cleanBase64, mimeType: 'image/jpeg' } },
                    { text: prompt }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            label: { type: Type.STRING },
                            description: { type: Type.STRING },
                            prompt: { type: Type.STRING },
                            color: { type: Type.STRING }
                        },
                        required: ["label", "description", "prompt", "color"]
                    }
                }
            }
        });

        const jsonStr = response.text;
        if (!jsonStr) throw new Error("No JSON");
        
        const data = JSON.parse(jsonStr);
        return data.map((d: any, i: number) => ({ id: `sugg-${Date.now()}-${i}`, ...d }));

    } catch (error) {
        console.error("Analysis failed", error);
        // Fallback
        return [{ id: 'err', label: 'Modern Studio', description: 'Clean and professional', prompt: 'Modern studio setting, neutral background', color: 'from-gray-500 to-gray-700' }];
    }
};

export const generateDesign = async (
    base64Image: string, 
    prompt: string, 
    mode: AppMode,
    referenceImage?: string | null,
    aspectRatio: string = "1:1"
): Promise<string> => {
    try {
        const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
        
        // Prepare the Parts array for the API
        const parts: any[] = [
            { inlineData: { data: cleanBase64, mimeType: 'image/jpeg' } } // Image 1: Subject
        ];

        let finalInstruction = prompt;

        // MULTIMODAL STYLE TRANSFER
        // If a reference image exists, we pass BOTH images to the model.
        if (referenceImage) {
            const cleanRef = referenceImage.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
            parts.push({ inlineData: { data: cleanRef, mimeType: 'image/jpeg' } }); // Image 2: Style Reference
            
            // We override the prompt to strictly instruct the model on how to use the two images.
            finalInstruction = `
                Image 1 is the SUBJECT (Preserve the structure, layout, and key product/room details).
                Image 2 is the STYLE REFERENCE (Transfer the lighting, color palette, texture, and mood).
                
                Task: ${prompt}.
                Strictly apply the visual style of Image 2 onto Image 1.
                Maintain the perspective and geometry of Image 1.
            `;
        }

        const fullPrompt = buildProfessionalPrompt(mode, finalInstruction);
        parts.push({ text: fullPrompt });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image', // Supports multi-image input
            contents: {
                parts: parts
            },
            config: {
                responseModalities: [Modality.IMAGE],
                imageConfig: {
                    aspectRatio: aspectRatio as any
                }
            }
        });

        const resultParts = response.candidates?.[0]?.content?.parts;
        if (resultParts) {
            for (const part of resultParts) {
                if (part.inlineData?.data) {
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
        }
        throw new Error("No image generated");

    } catch (error) {
        console.error("Generation failed", error);
        throw error;
    }
};

export const chatWithExpert = async (
  history: ChatMessage[],
  newMessage: string,
  mode: AppMode,
  currentImage?: string | null
): Promise<string> => {
    // ... existing chat logic ...
    const chatHistory = history
      .filter(msg => msg.role !== 'system' && msg.type === 'text')
      .map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));

    // Updated system instruction to ENFORCE button generation
    const systemInstruction = `
        You are an expert design consultant for ${mode}. 
        Keep answers concise, professional, and helpful.
        
        CRITICAL RULE FOR SUGGESTIONS:
        Whenever you suggest a specific visual style, color change, or design modification, you MUST enable the user to visualize it by appending a tag in this exact format: [VISUALIZE: Style Name].
        
        Examples:
        - "I suggest a [VISUALIZE: Warm Industrial] look for this room."
        - "You could try [VISUALIZE: Soft Pastel Lighting] or maybe [VISUALIZE: Dramatic Noir]."
        
        Do not output markdown links for generation, use the [VISUALIZE: ...] tag.
    `;

    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: chatHistory,
      config: { systemInstruction }
    });

    const parts: any[] = [{ text: newMessage }];
    if (currentImage) {
        parts.push({
            inlineData: {
                data: currentImage.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, ''),
                mimeType: 'image/jpeg',
            }
        });
    }

    const result = await chat.sendMessage({ message: parts });
    return result.text || "I couldn't generate a response.";
};

// Re-export old functions for compatibility
export const analyzeProduct = analyzeImageAndSuggestStyles; 
export const analyzeRoom = analyzeImageAndSuggestStyles;
