import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // TODO: Implement category averages endpoint
    return NextResponse.json(
      { message: 'Category averages endpoint not implemented yet' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Error in category averages endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
