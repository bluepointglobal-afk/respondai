/**
 * PERSONA CARD
 * Displays rich customer personas with detailed narratives and marketing guidance
 */

'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Users, DollarSign, TrendingUp, Quote, Target, Lightbulb } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'

interface Persona {
  id: string
  name: string
  tagline: string
  demographics: {
    age: string
    gender: string
    income: string
    location: string
    education: string
    occupation: string
    familyStatus: string
  }
  narrative: string
  jobsToBeDone: {
    functional: string[]
    emotional: string[]
    social: string[]
  }
  motivations: string[]
  painPoints: string[]
  purchaseDrivers: {
    mustHaves: string[]
    niceToHaves: string[]
    dealBreakers: string[]
  }
  decisionProcess: {
    researchStyle: string
    influencers: string[]
    timeline: string
    objections: string[]
  }
  messaging: {
    resonates: string[]
    turnsOff: string[]
    tone: string
    channels: string[]
  }
  quotableQuotes: string[]
  dayInLife: string
  marketingGuidance: {
    positioning: string
    keyBenefits: string[]
    socialProof: string
    pricing: string
    campaignIdeas: string[]
  }
  sizeAndValue: {
    estimatedSize: number
    purchaseLikelihood: string
    expectedLTV: string
    acquisitionDifficulty: string
    strategicValue: string
  }
}

interface PersonaCardProps {
  persona: Persona
  onExport?: () => void
}

function PersonaCard({ persona, onExport }: PersonaCardProps) {
  const [expanded, setExpanded] = useState(false)
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }
  
  const getDifficultyColor = (difficulty: string | undefined) => {
    if (!difficulty) return 'bg-gray-100 text-gray-800'
    
    switch (difficulty.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getValueColor = (value: string | undefined) => {
    if (!value) return 'bg-gray-100 text-gray-800'
    
    switch (value.toLowerCase()) {
      case 'high': return 'bg-blue-100 text-blue-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">{persona.name}</h3>
              <Badge className="bg-blue-100 text-blue-800">
                <Users className="w-3 h-3 mr-1" />
                {formatNumber(persona.sizeAndValue.estimatedSize)}
              </Badge>
            </div>
            
            <p className="text-lg text-gray-600 mb-4">{persona.tagline}</p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Purchase Likelihood</div>
                <div className="text-xl font-bold text-green-800">{persona.sizeAndValue.purchaseLikelihood}</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Expected LTV</div>
                <div className="text-xl font-bold text-blue-800">{persona.sizeAndValue.expectedLTV}</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Acquisition</div>
                <div className="text-xl font-bold text-purple-800 capitalize">{persona.sizeAndValue.acquisitionDifficulty}</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-sm text-orange-600 font-medium">Strategic Value</div>
                <div className="text-xl font-bold text-orange-800 capitalize">{persona.sizeAndValue.strategicValue}</div>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="shrink-0"
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
        </div>
        
        {/* Demographics */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Demographics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <div className="text-sm text-gray-500">Age</div>
              <div className="font-medium">{persona.demographics.age}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Gender</div>
              <div className="font-medium">{persona.demographics.gender}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Income</div>
              <div className="font-medium">{persona.demographics.income}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Location</div>
              <div className="font-medium">{persona.demographics.location}</div>
            </div>
          </div>
        </div>
        
        {/* Expanded Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 pt-6 border-t"
            >
              {/* Narrative */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Who They Are</h4>
                <div className="prose prose-sm max-w-none">
                  {persona.narrative.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 mb-3 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              
              {/* Day in Life */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Day in Their Life</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{persona.dayInLife}</p>
                </div>
              </div>
              
              {/* Jobs to be Done */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Jobs to be Done</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-2">Functional</h5>
                    <ul className="space-y-1">
                      {persona.jobsToBeDone.functional.map((job, index) => (
                        <li key={index} className="text-sm text-green-700">• {job}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">Emotional</h5>
                    <ul className="space-y-1">
                      {persona.jobsToBeDone.emotional.map((job, index) => (
                        <li key={index} className="text-sm text-blue-700">• {job}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">Social</h5>
                    <ul className="space-y-1">
                      {persona.jobsToBeDone.social.map((job, index) => (
                        <li key={index} className="text-sm text-purple-700">• {job}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Motivations & Pain Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Motivations</h4>
                  <div className="space-y-2">
                    {persona.motivations.map((motivation, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-700">{motivation}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Pain Points</h4>
                  <div className="space-y-2">
                    {persona.painPoints.map((pain, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-700">{pain}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Purchase Drivers */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Purchase Drivers</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-800 mb-2">Must-Haves</h5>
                    <ul className="space-y-1">
                      {persona.purchaseDrivers.mustHaves.map((syn, index) => (
                        <li key={index} className="text-sm text-green-700">• {syn}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="font-medium text-blue-800 mb-2">Nice-to-Haves</h5>
                    <ul className="space-y-1">
                      {persona.purchaseDrivers.niceToHaves.map((syn, index) => (
                        <li key={index} className="text-sm text-blue-700">• {syn}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h5 className="font-medium text-red-800 mb-2">Deal-Breakers</h5>
                    <ul className="space-y-1">
                      {persona.purchaseDrivers.dealBreakers.map((syn, index) => (
                        <li key={index} className="text-sm text-red-700">• {syn}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Messaging */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Messaging Guidance</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-2">What Resonates</h5>
                    <ul className="space-y-1">
                      {persona.messaging.resonates.map((message, index) => (
                        <li key={index} className="text-sm text-green-700">• {message}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h5 className="font-medium text-red-800 mb-2">What Turns Them Off</h5>
                    <ul className="space-y-1">
                      {persona.messaging.turnsOff.map((message, index) => (
                        <li key={index} className="text-sm text-red-700">• {message}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">Recommended Tone & Channels</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-blue-600 font-medium">Tone</div>
                      <div className="text-sm text-blue-800">{persona.messaging.tone}</div>
                    </div>
                    <div>
                      <div className="text-sm text-blue-600 font-medium">Channels</div>
                      <div className="text-sm text-blue-800">{persona.messaging.channels.join(', ')}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quotable Quotes */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">In Their Own Words</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {persona.quotableQuotes.map((quote, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-l-blue-500">
                      <Quote className="w-5 h-5 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-700 italic">"{quote}"</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Marketing Guidance */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Marketing Strategy</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">Positioning</h5>
                    <p className="text-sm text-blue-700">{persona.marketingGuidance.positioning}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-2">Key Benefits (Priority Order)</h5>
                    <ol className="space-y-1">
                      {persona.marketingGuidance.keyBenefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-green-700">
                          {index + 1}. {benefit}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">Social Proof</h5>
                    <p className="text-sm text-purple-700">{persona.marketingGuidance.socialProof}</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">Pricing Strategy</h5>
                    <p className="text-sm text-orange-700">{persona.marketingGuidance.pricing}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-800 mb-2">Campaign Ideas</h5>
                    <ul className="space-y-1">
                      {persona.marketingGuidance.campaignIdeas.map((idea, index) => (
                        <li key={index} className="text-sm text-gray-700">• {idea}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Decision Process */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Decision Process</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-800 mb-2">Research Style</h5>
                    <p className="text-sm text-gray-700">{persona.decisionProcess.researchStyle}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-800 mb-2">Timeline</h5>
                    <p className="text-sm text-gray-700">{persona.decisionProcess.timeline}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-800 mb-2">Influencers</h5>
                    <p className="text-sm text-gray-700">{persona.decisionProcess.influencers.join(', ')}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-800 mb-2">Common Objections</h5>
                    <p className="text-sm text-gray-700">{persona.decisionProcess.objections.join(', ')}</p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Generate Campaign
                  </Button>
                  <Button variant="outline" size="sm">
                    Export Persona
                  </Button>
                </div>
                <div className="text-xs text-gray-500">
                  Persona ID: {persona.id}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

export default PersonaCard
