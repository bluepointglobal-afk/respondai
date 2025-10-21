/**
 * ROBUST COMPREHENSIVE ANALYSIS API
 * Single endpoint that handles complete product analysis with proper error handling
 */

import { NextRequest, NextResponse } from 'next/server'
import { runComprehensiveAnalysis } from '@/lib/analytics/analysis-service'
import { ProductInfo } from '@/lib/analytics/types'

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 Comprehensive Analysis API called')
    
    // Parse and validate request
    const body = await req.json()
    const { productInfo }: { productInfo: ProductInfo } = body
    
    if (!productInfo) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing product information',
          details: 'Product information is required in the request body',
          suggestion: 'Please provide valid product information and try again'
        },
        { status: 400 }
      )
    }
    
    // Run comprehensive analysis
    const result = await runComprehensiveAnalysis(productInfo)
    
    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 500 })
    }
    
  } catch (error) {
    console.error('Comprehensive Analysis API error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        suggestion: 'Please try again or contact support if the issue persists'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Comprehensive Analysis API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/analysis/comprehensive',
      description: 'Run comprehensive product analysis'
    },
    requiredFields: {
      productInfo: {
        name: 'string (required)',
        description: 'string (required)',
        industry: 'string (required)',
        targetAudience: 'string (required)',
        problemStatement: 'string (optional)',
        uniqueValue: 'string (optional)',
        priceRange: 'object (optional)',
        brandValues: 'array (optional)',
        companyStory: 'string (optional)'
      }
    }
  })
}
