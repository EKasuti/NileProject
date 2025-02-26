"use client"

import { useState } from 'react';
import MediaItem from "../components/MediaItem"
import { libraryItems } from "../data/library"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Library() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Function to handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Filter library items based on selected category
  const filteredItems = selectedCategory === 'all' 
    ? libraryItems 
    : libraryItems.filter(item => item.category === selectedCategory);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Media Library</h1>
      
      <div className='mb-4'>
        {/* Category Filter Select */}
        <Select onValueChange={handleCategoryChange} defaultValue="all">
          <SelectTrigger className="w-64  backdrop-blur-sm text-black border">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="music video">Music Videos</SelectItem>
            <SelectItem value="interview">Interviews</SelectItem>
            <SelectItem value="article">Articles</SelectItem>
            <SelectItem value="documentary">Documentaries</SelectItem>
            <SelectItem value="bts">Behind the Scenes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <MediaItem key={index} {...item} />
        ))}
      </div>
    </div>
  )
}

