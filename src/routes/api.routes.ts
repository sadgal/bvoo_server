// src1/routes/api.routes.ts
import { Router } from 'express';
import { fetchLatestArticlesF} from '../services/fetchNews';

//import { fetchLatestArticles } from '../services/rss.service';
//import { generateSummaryFromArticles, getOpenAIChatCompletion } from '../services/llm.service';
import {  getOpenAIChatCompletion } from '../services/llm.service';

//import { getModelsAndPlatforms } from '../services/models.service';
//import { getCommunityOpinions, submitPlatformFeedback } from '../services/feedback.service';

const router = Router();

// Cache simple en mémoire (à remplacer par Redis en prod)
//data = { summary, articles };
//

// let homeCache: { any; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

router.get('/home', async (req, res) => {
    try {
        const now = Date.now();
        /***
         if (homeCache && now - homeCache.timestamp < CACHE_TTL) {
         const rdata = { summary: 'Pas article',articles:[]};

         return res.json(rdata);
         }
         ***/
        const articles = await fetchLatestArticlesF();

        /************************************
         const summary = await generateSummaryFromArticles(
         articles.map(a => ({ title: a.title, summary: a.summary }))
         );
         *******************************/



        const summary1 = await getOpenAIChatCompletion(
            articles.map(a => ({ title: a.title, summary : a.excerpt }))
        );


        const summary = summary1 || 'Pas de Synthèse';


        //const summary='Pas de synthèse'
        const data = { summary, articles };
        //homeCache = { data, timestamp: now };
        res.json(data);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/*****************************************************************************
 router.get('/models-platforms', (req, res) => {
 try {
 const data = getModelsAndPlatforms();
 res.json(data);
 } catch (err: any) {
 res.status(500).json({ error: err.message });
 }
 });

 router.get('/compare', (req, res) => {
 try {
 const data = getModelsAndPlatforms();
 res.json(data);
 } catch (err: any) {
 res.status(500).json({ error: err.message });
 }
 });

 router.get('/community-opinions', (req, res) => {
 try {
 const opinions = getCommunityOpinions();
 res.json(opinions);
 } catch (err: any) {
 res.status(500).json({ error: err.message });
 }
 });

 router.post('/feedback', (req, res) => {
 try {
 const feedback = submitPlatformFeedback(req.body);
 res.status(201).json(feedback);
 } catch (err: any) {
 res.status(500).json({ error: err.message });
 }
 });
 ********************************************************************/

export default router;