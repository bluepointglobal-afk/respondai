import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'

interface SimpleAudience {
  id: string
  name: string
  isPrimary: boolean
  demographics: any
  psychographics?: any
  estimatedSize: number
  targetSampleSize: number
  reasoning?: string
}

interface EditAudienceModalProps {
  audience: SimpleAudience | null
  isOpen: boolean
  onClose: () => void
  onSave: (audience: SimpleAudience) => void
}

export function EditAudienceModal({ audience, isOpen, onClose, onSave }: EditAudienceModalProps) {
  const [formData, setFormData] = useState<SimpleAudience>({
    id: '',
    name: '',
    isPrimary: false,
    demographics: {
      age: { min: 25, max: 45 },
      gender: 'any',
      income: 'middle',
      education: 'college',
      location: 'urban'
    },
    psychographics: {
      lifestyle: [],
      values: [],
      painPoints: []
    },
    estimatedSize: 1000000,
    targetSampleSize: 500,
    reasoning: ''
  })

  const [newLifestyle, setNewLifestyle] = useState('')
  const [newValue, setNewValue] = useState('')
  const [newPainPoint, setNewPainPoint] = useState('')

  useEffect(() => {
    if (audience) {
      setFormData({
        ...audience,
        demographics: audience.demographics || {
          age: { min: 25, max: 45 },
          gender: 'any',
          income: 'middle',
          education: 'college',
          location: 'urban'
        },
        psychographics: {
          lifestyle: Array.isArray(audience.psychographics?.lifestyle) ? audience.psychographics.lifestyle : [],
          values: Array.isArray(audience.psychographics?.values) ? audience.psychographics.values : [],
          painPoints: Array.isArray(audience.psychographics?.painPoints) ? audience.psychographics.painPoints : []
        }
      })
    }
  }, [audience])

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  const addLifestyle = () => {
    if (newLifestyle.trim()) {
      setFormData(prev => ({
        ...prev,
        psychographics: {
          ...prev.psychographics,
          lifestyle: [...(Array.isArray(prev.psychographics?.lifestyle) ? prev.psychographics.lifestyle : []), newLifestyle.trim()]
        }
      }))
      setNewLifestyle('')
    }
  }

  const removeLifestyle = (index: number) => {
    setFormData(prev => ({
      ...prev,
      psychographics: {
        ...prev.psychographics,
        lifestyle: Array.isArray(prev.psychographics?.lifestyle) ? prev.psychographics.lifestyle.filter((_: any, i: number) => i !== index) : []
      }
    }))
  }

  const addValue = () => {
    if (newValue.trim()) {
      setFormData(prev => ({
        ...prev,
        psychographics: {
          ...prev.psychographics,
          values: [...(Array.isArray(prev.psychographics?.values) ? prev.psychographics.values : []), newValue.trim()]
        }
      }))
      setNewValue('')
    }
  }

  const removeValue = (index: number) => {
    setFormData(prev => ({
      ...prev,
      psychographics: {
        ...prev.psychographics,
        values: Array.isArray(prev.psychographics?.values) ? prev.psychographics.values.filter((_: any, i: number) => i !== index) : []
      }
    }))
  }

  const addPainPoint = () => {
    if (newPainPoint.trim()) {
      setFormData(prev => ({
        ...prev,
        psychographics: {
          ...prev.psychographics,
          painPoints: [...(Array.isArray(prev.psychographics?.painPoints) ? prev.psychographics.painPoints : []), newPainPoint.trim()]
        }
      }))
      setNewPainPoint('')
    }
  }

  const removePainPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      psychographics: {
        ...prev.psychographics,
        painPoints: Array.isArray(prev.psychographics?.painPoints) ? prev.psychographics.painPoints.filter((_: any, i: number) => i !== index) : []
      }
    }))
  }

  if (!audience) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl">
        <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Audience Segment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Audience Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Urban Millennial Professionals"
                className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPrimary"
                checked={formData.isPrimary}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPrimary: !!checked }))}
                className="border-gray-300 dark:border-gray-600"
              />
              <Label htmlFor="isPrimary" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Primary target audience
              </Label>
            </div>
          </div>

          {/* Demographics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Demographics</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ageMin" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Age Min
                </Label>
                <Input
                  id="ageMin"
                  type="number"
                  value={formData.demographics.age.min}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    demographics: {
                      ...prev.demographics,
                      age: { ...prev.demographics.age, min: parseInt(e.target.value) || 25 }
                    }
                  }))}
                  className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="ageMax" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Age Max
                </Label>
                <Input
                  id="ageMax"
                  type="number"
                  value={formData.demographics.age.max}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    demographics: {
                      ...prev.demographics,
                      age: { ...prev.demographics.age, max: parseInt(e.target.value) || 45 }
                    }
                  }))}
                  className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.demographics.gender}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    demographics: { ...prev.demographics, gender: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="income">Income Level</Label>
                <Select
                  value={formData.demographics.income}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    demographics: { ...prev.demographics, income: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low ($25K-$50K)</SelectItem>
                    <SelectItem value="middle">Middle ($50K-$75K)</SelectItem>
                    <SelectItem value="upper-middle">Upper Middle ($75K-$100K)</SelectItem>
                    <SelectItem value="high">High ($100K+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="education">Education</Label>
                <Select
                  value={formData.demographics.education}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    demographics: { ...prev.demographics, education: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="some-college">Some College</SelectItem>
                    <SelectItem value="college">College Graduate</SelectItem>
                    <SelectItem value="graduate">Graduate Degree</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location Type</Label>
                <Select
                  value={formData.demographics.location}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    demographics: { ...prev.demographics, location: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urban">Urban</SelectItem>
                    <SelectItem value="suburban">Suburban</SelectItem>
                    <SelectItem value="rural">Rural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Psychographics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Psychographics</h3>
            
            {/* Lifestyle */}
            <div>
              <Label>Lifestyle Characteristics</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {(Array.isArray(formData.psychographics?.lifestyle) ? formData.psychographics.lifestyle : []).map((item: string, index: number) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {item}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeLifestyle(index)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newLifestyle}
                  onChange={(e) => setNewLifestyle(e.target.value)}
                  placeholder="Add lifestyle characteristic"
                  onKeyPress={(e) => e.key === 'Enter' && addLifestyle()}
                />
                <Button onClick={addLifestyle} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Values */}
            <div>
              <Label>Core Values</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {(Array.isArray(formData.psychographics?.values) ? formData.psychographics.values : []).map((item: string, index: number) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {item}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeValue(index)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Add core value"
                  onKeyPress={(e) => e.key === 'Enter' && addValue()}
                />
                <Button onClick={addValue} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Pain Points */}
            <div>
              <Label>Pain Points</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {(Array.isArray(formData.psychographics?.painPoints) ? formData.psychographics.painPoints : []).map((item: string, index: number) => (
                  <Badge key={index} variant="destructive" className="flex items-center gap-1">
                    {item}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removePainPoint(index)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newPainPoint}
                  onChange={(e) => setNewPainPoint(e.target.value)}
                  placeholder="Add pain point"
                  onKeyPress={(e) => e.key === 'Enter' && addPainPoint()}
                />
                <Button onClick={addPainPoint} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Market Sizing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Market Sizing</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estimatedSize">Estimated Market Size</Label>
                <Input
                  id="estimatedSize"
                  type="number"
                  value={formData.estimatedSize}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    estimatedSize: parseInt(e.target.value) || 0 
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="targetSampleSize">Target Sample Size</Label>
                <Input
                  id="targetSampleSize"
                  type="number"
                  value={formData.targetSampleSize}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    targetSampleSize: parseInt(e.target.value) || 0 
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Strategic Rationale */}
          <div>
            <Label htmlFor="reasoning">Strategic Rationale</Label>
            <Textarea
              id="reasoning"
              value={formData.reasoning || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, reasoning: e.target.value }))}
              placeholder="Explain why this audience segment is important for your product..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
