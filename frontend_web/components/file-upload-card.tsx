"use client"

import { useState, useRef } from 'react'
import { Upload, FileText, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { apiService } from '@/lib/api-service'
import { useAuth } from '@/app/providers'

export default function FileUploadCard() {
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.match(/\.(pdf|csv)$/i)) {
      setUploadStatus({
        type: 'error',
        message: 'Please upload only PDF or CSV files'
      })
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus({
        type: 'error',
        message: 'File size must be less than 10MB'
      })
      return
    }

    setUploading(true)
    setUploadStatus({ type: null, message: '' })

    try {
      const formData = new FormData()
      formData.append('file', file)

      const endpoint = file.name.toLowerCase().endsWith('.pdf')
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/upload/pdf`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/upload/csv`

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.detail || result.error || 'Upload failed')
      }

      setUploadStatus({
        type: 'success',
        message: `✅ Successfully processed ${result.transaction_count || 0} transactions!`
      })

      // Reload page after 2 seconds to show new data
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error: any) {
      setUploadStatus({
        type: 'error',
        message: error.message || 'Failed to upload file. Please try again.'
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="bg-card border-2 border-dashed border-primary/30 rounded-2xl p-8 hover:border-primary/50 transition-colors">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-primary/10">
            <Upload className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            Upload Bank Statement
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload your PDF bank statement or CSV transaction file to analyze your spending
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.csv"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />

        <Button
          onClick={handleClick}
          disabled={uploading}
          size="lg"
          className="w-full sm:w-auto"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Choose File
            </>
          )}
        </Button>

        {uploadStatus.type && (
          <div
            className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
              uploadStatus.type === 'success'
                ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                : 'bg-red-500/10 text-red-600 border border-red-500/20'
            }`}
          >
            {uploadStatus.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <p className="text-sm font-medium">{uploadStatus.message}</p>
          </div>
        )}

        <div className="pt-2">
          <p className="text-xs text-muted-foreground">
            Supported formats: PDF, CSV • Max size: 10MB
          </p>
        </div>
      </div>
    </div>
  )
}

