import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import https from 'https';

const stopWords = new Set([
    "the", "a", "an", "and", "in", "on", "at", "to", "is", "it", "of", "for", "with", "as", 
    "by", "this", "that", "are", "was", "were", "be", "not", "or", "but", "from", "which", 
    "who", "whom", "their", "they", "his", "her", "its", "our", "you", "your", "he", 
    "she", "we", "us", "me", "my", "i", "so", "if", "then", "than", "because", "although", 
    "while", "where", "when", "what", "how", "all", "any", "some", "many", "much", 
    "few", "less", "more", "most", "such", "no", "yes", "like", "just", "over", "under", 
    "between", "above", "below", "around", "through", "after", "before", "during", "until", 
    "since", "while", "along", "across", "against", "without", "within", "beyond", "upon", 
    "about", "out", "up", "down", "left", "right", "back", "forward", "here", "there", "wherever", 
    "whenever", "whatever", "whoever", "whenever", "however", "whatever", "jquery", "href", "var",
    "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "first", "second", "third", "fourth", "fifth", "sixth",
    "nav", "been", "other", "have", "has", 
    "can", "will", "why",
    "nile", "project", "main"
]);

export async function POST(request: Request) {
    const { urls, wordCountLimit } = await request.json();
    const searchTerm = "Nile Project";

    const results: { url: string; title: string; commonWords: { word: string; count: number }[] }[] = [];

    try {
        console.log("Starting the scraping process...");

        for (const url of urls) {
            console.log(`Fetching data from: ${url}`);
            const { data } = await axios.get(url, {
                httpsAgent: new https.Agent({
                    // Bypass self-signed certificate error
                    rejectUnauthorized: false
                })
            });
            console.log(`Data fetched successfully from: ${url}`);

            const $ = cheerio.load(data);
            const pageText = $('body').text(); // Extract text from the body

            // Analyze common words for the current URL
            const commonWords = analyzeWords(pageText, wordCountLimit); // Pass wordCountLimit to analyzeWords
            results.push({ url, title: $('title').text(), commonWords });

            // Example: Scrape links and titles
            $('a').each((index, element) => {
                const link = $(element).attr('href');
                const title = $(element).text();

                if (link && title.toLowerCase().includes(searchTerm.toLowerCase())) {
                    console.log(`Found link: ${link} with title: ${title}`);
                }
            });
        }

        console.log("Scraping process completed successfully.");
        return NextResponse.json(results, { status: 200 });
    } catch (error) {
        console.error("Error during scraping:", error);
        return NextResponse.json({ message: 'Error scraping data' }, { status: 500 });
    }
}

// Function to analyze words and return common themes
function analyzeWords(text: string, wordCountLimit: number): { word: string; count: number }[] {
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g); // Extract words with length > 2 and exclude numbers
    const wordCount: { [key: string]: number } = {};

    if (words) {
        words.forEach(word => {
            if (!stopWords.has(word)) { // Exclude stop words
                wordCount[word] = (wordCount[word] || 0) + 1; // Count occurrences
            }
        });
    }

    // Sort words by frequency
    const sortedWords = Object.entries(wordCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, wordCountLimit); // Get top 'wordCountLimit' common words

    // Return an array of objects with word and count
    return sortedWords.map(([word, count]) => ({ word, count }));
}