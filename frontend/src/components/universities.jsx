import { useState, useEffect } from 'react'

function Universities() {
    const [universities, setUniversities] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/universities/')
            .then(response => response.json())
            .then(data => {
                setUniversities(data.universities)
                setLoading(false)
            })
    }, [])

    if (loading) return <div>Loading universities...</div>

    return (
        <div>
            <h2>🎓 Sri Lankan Universities</h2>
            {universities.map(uni => (
                <div key={uni.id} style={{
                    border: '1px solid #ccc', 
                    margin: '10px', 
                    padding: '15px',
                    borderRadius: '5px'
                }}>
                    <h3>{uni.name}</h3>
                    <p>📍 Location: {uni.location}</p>
                    <p>🏛️ District: {uni.district}</p>
                </div>
            ))}
        </div>
    )
}

export default Universities