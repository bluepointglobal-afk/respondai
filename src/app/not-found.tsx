export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: 'system-ui'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>404</h1>
        <p style={{ fontSize: '18px', marginBottom: '24px' }}>Page not found</p>
        <a href="/dashboard" style={{ 
          padding: '8px 16px',
          background: '#3b82f6',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px'
        }}>
          Go to Dashboard
        </a>
      </div>
    </div>
  )
}
