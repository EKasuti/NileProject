"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import FloatingBubbles from "./components/FloatingBubble";

interface CommonWord {
  word: string;
  count: number;
}

interface WebsiteData {
  url: string;
  title: string;
  commonWords: CommonWord[];
}

export const websiteUrls = [
    "https://www.dandc.eu/en/article/multinational-music-collective-nile-project-sang-many-styles-and-languages-about-life-along",
    "https://belonging.berkeley.edu/transcending-borders-through-music-interview-alsarah-nile-project",
    "https://southwritlarge.com/articles/the-nile-project-interview-with-mina-girgis/"
]

export default function Home() {
    const [webData, setWebData] = useState<WebsiteData[]>([])
    const [wordCountLimit, setWordCountLimit] = useState<number>(20)

    // Fetch website data when wordCountLimit changes
    useEffect(() => {
        const fetchWebData = async () => {
            try {
                const response = await fetch("/api/scrape/website", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        urls: websiteUrls,
                        wordCountLimit: wordCountLimit,
                    }),
                })
                const data = await response.json()
                setWebData(data)
            } catch (error) {
                console.error("Error fetching website data", error)
            }
        }

        fetchWebData()
    }, [wordCountLimit])
  // Extract common words for FloatingBubbles
  const commonWordsData: CommonWord[] = webData.flatMap((data) => data.commonWords)

  return (
    <div className="space-y-8 h-full">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">System Data Visualization</h2>

        {/* Word count limit input */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex flex-row">
            <label htmlFor="wordCountLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Word Count Limit
            </label>
            <input
              type="number"
              id="wordCountLimit"
              value={wordCountLimit}
              onChange={(e) => setWordCountLimit(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="1"
            />
          </div>

          {/* Filter */}
          <Button>Filter System Data</Button>
        </div>

        {/* Floating bubbles */}
        <div className="h-[600]">
          <FloatingBubbles data={commonWordsData} />
        </div>
      </div>
    </div>
  )
}