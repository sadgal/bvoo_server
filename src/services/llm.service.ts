// src1/services/llm.service.ts
import axios from 'axios';

import * as dotenv from 'dotenv';

dotenv.config();


import OpenAI from "openai";

//import { NextRequest, NextResponse } from 'next/server';

interface article {
    id: string,
    title: string,
    excerpt: string,
    source: string,
    category: string,
    url: string,
    publishedAt: Date
}



const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2:7b';



interface ChatCompletionRequest {
    model: string;
    messages: { role: "system" | "user" | "assistant"; content: string }[];
    temperature?: number;
}

interface ChatCompletionResponse {
    id: string;
    choices: { message: { role: "assistant"; content: string } }[];
}


///////////////////////////////////////////////////////////////////
// local_llm
/////////////////////////////////////////////////////////////////

/********************************************************

 export async function generateSummaryFromArticles(articles: { title: string; summary: string }[]): Promise<string> {

 try {

 const prompt = `
 Résume en 120 mots maximum les tendances récentes en intelligence artificielle à partir des titres et résumés suivants.
 Mets en avant les nouveaux modèles, les plateformes populaires, et les sujets dominants.

 Articles :
 ${articles.map(a => `- ${a.title}: ${a.summary}`).join('\n')}
 `.trim();
 console.log('ollama_url:', `${OLLAMA_URL}`);
 console.log('ollama_model:', `${OLLAMA_MODEL}`);

 const ollam
 export async function getOpenAIChatCompletion0(articles: { title: string; summary: string }[]): Promise<string> {

 console.log('OPENAI')

 const prompt = `
 Résume en 120 mots maximum les tendances récentes en intelligence artificielle à partir des titres et résumés suivants.
 Mets en avant les nouveaux modèles, les plateformes populaires, et les sujets dominants.

 Articles :
 ${articles.map(a => `- ${a.title}: ${a.summary}`).join('\n')}
 `.trim();


 const requestBody: ChatCompletionRequest = {
 model: "gpt-3.5-turbo",
 messages: [{ role: "user", content: prompt }],
 };

 const response = await fetch("https://api.openai.com/v1/chat/completions", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 Authorization: `Bearer YOUR_OPENAI_API_KEY`,
 },
 body: JSON.stringify(requestBody),
 });


 const data: ChatCompletionResponse = await response.json();
 console.log('SUMMARY:',data.choices[0].message.content)
 return data.choices[0].message.content;
 }

 aResponse = await fetch('http://localhost:11434/api/generate', {
 method: 'POST',
 headers: {'Content-Type': 'application/json'},
 body: JSON.stringify({
 model: 'qwen2:7b',
 //model: 'Qwen3-4B:latest',
 //model: 'Qwen3-14B:latest',
 prompt,
 stream: false,
 options: {temperature: 0.7, top_p: 0.9, max_tokens: 300}
 })
 });

 if (!ollamaResponse.ok) {
 throw new Error(`Ollama error: ${ollamaResponse.status}`);
 }
 const data = await ollamaResponse.json();

 console.log('SUMMARY:', data.Response);
 const summary =  data.response?.trim() || "Synthèse non disponible.";
 console.log('SUMMARY trim:', summary);

 return summary;

 }catch (error: any) {
 console.error("❌ Erreur dans /api/home :", error.message);
 return Response.json({
 summary: "❌ Impossible de générer la synthèse. Vérifiez que Ollama est lancé avec : ollama run qwen2:7b",
 }, { status: 500 });
 }





 }

 *************************************************/




//////////////////////////////////////////////////////////////////////////////////////
////    LLMS sur OPENROUTER
//////////////////////////////////////////////////////////////
// Assurez-vous de remplacer ces placeholders par vos valeurs réelles

//const OPENROUTER_API_KEY ="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";
//const OPENROUTER_API_KEY ="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";
//const OPENROUTER_API_KEY ="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";
//const OPENROUTER_API_KEY ="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",
const OPENROUTER_API_KEY="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"



const YOUR_SITE_URL = "<YOUR_SITE_URL>"; // Optionnel
const YOUR_SITE_NAME = "<YOUR_SITE_NAME>"; // Optionnel

const openrouter_apikey = process.env.OPENROUTER_API_KEY || OPENROUTER_API_KEY;
console.log('openrouter_apikey:',openrouter_apikey);
const client = new OpenAI({
    // Configuration de l'URL de base pour OpenRouter
    baseURL: "https://openrouter.ai/api/v1",
    // Utilisation de la clé d'API d'OpenRouter
    apiKey: openrouter_apikey,
});


export async function getOpenAIChatCompletion(articles: { title: string; summary: string }[]): Promise<any> {




    const context = articles.map(a => `- ${a.title}\n  Résumé: ${a.summary.slice(0, 150)}...\n`).join('\n');

    /************     FRANCAIS
     const prompt = `
     Voici une liste d'articles récents sur l'intelligence artificielle et les modèles de langage (LLM).
     Faites une synthèse claire, concise et professionnelle (max 150 mots) en français, en mettant en avant :
     - Les principales nouvelles
     - Les acteurs clés (OpenAI, Google, Anthropic, Alibaba, etc.)
     - Les tendances émergentes (agents IA, RAG, fine-tuning, etc.)

     Articles :
     ${context}

     Réponse en anglais, sans titre, en style journalistique.
     `;

     ****************************/


        // console.log(`COMPLETION: ${JSON.stringify(prompt)}`);
    const prompt = `
    Here is a list of recent articles on artificial intelligence and large language models (LLMs).
        Provide a clear, concise, and professional summary (maximum 150 words) in French, highlighting:
    - The main news
    - The key players (OpenAI, Google, Anthropic, Alibaba, etc.)
    - Emerging trends (AI agents, RAG, fine-tuning, etc.)

    Articles:
        ${context}

    Answer in English, without a title, in a journalistic style.

  `;



    // const model_llm = "alibaba/tongyi-deepresearch-30b-a3b:free";
    //const model_llm ="minimax/minimax-m2:free";
    //   const model_llm ="nvidia/nemotron-nano-12b-v2-vl:free";
    //////  const model_llm ="deepseek/deepseek-chat-v3.1:free";
    const model_llm ="openai/gpt-oss-20b:free";
    //    const model_llm ="qwen/qwen3-coder:free";
    //////const model_llm ="moonshotai/kimi-k2:free";
    /////   const model_llm ="tngtech/deepseek-r1t2-chimera:free";
    ////// const model_llm ="moonshotai/kimi-dev-72b:free";
    ////   const model_llm ="qwen/qwen3-30b-a3b:free";


    console.log('COMPLETION: ....avec :',model_llm)
    try {
        const completion = await client.chat.completions.create({
            // Configuration des en-têtes HTTP supplémentaires via l'option 'headers'
            // Note: extra_headers dans Python devient 'headers' dans TypeScript

            // extra_body dans Python devient 'extraBody' dans TypeScript
            //extraBody: {},
            model: model_llm,
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });
        console.log("REPONSE de :",model_llm);

        // Affichage du contenu de la réponse
        let rep  = completion.choices[0].message.content;
        console.log(completion.choices[0].message.content);
        return rep;

    } catch (error) {
        console.error("An error occurred during the OpenAI API call:", error);
    }
}