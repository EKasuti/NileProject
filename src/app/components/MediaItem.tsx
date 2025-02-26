"use client"

import { Video, Mic, Film } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type MediaItemProps = {
  type: "video" | "music" | "film" |  "website"
  category: "interview" | "music video" | "interview" | "documentary" | "bts" | "article"
  title: string
  url: string
  description: string
}

export default function MediaItem({ type, title, url, category, description }: MediaItemProps) {
  const Icon = type === "video" ? Video : category === "interview" ? Mic : Film
  const [isOpen, setIsOpen] = useState(false); 
  const handleOpen = () => setIsOpen(true);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex items-center mb-2">
        <Icon className="mr-2 dark:text-gray-300" />
        <h3 className="text-lg font-semibold dark:text-white">{title}</h3>
      </div>
      
      <div className="mb-4">
        {type === "video" ? (
          <iframe
            width="100%"
            height="200"
            src={url}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        ) : type === "music" ? (
          <audio controls className="w-full">
            <source src={url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        ) : (
          <Link href={url}>
            <Button variant="outline">
              Visit {type}
            </Button>
          </Link>
        )}
      </div>

      {type !== "website" && (
        <Button variant="default" className="text-white bg-primary" onClick={handleOpen}>
          More Information
        </Button>
      )}

      {/* Dialog for more information */}
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4" id="building-details-description">
              <p><strong>Category:</strong> {category} </p>
              <p className="text-muted-foreground">{description}</p>
              <Button variant="default" className="text-white">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

