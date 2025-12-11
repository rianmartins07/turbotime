'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import NoteCard from '@/components/NoteCard';
import { notesAPI, getToken } from '@/api';

function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  
  // Reset time to midnight for accurate day comparison
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  // Calculate difference in days
  const diffTime = nowOnly - dateOnly
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

export default function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [notes, setNotes] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const loadDashboardData = async (categoryFilter = null) => {
    try {
      setIsLoading(true)
      setError('')

      const token = getToken()
      if (!token) {
        router.push('/registration')
        setIsLoading(false)
        return
      }

      const categoriesData = await notesAPI.getCategories()
      setCategories(categoriesData)
      
      const categoryColorMap = {}
      categoriesData.forEach(cat => {
        categoryColorMap[cat.name] = cat.color
      })

      const notesData = await notesAPI.getAll(categoryFilter)

      const processedNotes = notesData.results || notesData
      const formattedNotes = processedNotes.map(note => {
        const category = note.category || 'Random Thoughts'
        const categoryColor = categoryColorMap[category] || categoriesData[0]?.color || '#ef9c66'
        
        return {
          id: note.id,
          date: formatDate(note.created_at),
          category: category,
          categoryColor: categoryColor,
          title: note.title,
          content: note.content,
          backgroundColor: `${categoryColor}7f`,
          borderColor: categoryColor,
          created_at: note.created_at,
          updated_at: note.updated_at,
        }
      })

      setNotes(formattedNotes)
    } catch (err) {
      setError(err.message || 'Failed to load notes')
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        router.push('/registration')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const categoryFilter = selectedCategory === 'all' ? null : selectedCategory
    loadDashboardData(categoryFilter)
  }, [selectedCategory])

  const handleNewNote = () => {
    router.push('/dashboard/note/new')
  }

  const handleNoteClick = (noteId) => {
    router.push(`/dashboard/note/${noteId}`)
  }

  const handleCategoryClick = (categoryName) => {
    if (categoryName === 'all' || categoryName.toLowerCase() === 'all') {
      setSelectedCategory('all')
    } else {
      setSelectedCategory(categoryName)
    }
  }

  return (
    <main className="w-full bg-[#faf1e3] min-h-screen">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center items-center pt-[19px] sm:pt-[28px] lg:pt-[38px]">
          
          <div className="w-full flex flex-col gap-[9px] sm:gap-[14px] lg:gap-[18px] justify-start items-end self-end mb-4 sm:mb-6 lg:mb-8">
            <div className="w-auto">
              <Button
                text="New Note"
                text_font_size="16px"
                text_font_family="Inria Serif"
                text_font_weight="700"
                text_line_height="20px"
                text_color="#957139"
                border_border="1px solid #957139"
                border_border_radius="20px"
                padding="10px 16px 10px 38px"
                layout_gap="6px"
                onClick={handleNewNote}
                className="flex items-center gap-[6px]"
              >
                <Image 
                  src="/images/img_iconography_caesarzkn_lime_900_01.svg" 
                  alt="New Note Icon"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
                New Note
              </Button>
            </div>

            <div className="w-full flex flex-col lg:flex-row justify-end items-start ml-1">
              
              <div className="w-full lg:w-[22%] flex flex-col gap-4 lg:gap-[16px] justify-start items-start mt-2 lg:mt-[8px] mb-6 lg:mb-0">

                <div className="w-full lg:w-[82%] flex flex-col gap-4 lg:gap-[16px] justify-start items-center">
                  <div 
                    className="w-full flex flex-row justify-between items-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleCategoryClick('all')}
                  >
                    <span className="text-[12px] font-inter leading-normal tracking-normal text-left text-black font-bold">
                      All Categories
                    </span>
                  </div>
                  
                  {categories.map((category, index) => (
                    <div 
                      key={index}
                      className="w-full flex flex-row justify-between items-center cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      <div className="flex flex-row justify-start items-center flex-1">
                        <div 
                          className="w-[10px] h-[10px] rounded-[4px]"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className={`text-[12px] font-inter font-normal leading-normal tracking-normal text-left text-black ml-2 ${
                          selectedCategory === category.name ? 'font-bold' : ''
                        }`}>
                          {category.name}
                        </span>
                      </div>
                      {(category.count ?? 0) > 0 && (
                        <span className={`text-[12px] font-inter font-normal leading-normal tracking-normal text-left text-black ${
                          selectedCategory === category.name ? 'font-bold' : ''
                        }`}>
                          {category.count}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full lg:flex-1 flex flex-col gap-4 lg:gap-[16px] justify-start items-start self-center">
                {isLoading && (
                  <div className="w-full text-center py-8">
                    <p className="text-[#88632a]">Loading notes...</p>
                  </div>
                )}
                
                {error && !isLoading && (
                  <div className="w-full p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                    {error}
                  </div>
                )}
                
                {!isLoading && !error && (
                  <div className="w-full">
                    {notes.length === 0 ? (
                      <div className="w-full flex flex-col items-center justify-center py-8 lg:py-16">
                        <Image 
                          src="/images/coffe.png" 
                          alt="Coffee waiting for notes"
                          width={200}
                          height={200}
                          className="mb-6"
                        />
                        <p className="text-[#88632a] text-center text-lg font-inria">
                          I'm just here waiting for your charming notes...
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-[16px]">
                        {notes.map((note) => (
                          <NoteCard
                            key={note.id}
                            note={note}
                            onClick={handleNoteClick}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}