// lib/fetchNews.ts
import axios from 'axios';
import * as cheerio from 'cheerio';

const NEWS_SOURCES = [
    'https://the-decoder.com/feed/',
    'https://venturebeat.com/category/ai/feed/',
    'https://huggingface.co/blog/feed.xml',
    'https://www.theverge.com/ai/rss/index.xml',
    'https://www.techcrunch.com/tag/ai/feed/',
    'https://www.technologyreview.com/topic/intelligent-machines/rss/',
    'https://spectrum.ieee.org/rss',
    'https://hackernoon.com/feed',
    'https://www.quora.com/rss/topics/24449/Artificial-intelligence',

    'https://arxiv.org/rss/cs.CL',

    'https://huggingface.co/blog/rss',
    'https://openai.com/blog/rss',
    'https://www.anthropic.com/news/rss',
];

const KEYWORDS = [
    'llm', 'large language model', 'gpt', 'gemini', 'claude', 'mistral', 'qwen',
    'llama', 'deepseek', 'chatgpt', 'ai', 'artificial intelligence', 'transformer',
    'fine-tuning', 'rag', 'agentic ai', 'ai agent', 'prompt engineering'
];


import fs from 'fs';

const filePath = 'server/public/AAA.json'; // Desired output file path


/***************************************************************

 interface FeedItem {
 title: string;
 link: string;
 description: string;
 pubDate: string;
 // Add other properties as needed based on the feed's structure
 }

 interface FeedData {
 items: FeedItem[];
 // Add other top-level feed properties if present
 }
 export async function fetchFeedData(feedUrl: string): Promise<FeedData | null> {
 try {
 const response = await fetch(feedUrl);

 if (!response.ok) {
 throw new Error(`HTTP error! status: ${response.status}`);
 }

 // If the feed is XML (common for RSS/Atom), you'll need to parse it
 // If the feed is JSON, use response.json()
 const textData = await response.text(); // Get raw text for XML parsing

 // Example for parsing XML (using DOMParser)
 const parser = new DOMParser();
 const xmlDoc = parser.parseFromString(textData, "application/xml");

 // Extract information from the XML document
 const items: FeedItem[] = [];https://www.technologyreview.com/topic/intelligent-machines/rss/

 xmlDoc.querySelectorAll('item').forEach(itemElement => {
 const title = itemElement.querySelector('title')?.textContent || '';
 const link = itemElement.querySelector('link')?.textContent || '';
 const description = itemElement.querySelector('description')?.textContent || '';
 const pubDate = itemElement.querySelector('pubDate')?.textContent || '';
 items.push({ title, link, description, pubDate });
 });

 return { items }; // Return the structured data
 } catch (error) {
 console.error("Error fetching or parsing feed:", error);
 return null;
 }
 }

 export async function fetchFF() {
 //const feedSiteUrl = "https://example.com/rss-feed.xml"; // Replace with your feed URL
 const feedSiteUrl = "https://www.techcrunch.com/tag/ai/feed/"; // Replace with your feed URL
 console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxz');
 fetchFeedData(feedSiteUrl).then(data => {
 if (data) {
 console.log("Feed items:", data.items);
 // Further process or display the feed items
 } else {
 console.log("Failed to retrieve feed data.");
 }
 });
 console.log('fffff')
 }


 ********************************/

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

export async function fetchLatestArticlesF(): Promise<any[]> {"excerpt"
    const allArticles: any[] = [];

    console.log('AAAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxz')
    const feeds = await Promise.all (
        NEWS_SOURCES.map(url =>
            axios.get(url)
                .then(response => {
                    console.log('uuuuuuuuURL axios Get :',url);
                    //console.log('dddddddData REPONSE:',response.data);
                    let j=1;
                    const $ = cheerio.load(response.data, { xmlMode: true });
                    const items: any[] = [];
                    console.log('lllllllllllllllllllLECTURE CHEERIO');
                    //const dataToSave=$;
                    //const jsonString = JSON.stringify(dataToSave, null, 2); // The '2' adds pretty-printing for readability
                    $('item').each((i, elem) => {
                        const title = $(elem).find('title').text().trim();
                        const urla = $(elem).find('link').text().trim();
                        const excerpt = $(elem).find('description').text().trim();
                        const publishedAt = $(elem).find('pubDate').text().trim();

                        const lowerTitle = title.toLowerCase();
                        const lowerDesc = excerpt.toLowerCase();
                        const hasKeyword = KEYWORDS.some(kw => lowerTitle.includes(kw) || lowerDesc.includes(kw));


                        let st: string = String(j)
                        if (hasKeyword && title && urla) {
                            items.push({
                                id:st,
                                title,
                                excerpt,
                                source: url.split('/')[2],
                                category: "Nouveau Article",
                                url: urla,
                                publishedAt,

                                //new Date(Date.now() - 3600000 * 36),

                            });
                        }

                        j=j+1;
                    });


                    const jsonString = JSON.stringify(items, null, 2);



                    /********
                     fs.writeFile(filePath, jsonString, (err) => {
                     if (err) {
                     console.error('Error writing JSON to file:', err);
                     } else {
                     console.log(`Data successfully written to ${filePath}`);
                     }
                     });
                     ***/

                    return items;
                })
                .catch( ()  => [])

        ));

    feeds.forEach(feed => allArticles.push(...feed));

    const uniqueArticles = Array.from(
        new Map(allArticles.map(a => [a.url, a])).values()
    );

    return uniqueArticles
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 12);
}