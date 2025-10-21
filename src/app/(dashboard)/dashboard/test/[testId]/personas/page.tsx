'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  MessageCircle,
  Users,
  TrendingUp,
  DollarSign,
  Heart,
  Download,
  Share2
} from 'lucide-react'
import Link from 'next/link'

interface Persona {
  id: string
  name: string
  age: number
  location: string
  archetype: string
  avatar: string
  purchaseIntent: number
  pricePoint: number
  sampleSize: number
  demographics: {
    income: string
    education: string
    occupation: string
    familyStatus: string
  }
  psychographics: {
    values: string[]
    lifestyle: string[]
    painPoints: string[]
    goals: string[]
  }
  keyQuotes: string[]
  behaviors: {
    shoppingHabits: string
    brandLoyalty: string
    influencers: string
    decisionFactors: string[]
  }
}

export default function PersonasPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.testId as string
  const [personas, setPersonas] = useState<Persona[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPersonas()
  }, [testId])

  const fetchPersonas = async () => {
    try {
      setLoading(true)
      console.log('Fetching personas for test:', testId)
      
      // Fetch personas from API
      const response = await fetch(`/api/test/${testId}/personas`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch personas: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Personas received:', data)
      
      if (data.hasPersonas && data.personas) {
        setPersonas(data.personas)
      } else {
        // No personas yet, show empty state
        setPersonas([])
      }
    } catch (error) {
      console.error('Error fetching personas:', error)
      // Fallback to empty state
      setPersonas([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg-primary dark:bg-dark-bg-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">Loading personas...</p>
        </div>
      </div>
    )
  }

  if (personas.length === 0) {
    return (
      <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href={`/dashboard/test/${testId}/results`}>
                <Button variant="secondary" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Results
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
                  Customer Personas
                </h1>
                <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
                  AI-generated personas will appear here after running the simulation
                </p>
              </div>
            </div>
          </div>
          
          <Card className="p-8 text-center">
            <div className="text-gray-500 mb-4">
              <Users className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Personas Generated Yet</h3>
              <p>Personas will be created after running the AI simulation engine.</p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href={`/dashboard/test/${testId}/results`}>
              <Button variant="secondary" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Results
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
                Customer Personas
              </h1>
              <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
                Based on {personas.reduce((sum, p) => sum + p.sampleSize, 0)} responses across {personas.length} distinct segments
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="secondary" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
   
        {/* Personas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona) => (
            <Card key={persona.id} className="hover:shadow-xl transition-shadow cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="text-6xl mb-4">{persona.avatar}</div>
                <CardTitle className="text-2xl mb-2">{persona.name}</CardTitle>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                  {persona.age}, {persona.location}
                </p>
                <Badge variant="outline" className="mt-2">{persona.archetype}</Badge>
              </CardHeader>
              <CardContent>
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-xl font-bold text-green-600">{persona.purchaseIntent}%</div>
                    <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">Intent</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-xl font-bold text-blue-600">${persona.pricePoint}</div>
                    <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">Price</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="text-xl font-bold text-purple-600">n={persona.sampleSize}</div>
                    <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">Sample</div>
                  </div>
                </div>
   
                {/* Quick Demographics */}
                <div className="mb-4 space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Income:</span> {persona.demographics.income}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Occupation:</span> {persona.demographics.occupation}
                  </div>
                </div>
   
                {/* Key Values */}
                <div className="mb-4">
                  <div className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Core Values
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {persona.psychographics.values.slice(0, 3).map((value, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
   
                {/* Key Quote */}
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <p className="text-sm italic text-light-text-secondary dark:text-dark-text-secondary">
                    "{persona.keyQuotes[0]}"
                  </p>
                </div>
   
                {/* CTA */}
                <Link href={`/dashboard/test/${testId}/chat/${persona.id}`}>
                  <Button className="w-full group-hover:bg-primary-600" variant="primary">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat with {persona.name.split(' ')[0]}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
   
        {/* Multi-Persona Comparison CTA */}
        <Card className="mt-8 bg-gradient-to-r from-primary-50 to-accent-purple/10 dark:from-primary-950/20 dark:to-accent-purple/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Multi-Persona Roundtable</h3>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                  Chat with multiple personas at once to compare perspectives and uncover deeper insights
                </p>
              </div>
              <Button variant="primary" size="lg">
                <Users className="h-5 w-5 mr-2" />
                Start Roundtable
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}