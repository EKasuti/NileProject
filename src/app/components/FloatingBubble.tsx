"use client"

import { v4 as uuidv4 } from 'uuid';

type WordCount = {
  word: string
  count: number
}

interface FloatingBubblesProps {
  data: WordCount[]
}

export default function FloatingBubbles({ data }: FloatingBubblesProps) {
  const maxCount = Math.max(...data.map((item) => item.count))
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
      {data.map((item, index) => {
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
  )
}

