"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { websiteUrls } from "./data/websites";
import { v4 as uuidv4 } from 'uuid';

interface CommonWord {
  word: string;
  count: number;
}

interface WebsiteData {
  url: string;
  title: string;
  commonWords: CommonWord[];
}

export default function Home() {
    const [webData, setWebData] = useState<WebsiteData[]>([])
    const [wordCountLimit, setWordCountLimit] = useState<number>(8)

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

  // Helper functions for FloatingBubbles
  const maxCount = Math.max(...commonWordsData.map((item) => item.count))
  const minSize = 50
  const maxSize = 150

  const calculateSize = (count: number) => {
    return minSize + (count / maxCount) * (maxSize - minSize)
  }

  const getRandomPosition = (size: number, existingPositions: { left: number; top: number }[]) => {
    let position: { left: number; top: number };
    let collision;
    do {
      position = {
        left: Math.random() * 90,
        top: Math.random() * 70,
      };
      collision = existingPositions.some(existing => {
        const distance = Math.sqrt(
          Math.pow(position.left - existing.left, 2) + Math.pow(position.top - existing.top, 2)
        );
        return distance < size;
      });
    } while (collision);
    return position;
  }

  const getRandomAnimation = () => {
    const animations = ["float1", "float2", "float3"]
    return animations[Math.floor(Math.random() * animations.length)]
  }

  const getRandomDelay = () => {
    return Math.random() * -20
  }

  const getColor = (index: number) => {
    const colors = [
      "bg-blue-500/30 dark:bg-blue-500/20",
      "bg-purple-500/30 dark:bg-purple-500/20",
      "bg-green-500/30 dark:bg-green-500/20",
      "bg-pink-500/30 dark:bg-pink-500/20",
      "bg-yellow-500/30 dark:bg-yellow-500/20",
    ]
    return colors[index % colors.length]
  }

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
          <div className="relative h-full w-full overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900">
            <style jsx>{`
              @keyframes float1 {
                0%, 100% { transform: translate(0, 0); }
                25% { transform: translate(10%, -15%); }
                50% { transform: translate(-5%, 10%); }
                75% { transform: translate(-15%, -5%); }
              }
              @keyframes float2 {
                0%, 100% { transform: translate(0, 0); }
                25% { transform: translate(-15%, 10%); }
                50% { transform: translate(10%, -5%); }
                75% { transform: translate(5%, 15%); }
              }
              @keyframes float3 {
                0%, 100% { transform: translate(0, 0); }
                25% { transform: translate(15%, 15%); }
                50% { transform: translate(-10%, -10%); }
                75% { transform: translate(5%, -15%); }
              }
              .bubble {
                position: absolute;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                animation-duration: 20s;
                animation-iteration-count: infinite;
                animation-timing-function: ease-in-out;
                transition: all 0.3s ease;
                cursor: pointer;
                backdrop-filter: blur(8px);
                border: 1px solid rgba(255, 255, 255, 0.1);
              }
              .bubble:hover {
                transform: scale(1.1);
                z-index: 10;
              }
            `}</style>
            {commonWordsData.map((item, index) => {
              const size = calculateSize(item.count)
              const position = getRandomPosition(size, [])
              const fontSize = size * 0.1
              return (
                <div
                  key={uuidv4()}
                  className={`bubble ${getColor(index)}`}
                  style={{
                    width: size,
                    height: size,
                    left: `${position.left}%`,
                    top: `${position.top}%`,
                    animationName: getRandomAnimation(),
                    animationDelay: `${getRandomDelay()}s`,
                  }}
                >
                  <div className="p-2" style={{ fontSize: `${fontSize}px` }}>
                    <p className="font-semibold text-gray-800 dark:text-white">{item.word}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{item.count}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}