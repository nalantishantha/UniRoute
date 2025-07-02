import { useState, useEffect } from 'react'

function TestConnection() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch('/api/universities/')
            .then(response => response.json())
            .then(data => {
                setData(data)
                setLoading(false)
            })
            .catch(error => {
                setError(error.message)
                setLoading(false)
            })
    }, [])

    if (loading) return <div>Testing connection...</div>
    if (error) return <div>Connection failed: {error}</div>

    return (
        <div>
            <h2>✅ Backend Connected!</h2>
            <p>Universities found: {data?.count || 0}</p>
        </div>
    )
}

export default TestConnection