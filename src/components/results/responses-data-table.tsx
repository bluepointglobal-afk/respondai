/**
 * RESPONSES DATA TABLE
 * Displays individual survey responses with filtering and export functionality
 */

'use client'

import { useState, useMemo } from 'react'
import { Download, Filter, Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SurveyResponse {
  id: string
  testId: string
  audienceId?: string
  responseData: any
  demographics: {
    age: number
    gender: string
    income: number
    location: string
    education: string
    occupation: string
  }
  psychographics: {
    motivations: string[]
    concerns: string[]
    values: string[]
  }
  behaviors: {
    preferredChannel: string
    categoryUsage: string
    expectedPurchaseTime: string
  }
  purchaseIntent: number
  priceAcceptance: any
  brandFit: number
  featurePreferences: any
  metadata: {
    device?: string
    timeSpent?: number
    completionRate?: number
  }
  createdAt: string
}

interface ResponsesDataTableProps {
  responses: SurveyResponse[]
  testId: string
  onViewResponse?: (responseId: string) => void
}

function ResponsesDataTable({ 
  responses, 
  testId,
  onViewResponse 
}: ResponsesDataTableProps) {
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selectedResponses, setSelectedResponses] = useState<string[]>([])
  const [sortField, setSortField] = useState<keyof SurveyResponse>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  
  const pageSize = 25
  
  // Filter and sort responses
  const filteredResponses = useMemo(() => {
    let filtered = responses.filter(response => {
      if (!filter) return true
      
      const searchTerm = filter.toLowerCase()
      return (
        response.demographics?.gender?.toLowerCase()?.includes(searchTerm) ||
        response.demographics?.location?.toLowerCase()?.includes(searchTerm) ||
        response.demographics?.occupation?.toLowerCase()?.includes(searchTerm) ||
        response.behaviors?.preferredChannel?.toLowerCase()?.includes(searchTerm) ||
        String(response.purchaseIntent).includes(searchTerm)
      )
    })
    
    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
    
    return filtered
  }, [responses, filter, sortField, sortDirection])
  
  // Pagination
  const totalPages = Math.ceil(filteredResponses.length / pageSize)
  const paginatedResponses = filteredResponses.slice(
    (page - 1) * pageSize,
    page * pageSize
  )
  
  const handleSort = (field: keyof SurveyResponse) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  
  const handleSelectAll = () => {
    if (selectedResponses.length === paginatedResponses.length) {
      setSelectedResponses([])
    } else {
      setSelectedResponses(paginatedResponses.map(r => r.id))
    }
  }
  
  const handleSelectResponse = (responseId: string) => {
    setSelectedResponses(prev => 
      prev.includes(responseId) 
        ? prev.filter(id => id !== responseId)
        : [...prev, responseId]
    )
  }
  
  const handleExport = async (format: 'csv' | 'json' = 'csv') => {
    try {
      const exportData = selectedResponses.length > 0 
        ? responses.filter(r => selectedResponses.includes(r.id))
        : responses
      
      if (format === 'csv') {
        const csv = convertToCSV(exportData)
        downloadFile(csv, `survey-responses-${testId}.csv`, 'text/csv')
      } else {
        const json = JSON.stringify(exportData, null, 2)
        downloadFile(json, `survey-responses-${testId}.json`, 'application/json')
      }
    } catch (error) {
      console.error('Export error:', error)
    }
  }
  
  const convertToCSV = (data: SurveyResponse[]) => {
    const headers = [
      'ID', 'Age', 'Gender', 'Income', 'Location', 'Occupation', 
      'Purchase Intent', 'Brand Fit', 'Preferred Channel', 
      'Category Usage', 'Purchase Timeline', 'Time Spent', 'Created At'
    ]
    
    const rows = data.map(response => [
      response.id.slice(0, 8),
      response.demographics?.age || '',
      response.demographics?.gender || '',
      response.demographics?.income || '',
      response.demographics?.location || '',
      response.demographics?.occupation || '',
      response.purchaseIntent || 0,
      response.brandFit || 0,
      response.behaviors?.preferredChannel || '',
      response.behaviors?.categoryUsage || '',
      response.behaviors?.expectedPurchaseTime || '',
      response.metadata?.timeSpent || 0,
      new Date(response.createdAt).toLocaleDateString()
    ])
    
    return [headers, ...rows].map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n')
  }
  
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }
  
  const getIntentColor = (intent: number) => {
    if (intent >= 70) return 'bg-green-100 text-green-800'
    if (intent >= 50) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }
  
  const getBrandFitColor = (fit: number) => {
    if (fit >= 8) return 'bg-green-100 text-green-800'
    if (fit >= 6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }
  
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Purchase Intent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(responses.reduce((sum, r) => sum + (r.purchaseIntent || 0), 0) / responses.length)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Brand Fit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(responses.reduce((sum, r) => sum + (r.brandFit || 0), 0) / responses.length).toFixed(1)}/10
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(responses.reduce((sum, r) => sum + (r.metadata?.completionRate || 100), 0) / responses.length)}%
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search responses..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-64"
            />
          </div>
          
          <div className="text-sm text-gray-500">
            {filteredResponses.length} of {responses.length} responses
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>
      
      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={selectedResponses.length === paginatedResponses.length && paginatedResponses.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th 
                  className="text-left p-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('id')}
                >
                  ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-3 text-sm font-medium text-gray-700">Demographics</th>
                <th 
                  className="text-left p-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('purchaseIntent')}
                >
                  Intent {sortField === 'purchaseIntent' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="text-left p-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('brandFit')}
                >
                  Brand Fit {sortField === 'brandFit' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-3 text-sm font-medium text-gray-700">Behavior</th>
                <th 
                  className="text-left p-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('createdAt')}
                >
                  Date {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedResponses.map((response) => (
                <tr key={response.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedResponses.includes(response.id)}
                      onChange={() => handleSelectResponse(response.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="p-3 text-sm font-mono text-gray-600">
                    {response.id.slice(0, 8)}
                  </td>
                  <td className="p-3 text-sm">
                    <div className="space-y-1">
                      <div className="font-medium">
                        {response.demographics?.gender}, {response.demographics?.age}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {response.demographics?.location} • ${response.demographics?.income?.toLocaleString()}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge className={getIntentColor(response.purchaseIntent || 0)}>
                      {response.purchaseIntent || 0}%
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge className={getBrandFitColor(response.brandFit || 0)}>
                      {(response.brandFit || 0).toFixed(1)}/10
                    </Badge>
                  </td>
                  <td className="p-3 text-sm">
                    <div className="space-y-1">
                      <div className="font-medium">{response.behaviors?.preferredChannel}</div>
                      <div className="text-gray-500 text-xs">{response.behaviors?.categoryUsage}</div>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {new Date(response.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewResponse?.(response.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filteredResponses.length)} of {filteredResponses.length}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ResponsesDataTable
