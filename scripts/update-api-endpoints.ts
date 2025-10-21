/**
 * Script to update all API endpoints to use authenticated users instead of demo user
 */

import fs from 'fs'
import path from 'path'

const API_DIR = path.join(__dirname, '../src/app/api')

// Files to update with their patterns
const filesToUpdate = [
  {
    file: 'test/create/route.ts',
    patterns: [
      {
        search: "const user = await prisma.user.findUnique({\n      where: { email: 'demo@respondai.com' }\n    })",
        replace: "const session = await getServerSession(authOptions)\n    if (!session?.user?.email) {\n      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })\n    }\n\n    const user = await prisma.user.findUnique({\n      where: { email: session.user.email }\n    })"
      }
    ]
  },
  {
    file: 'test/[testId]/audiences/route.ts',
    patterns: [
      {
        search: "const user = await prisma.user.findUnique({\n      where: { email: 'demo@respondai.com' }\n    })",
        replace: "const session = await getServerSession(authOptions)\n    if (!session?.user?.email) {\n      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })\n    }\n\n    const user = await prisma.user.findUnique({\n      where: { email: session.user.email }\n    })"
      }
    ]
  },
  {
    file: 'test/[testId]/simulation/route.ts',
    patterns: [
      {
        search: "const user = await prisma.user.findUnique({\n      where: { email: session.user.email }\n    })",
        replace: "const session = await getServerSession(authOptions)\n    if (!session?.user?.email) {\n      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })\n    }\n\n    const user = await prisma.user.findUnique({\n      where: { email: session.user.email }\n    })"
      }
    ]
  }
]

function updateFile(filePath: string, patterns: any[]) {
  try {
    const fullPath = path.join(API_DIR, filePath)
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ File not found: ${fullPath}`)
      return false
    }
    
    let content = fs.readFileSync(fullPath, 'utf8')
    let updated = false
    
    patterns.forEach(pattern => {
      if (content.includes(pattern.search)) {
        content = content.replace(pattern.search, pattern.replace)
        updated = true
        console.log(`✅ Updated pattern in ${filePath}`)
      }
    })
    
    if (updated) {
      fs.writeFileSync(fullPath, content)
      console.log(`✅ File updated: ${filePath}`)
    } else {
      console.log(`ℹ️  No changes needed: ${filePath}`)
    }
    
    return updated
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error)
    return false
  }
}

function main() {
  console.log('🚀 Updating API endpoints to use authenticated users...')
  
  let updatedCount = 0
  
  filesToUpdate.forEach(({ file, patterns }) => {
    if (updateFile(file, patterns)) {
      updatedCount++
    }
  })
  
  console.log(`\n✅ Updated ${updatedCount} files`)
  console.log('\n🎯 Next steps:')
  console.log('1. Test the updated endpoints')
  console.log('2. Create login/register pages')
  console.log('3. Add authentication middleware')
  console.log('4. Test user isolation')
}

if (require.main === module) {
  main()
}

export { updateFile, filesToUpdate }
