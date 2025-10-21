import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Hello from RespondAI API!',
    timestamp: new Date().toISOString(),
    status: 'success'
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    return NextResponse.json({
      message: 'Data received successfully',
      data: body,
      status: 'success'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        message: 'Invalid request body',
        status: 'error' 
      },
      { status: 400 }
    )
  }
}

