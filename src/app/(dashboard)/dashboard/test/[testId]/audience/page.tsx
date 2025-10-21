'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Users, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Edit3,
  Target
} from 'lucide-react'

interface Audience {
  id: string
  name: string
  isPrimary: boolean
  demographics: {
    age: { min: number, max: number }
    gender: string
    income: string
    education: string
    location: string
  }
  psychographics?: {
    values: string[]
    lifestyle: string
    painPoints: string[]
  }
  estimatedSize: number
  targetSampleSize: number
  reasoning?: string
}

export default function AudiencePage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.testId as string
  
  const [audiences, setAudiences] = useState<Audience[]>([])
  const [editingAudience, setEditingAudience] = useState<Audience | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Initialize with default audience immediately
    const defaultAudience: Audience = {
      id: 'audience_1',
      name: 'Primary Target Audience',
      isPrimary: true,
      demographics: {
        age: { min: 25, max: 45 },
        gender: 'any',
        income: 'middle',
        education: 'college',
        location: 'urban'
      },
      psychographics: {
        values: ['innovation', 'quality'],
        lifestyle: 'professional',
        painPoints: ['time constraints', 'quality concerns']
      },
      estimatedSize: 2000000,
      targetSampleSize: 500,
      reasoning: 'Primary demographic based on product positioning'
    }
    setAudiences([defaultAudience])
  }, [])

  const handleEdit = (audience: Audience) => {
    setEditingAudience({ ...audience })
    setIsEditing(true)
  }

  const handleSave = () => {
    if (!editingAudience) return

    setAudiences(audiences.map(aud => 
      aud.id === editingAudience.id ? editingAudience : aud
    ))
    setIsEditing(false)
    setEditingAudience(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingAudience(null)
  }

  const handleDelete = (audienceId: string) => {
    setAudiences(audiences.filter(aud => aud.id !== audienceId))
  }

  const handleAddAudience = () => {
    const newAudience: Audience = {
      id: `audience_${Date.now()}`,
      name: 'New Audience',
      isPrimary: audiences.length === 0,
      demographics: {
        age: { min: 30, max: 50 },
        gender: 'any',
        income: 'high',
        education: 'college',
        location: 'suburban'
      },
      psychographics: {
        values: ['convenience', 'efficiency'],
        lifestyle: 'busy',
        painPoints: ['time management', 'decision fatigue']
      },
      estimatedSize: 1000000,
      targetSampleSize: 200,
      reasoning: 'Secondary demographic for market expansion'
    }
    setAudiences([...audiences, newAudience])
  }

  const handleNext = () => {
    router.push(`/dashboard/test/${testId}/launch`)
  }

  const handleBack = () => {
    router.push(`/dashboard/test/${testId}/survey`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Audience Setup</h1>
              <p className="text-gray-600">Define and edit your target audiences</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-3 py-1">
                <Users className="w-4 h-4 mr-1" />
                {audiences.length} Audience{audiences.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <Card className="mb-8 p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Product Analysis
              </h3>
              <p className="text-gray-600 mb-2">
                Define your target audiences to proceed with market research
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Test ID: {testId}</span>
                <span>Status: Ready for Audience Setup</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Audiences */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Target Audiences</h2>
            <Button 
              onClick={handleAddAudience}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Audience</span>
            </Button>
          </div>

          <div className="grid gap-6">
            {audiences.map((audience, index) => (
              <Card key={audience.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {audience.name}
                      </h3>
                      {audience.isPrimary && (
                        <Badge className="bg-purple-100 text-purple-800">
                          Primary
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Age Range</p>
                        <p className="text-gray-900">
                          {audience.demographics?.age?.min || 'N/A'} - {audience.demographics?.age?.max || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Gender</p>
                        <p className="text-gray-900">{audience.demographics?.gender || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Income</p>
                        <p className="text-gray-900">{audience.demographics?.income || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p className="text-gray-900">{audience.demographics?.location || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Estimated Size</p>
                        <p className="text-gray-900">{audience.estimatedSize?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Sample Size</p>
                        <p className="text-gray-900">{audience.targetSampleSize || 'N/A'}</p>
                      </div>
                    </div>
                    
                    {audience.reasoning && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500">Reasoning</p>
                        <p className="text-gray-700 text-sm">{audience.reasoning}</p>
                      </div>
                    )}

                    {audience.psychographics && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500">Psychographics</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Values:</span> {audience.psychographics.values?.join(', ')}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Lifestyle:</span> {audience.psychographics.lifestyle}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Pain Points:</span> {audience.psychographics.painPoints?.join(', ')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(audience)}
                      className="flex items-center space-x-1"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </Button>
                    {audiences.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(audience.id)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Edit Modal */}
        {isEditing && editingAudience && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Edit Audience</h3>
                
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Audience Name
                    </label>
                    <Input
                      value={editingAudience.name}
                      onChange={(e) => setEditingAudience({
                        ...editingAudience,
                        name: e.target.value
                      })}
                      placeholder="Enter audience name"
                    />
                  </div>

                  {/* Demographics */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Demographics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Min Age
                        </label>
                        <Input
                          type="number"
                          value={editingAudience.demographics.age.min}
                          onChange={(e) => setEditingAudience({
                            ...editingAudience,
                            demographics: {
                              ...editingAudience.demographics,
                              age: {
                                ...editingAudience.demographics.age,
                                min: parseInt(e.target.value) || 0
                              }
                            }
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Age
                        </label>
                        <Input
                          type="number"
                          value={editingAudience.demographics.age.max}
                          onChange={(e) => setEditingAudience({
                            ...editingAudience,
                            demographics: {
                              ...editingAudience.demographics,
                              age: {
                                ...editingAudience.demographics.age,
                                max: parseInt(e.target.value) || 0
                              }
                            }
                          })}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          value={editingAudience.demographics.gender}
                          onChange={(e) => setEditingAudience({
                            ...editingAudience,
                            demographics: {
                              ...editingAudience.demographics,
                              gender: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="any">Any</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="non-binary">Non-binary</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Income Level
                        </label>
                        <select
                          value={editingAudience.demographics.income}
                          onChange={(e) => setEditingAudience({
                            ...editingAudience,
                            demographics: {
                              ...editingAudience.demographics,
                              income: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="low">Low</option>
                          <option value="middle">Middle</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Education
                        </label>
                        <select
                          value={editingAudience.demographics.education}
                          onChange={(e) => setEditingAudience({
                            ...editingAudience,
                            demographics: {
                              ...editingAudience.demographics,
                              education: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="high-school">High School</option>
                          <option value="college">College</option>
                          <option value="graduate">Graduate</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <select
                          value={editingAudience.demographics.location}
                          onChange={(e) => setEditingAudience({
                            ...editingAudience,
                            demographics: {
                              ...editingAudience.demographics,
                              location: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="urban">Urban</option>
                          <option value="suburban">Suburban</option>
                          <option value="rural">Rural</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Psychographics */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Psychographics</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Values (comma-separated)
                      </label>
                      <Input
                        value={editingAudience.psychographics?.values?.join(', ') || ''}
                        onChange={(e) => setEditingAudience({
                          ...editingAudience,
                          psychographics: {
                            ...editingAudience.psychographics,
                            values: e.target.value.split(',').map(v => v.trim()).filter(Boolean)
                          }
                        })}
                        placeholder="innovation, quality, convenience"
                      />
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lifestyle
                      </label>
                      <Input
                        value={editingAudience.psychographics?.lifestyle || ''}
                        onChange={(e) => setEditingAudience({
                          ...editingAudience,
                          psychographics: {
                            ...editingAudience.psychographics,
                            lifestyle: e.target.value
                          }
                        })}
                        placeholder="professional, busy, health-conscious"
                      />
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pain Points (comma-separated)
                      </label>
                      <Input
                        value={editingAudience.psychographics?.painPoints?.join(', ') || ''}
                        onChange={(e) => setEditingAudience({
                          ...editingAudience,
                          psychographics: {
                            ...editingAudience.psychographics,
                            painPoints: e.target.value.split(',').map(v => v.trim()).filter(Boolean)
                          }
                        })}
                        placeholder="time constraints, quality concerns, price sensitivity"
                      />
                    </div>
                  </div>

                  {/* Size and Sample */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Size & Sample</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estimated Market Size
                        </label>
                        <Input
                          type="number"
                          value={editingAudience.estimatedSize}
                          onChange={(e) => setEditingAudience({
                            ...editingAudience,
                            estimatedSize: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Target Sample Size
                        </label>
                        <Input
                          type="number"
                          value={editingAudience.targetSampleSize}
                          onChange={(e) => setEditingAudience({
                            ...editingAudience,
                            targetSampleSize: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reasoning
                    </label>
                    <Textarea
                      value={editingAudience.reasoning || ''}
                      onChange={(e) => setEditingAudience({
                        ...editingAudience,
                        reasoning: e.target.value
                      })}
                      placeholder="Explain why this audience is important for your product..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 mt-8">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="flex items-center space-x-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Back to Survey</span>
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={audiences.length === 0}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700"
          >
            <span>Continue to Launch</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}