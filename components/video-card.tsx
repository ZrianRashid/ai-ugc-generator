'use client'

import { useState } from 'react'
import { Video, Download, Clock, CheckCircle, AlertCircle, Loader2, FileText } from 'lucide-react'
import { cn, formatDateTime } from '@/lib/utils'
import type { Database } from '@/types/supabase'

type Video = Database['public']['Tables']['videos']['Row']

interface VideoCardProps {
  video: Video
}

export function VideoCard({ video }: VideoCardProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (!video.video_url) return
    
    setIsDownloading(true)
    try {
      const response = await fetch(video.video_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ugc-video-${video.id.slice(0, 8)}.mp4`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const getStatusIcon = () => {
    switch (video.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'processing':
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-destructive" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusText = () => {
    switch (video.status) {
      case 'completed':
        return 'Ready'
      case 'processing':
        return 'Generating...'
      case 'failed':
        return 'Failed'
      default:
        return 'Pending'
    }
  }

  const getStatusColor = () => {
    switch (video.status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'processing':
        return 'bg-primary/10 text-primary border-primary/20'
      case 'failed':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden group">
      {/* Video Thumbnail or Placeholder */}
      <div className="aspect-video bg-muted relative">
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title || 'Video thumbnail'}
            className="w-full h-full object-cover"
          />
        ) : video.video_url && video.status === 'completed' ? (
          <video
            src={video.video_url}
            className="w-full h-full object-cover"
            poster="/video-placeholder.jpg"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={cn(
              'h-16 w-16 rounded-full flex items-center justify-center mb-3',
              video.status === 'completed' ? 'bg-green-500/10' :
              video.status === 'processing' ? 'bg-primary/10' :
              video.status === 'failed' ? 'bg-destructive/10' :
              'bg-muted'
            )}>
              {video.status === 'completed' ? (
                <Video className="h-8 w-8 text-green-500" />
              ) : video.status === 'processing' ? (
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              ) : (
                <Video className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            {video.status === 'processing' && (
              <p className="text-sm text-muted-foreground animate-pulse">
                Generating your video...
              </p>
            )}
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
            getStatusColor()
          )}>
            {getStatusIcon()}
            {getStatusText()}
          </span>
        </div>

        {/* Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-3 right-3">
            <span className="inline-flex items-center px-2 py-1 rounded bg-black/70 text-white text-xs">
              {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="font-semibold mb-1 line-clamp-1">
          {video.title || 'Untitled Video'}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          {formatDateTime(video.created_at)}
        </p>

        {/* Script Preview */}
        {video.script && (
          <div className="mb-4 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <FileText className="h-3 w-3" />
              Script
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {video.script}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {video.video_url && video.status === 'completed' && (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download
                </>
              )}
            </button>
          )}
          
          {video.status === 'failed' && video.error_message && (
            <div className="flex-1 p-2 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
              {video.error_message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
