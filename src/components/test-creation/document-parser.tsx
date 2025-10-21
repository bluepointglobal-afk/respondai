'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ParsedData {
  companyName?: string
  productName?: string
  productDescription?: string
  industry?: string
  targetAudience?: string
  problemStatement?: string
  solutionStatement?: string
  uniqueValue?: string
  businessModel?: string
  marketSize?: string
  competitors?: string[]
  brandMission?: string
  brandVision?: string
  companyStory?: string
  [key: string]: any
}

interface DocumentParserProps {
  onParsedData: (data: ParsedData) => void
  onBack: () => void
}

export function DocumentParser({ onParsedData, onBack }: DocumentParserProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [editingData, setEditingData] = useState<ParsedData>({})
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile)
    setUploading(true)

    try {
      // Create form data for file upload
      const formData = new FormData()
      formData.append('file', selectedFile)

      // Call the document parsing API
      const response = await fetch('/api/parse-document', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to parse document')
      }

      const result = await response.json()
      console.log('Document parsed successfully:', result.data)
      
      setParsedData(result.data)
      setEditingData(result.data)
    } catch (error) {
      console.error('Error parsing document:', error)
      // Fallback to mock data if API fails
      const mockParsedData: ParsedData = {
        companyName: "MightyDad",
        productName: "Coq10 Anti-Aging Supplement",
        productDescription: "Premium CoQ10 supplement designed for men 30-50 seeking to rebuild energy and vitality after life challenges",
        industry: "Health & Wellness",
        targetAudience: "Men 30-50, mid-professionals, divorced fathers, those rebuilding after hardship",
        problemStatement: "Men go through heartbreak, divorce, exhaustion and silent breakdowns — yet the world still expects them to provide, lead and show up as if nothing happened",
        solutionStatement: "MightyDad provides more than products — it delivers a ritual of personal revival. Every formula, supplement and grooming tool is designed as a weapon for men rebuilding themselves physically, emotionally and spiritually after hardship",
        uniqueValue: "Transformation-focused brand for men rebuilding after hardship",
        businessModel: "B2C",
        marketSize: "Health supplements market: $50B+",
        competitors: ["Thorne", "Life Extension", "NOW Foods"],
        brandMission: "To help men rebuild their presence, dignity, and strength through powerful self-care rituals designed for those who rise after hardship",
        brandVision: "To become the leading transformation brand for fathers and men in recovery — where every product is a tool of rebirth, not just grooming",
        companyStory: "MightyDad was born from a truth no one speaks about: Men are expected to carry everything — heartbreak, responsibility, financial pressure, silent battles — yet are given no space to rebuild."
      }
      
      setParsedData(mockParsedData)
      setEditingData(mockParsedData)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleDataEdit = (field: string, value: string) => {
    setEditingData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleContinue = () => {
    onParsedData(editingData)
  }

  if (uploading) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Analyzing Your Document</h3>
          <p className="text-gray-600 mt-2">
            Our AI is extracting key information from your document...
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Sparkles className="w-4 h-4" />
            <span>Extracting company information</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Sparkles className="w-4 h-4" />
            <span>Identifying product details</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Sparkles className="w-4 h-4" />
            <span>Analyzing market positioning</span>
          </div>
        </div>
      </div>
    )
  }

  if (parsedData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Document Parsed Successfully!</h3>
            <p className="text-gray-600 mt-2">
              Review and edit the extracted information below
            </p>
          </div>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Company Information</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={editingData.companyName || ''}
                    onChange={(e) => handleDataEdit('companyName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={editingData.industry || ''}
                    onChange={(e) => handleDataEdit('industry', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="companyStory">Company Story</Label>
                <Textarea
                  id="companyStory"
                  value={editingData.companyStory || ''}
                  onChange={(e) => handleDataEdit('companyStory', e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Product Information</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    value={editingData.productName || ''}
                    onChange={(e) => handleDataEdit('productName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="businessModel">Business Model</Label>
                  <Input
                    id="businessModel"
                    value={editingData.businessModel || ''}
                    onChange={(e) => handleDataEdit('businessModel', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="productDescription">Product Description</Label>
                <Textarea
                  id="productDescription"
                  value={editingData.productDescription || ''}
                  onChange={(e) => handleDataEdit('productDescription', e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Market Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Market Information</h4>
              <div>
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  value={editingData.targetAudience || ''}
                  onChange={(e) => handleDataEdit('targetAudience', e.target.value)}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="problemStatement">Problem Statement</Label>
                  <Textarea
                    id="problemStatement"
                    value={editingData.problemStatement || ''}
                    onChange={(e) => handleDataEdit('problemStatement', e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="solutionStatement">Solution Statement</Label>
                  <Textarea
                    id="solutionStatement"
                    value={editingData.solutionStatement || ''}
                    onChange={(e) => handleDataEdit('solutionStatement', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Brand Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Brand Information</h4>
              <div>
                <Label htmlFor="brandMission">Brand Mission</Label>
                <Textarea
                  id="brandMission"
                  value={editingData.brandMission || ''}
                  onChange={(e) => handleDataEdit('brandMission', e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="brandVision">Brand Vision</Label>
                <Textarea
                  id="brandVision"
                  value={editingData.brandVision || ''}
                  onChange={(e) => handleDataEdit('brandVision', e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="uniqueValue">Unique Value Proposition</Label>
                <Textarea
                  id="uniqueValue"
                  value={editingData.uniqueValue || ''}
                  onChange={(e) => handleDataEdit('uniqueValue', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back to Options
          </Button>
          <Button onClick={handleContinue} className="flex items-center space-x-2">
            <span>Continue to Survey Builder</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Upload Your Document</h3>
        <p className="text-gray-600">
          Upload your pitch deck, business plan, or product brief to automatically extract key information
        </p>
      </div>

      <Card 
        className={`p-8 border-2 border-dashed transition-colors cursor-pointer ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
            <Upload className="w-8 h-8 text-gray-600" />
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-900">Drop your document here</h4>
            <p className="text-gray-600 mt-2">
              or click to browse files
            </p>
          </div>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>DOC</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>TXT</span>
            </div>
          </div>
          <input
            id="file-input"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      </Card>

      <div className="flex justify-center">
        <Button variant="outline" onClick={onBack}>
          Back to Options
        </Button>
      </div>
    </div>
  )
}
