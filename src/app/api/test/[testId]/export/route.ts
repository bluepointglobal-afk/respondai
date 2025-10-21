/**
 * EXPORT API ENDPOINT
 * Exports test data in various formats (CSV, JSON, PDF)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const { searchParams } = new URL(req.url)
    const format = searchParams.get('format') || 'csv'
    const type = searchParams.get('type') || 'responses'
    
    console.log(`📤 Exporting ${type} data in ${format} format for test ${params.testId}`)
    
    // Get test data
    const test = await prisma.test.findFirst({
      where: { id: params.testId },
      include: {
        survey: true,
        audiences: true,
        analysis: true,
        surveyResponses: true
      }
    })
    
    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }
    
    if (type === 'responses' && test.surveyResponses.length === 0) {
      return NextResponse.json({ error: 'No response data available' }, { status: 404 })
    }
    
    let exportData: string
    let mimeType: string
    let filename: string
    
    switch (format) {
      case 'csv':
        if (type === 'responses') {
          exportData = convertResponsesToCSV(test.surveyResponses)
          mimeType = 'text/csv'
          filename = `survey-responses-${params.testId}.csv`
        } else if (type === 'analysis') {
          exportData = convertAnalysisToCSV(test.analysis)
          mimeType = 'text/csv'
          filename = `analysis-results-${params.testId}.csv`
        } else {
          return NextResponse.json({ error: 'Invalid export type' }, { status: 400 })
        }
        break
        
      case 'json':
        if (type === 'responses') {
          exportData = JSON.stringify(test.surveyResponses, null, 2)
          mimeType = 'application/json'
          filename = `survey-responses-${params.testId}.json`
        } else if (type === 'analysis') {
          exportData = JSON.stringify(test.analysis, null, 2)
          mimeType = 'application/json'
          filename = `analysis-results-${params.testId}.json`
        } else if (type === 'full') {
          exportData = JSON.stringify(test, null, 2)
          mimeType = 'application/json'
          filename = `complete-test-data-${params.testId}.json`
        } else {
          return NextResponse.json({ error: 'Invalid export type' }, { status: 400 })
        }
        break
        
      default:
        return NextResponse.json({ error: 'Invalid format. Use csv or json' }, { status: 400 })
    }
    
    return new NextResponse(exportData, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
    
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}

function convertResponsesToCSV(responses: any[]): string {
  if (responses.length === 0) return ''
  
  const headers = [
    'ID', 'Audience ID', 'Age', 'Gender', 'Income', 'Location', 'Education', 'Occupation',
    'Purchase Intent', 'Brand Fit', 'Preferred Channel', 'Category Usage', 'Purchase Timeline',
    'Motivations', 'Concerns', 'Values', 'Time Spent', 'Created At'
  ]
  
  const rows = responses.map(response => [
    response.id,
    response.audienceId || '',
    response.demographics?.age || '',
    response.demographics?.gender || '',
    response.demographics?.income || '',
    response.demographics?.location || '',
    response.demographics?.education || '',
    response.demographics?.occupation || '',
    response.purchaseIntent || 0,
    response.brandFit || 0,
    response.behaviors?.preferredChannel || '',
    response.behaviors?.categoryUsage || '',
    response.behaviors?.expectedPurchaseTime || '',
    (response.psychographics?.motivations || []).join('; '),
    (response.psychographics?.concerns || []).join('; '),
    (response.psychographics?.values || []).join('; '),
    response.metadata?.timeSpent || 0,
    new Date(response.createdAt).toISOString()
  ])
  
  return [headers, ...rows].map(row => 
    row.map(field => `"${field}"`).join(',')
  ).join('\n')
}

function convertAnalysisToCSV(analysis: any): string {
  if (!analysis) return ''
  
  const headers = [
    'Metric', 'Value', 'Type', 'Confidence', 'Sample Size'
  ]
  
  const rows = [
    ['Purchase Intent Mean', analysis.purchaseIntent?.avgIntent || 0, 'metric', analysis.confidence || 0, analysis.sampleSize || 0],
    ['Should Launch', analysis.shouldLaunch || false, 'decision', analysis.launchConfidence || 0, analysis.sampleSize || 0],
    ['Launch Reasoning', analysis.launchReasoning || '', 'text', 0, 0],
    ['Sample Size', analysis.sampleSize || 0, 'metric', 100, analysis.sampleSize || 0],
    ['Data Mode', analysis.dataMode || '', 'text', 0, 0]
  ]
  
  return [headers, ...rows].map(row => 
    row.map(field => `"${field}"`).join(',')
  ).join('\n')
}
