"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Play, Pause, Plus, Trash2 } from "lucide-react"

interface Caption {
  id: string
  startTime: number
  endTime: number
  text: string
}

export default function VideoPlayer() {
  const [videoUrl, setVideoUrl] = useState("")
  const [captions, setCaptions] = useState<Caption[]>([])
  const[showVideo,setShowVideo]=useState(false)
  const [currentCaption, setCurrentCaption] = useState("")
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [displayedCaption, setDisplayedCaption] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const setCurrentTimeAsStart = () => {
    setStartTime(currentTime)
  }

  const setCurrentTimeAsEnd = () => {
    setEndTime(currentTime)
  }

  const addCaption = () => {
    if(!currentCaption){
      alert("Please add caption")
    }
    if (currentCaption && startTime >= 0 && endTime > startTime) {
      const newCaption: Caption = {
        id: Date.now().toString(),
        startTime,
        endTime,
        text: currentCaption,
      }
      setCaptions([...captions, newCaption])
      setCurrentCaption("")
      setStartTime(0)
      setEndTime(0)
    }
  }
  const handleLoadbtn=()=>{
    setVideoUrl(videoUrl)
    setShowVideo(true)
    console.log("handle");
    
  }

  const removeCaption = (id: string) => {
    setCaptions(captions.filter((caption) => caption.id !== id))
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    const activeCaption = captions.find((caption) => currentTime >= caption.startTime && currentTime <= caption.endTime)
    setDisplayedCaption(activeCaption ? activeCaption.text : "")
  }, [currentTime, captions])
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoUrl]);

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Video Caption Player</h1>

      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Video URL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input placeholder="Enter video URL" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
              <Button onClick={()=>{handleLoadbtn()}}  className="cursor-pointer">Load</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {showVideo && (
        <div className="grid gap-6">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full"
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {displayedCaption && (
              <div className="absolute bottom-10 left-0 right-0 text-center">
                <div className="inline-block bg-black/70 text-white px-4 py-2 rounded text-lg">{displayedCaption}</div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={togglePlayPause} className="text-white hover:bg-white/20">
                  {isPlaying ? <Pause /> : <Play />}
                </Button>
                <div className="text-white">{formatTime(currentTime)}</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">Add Captions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="caption-text">Caption Text</Label>
                    <Textarea
                      id="caption-text"
                      placeholder="Enter caption text"
                      value={currentCaption}
                      onChange={(e) => setCurrentCaption(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-time">Start Time</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="start-time"
                          type="number"
                          min="0"
                          step="0.1"
                          value={startTime}
                          onChange={(e) => setStartTime(Number.parseFloat(e.target.value))}
                        />
                        <Button onClick={setCurrentTimeAsStart} variant="outline">
                          Current
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="end-time">End Time</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="end-time"
                          type="number"
                          min="0"
                          step="0.1"
                          value={endTime}
                          onChange={(e) => setEndTime(Number.parseFloat(e.target.value))}
                        />
                        <Button onClick={setCurrentTimeAsEnd} variant="outline">
                          Current
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button onClick={addCaption} className="w-full cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" /> Add Caption
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">Caption List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {captions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No captions added yet</p>
                  ) : (
                    captions.map((caption) => (
                      <div key={caption.id} className="flex items-start justify-between p-3 border rounded-md">
                        <div>
                          <div className="text-sm font-medium">
                            {formatTime(caption.startTime)} - {formatTime(caption.endTime)}
                          </div>
                          <div className="mt-1">{caption.text}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCaption(caption.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
