import React, { useState, useRef, useEffect } from 'react'
import ElephantCanvas from './ElephantCanvas'
import { SITE_CONFIG, MANAGEMENT_EVENTS, CULTURAL_EVENTS } from '../utils/confluenceData'

export default function ElephantMascotChat({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [apiKey, setApiKey] = useState(() => 
    import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key') || ''
  )
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Vanakkam! I am Gaja, the official YUKTI ’27 summit guide. Ask me anything about the ₹20,00,000 grand prize pool, management arenas, cultural spectacles, schedule, or TSM Madurai!`
    }
  ])
  const [inputVal, setInputVal] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatBottomRef = useRef(null)

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSaveKey = (e) => {
    e.preventDefault()
    localStorage.setItem('gemini_api_key', apiKey.trim())
    setShowKeyInput(false)
  }

  // Pre-baked smart fallback knowledge base in case external API is not configured or fails
  const getKnowledgeResponse = (query) => {
    const q = query.toLowerCase()
    if (q.includes('prize') || q.includes('money') || q.includes('cash') || q.includes('pool') || q.includes('20') || q.includes('lakh')) {
      return `The cumulative grand prize bounty for YUKTI ’27 is a monumental ₹20,00,000 (Twenty Lakhs Rupees), distributed across all flagship management arenas and cultural competitions along with rolling national trophies and shields!`
    }
    if (q.includes('date') || q.includes('when') || q.includes('schedule') || q.includes('time')) {
      return `YUKTI ’27 is officially scheduled for ${SITE_CONFIG.dates} at the lush 17-acre residential campus of Thiagarajar School of Management (TSM), Madurai, Tamil Nadu.`
    }
    if (q.includes('management') || q.includes('events') || q.includes('arena') || q.includes('tracks')) {
      return `We have 8 flagship management tracks:\n` +
        `1. The Last Knight (Best Manager - ₹2,50,000)\n` +
        `2. Optimize (Operations & Supply Chain - ₹1,50,000)\n` +
        `3. Fintorum (Finance & Investment - ₹1,50,000)\n` +
        `4. DataVista (Business Analytics - ₹1,50,000)\n` +
        `5. Emporia (Marketing & Brand - ₹1,50,000)\n` +
        `6. Manav Prasth (HR & Leadership - ₹1,50,000)\n` +
        `7. BizThrive: TerraPitch (Venture Inception - ₹2,00,000)\n` +
        `8. Quorum Quest (Corporate Quiz & Auctions - ₹1,00,000).`
    }
    if (q.includes('cultural') || q.includes('dance') || q.includes('music') || q.includes('fashion') || q.includes('band')) {
      return `YUKTI's cultural confluences include:\n` +
        `• StyleVerse (Haute Couture Fashion - ₹2,00,000)\n` +
        `• Rhythm (Battle of the Bands - ₹1,75,000)\n` +
        `• Natya Kavya (Thematic Classical/Contemporary Dance - ₹1,50,000)\n` +
        `• Vox Populi (Street Theatre - ₹1,50,000)\n` +
        `• Lens (Photojournalism & Short Filmmaking - ₹1,00,000)!`
    }
    if (q.includes('fee') || q.includes('cost') || q.includes('register') || q.includes('pay') || q.includes('qr') || q.includes('upi')) {
      return `Registration is live through our Portal! Individual events start at ₹300–₹500, while group/contingent entries range from ₹750–₹1,500. You can submit team records, generate your verified registration docket, and complete payment via instant UPI QR code directly on the portal page.`
    }
    if (q.includes('tsm') || q.includes('thiagarajar') || q.includes('madurai') || q.includes('college')) {
      return `Thiagarajar School of Management (TSM) was founded in 1962 by industrialist & philanthropist Karumuttu Thiagarajan Chettiar in Madurai. It is NAAC A+ accredited, NBA accredited, and recognized as one of South India's premier B-schools.`
    }
    return null
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputVal.trim() || isLoading) return

    const userText = inputVal.trim()
    setInputVal('')
    setMessages(prev => [...prev, { sender: 'user', text: userText }])
    setIsLoading(true)

    // Check Gemini API key first (supports VITE_GEMINI_API_KEY env or user-saved key)
    const key = apiKey.trim() || import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key')

    if (key) {
      try {
        const fullSystemContext = `
You are Gaja, the regal, intelligent, articulate, and welcoming 3D elephant mascot of YUKTI ’27.
YUKTI ’27 is South India's premier national management & cultural confluence hosted by Thiagarajar School of Management (TSM), Madurai.

CONSTRAINTS & RULES:
1. NEVER mention the phrase "ai + human touch". Emphasize strategic intelligence, leadership, grandeur, and excellence.
2. The GRAND PRIZE POOL is ₹20,00,000 (Twenty Lakhs Rupees), distributed across all flagship management arenas and cultural spectacles along with national trophies.
3. Event Dates: ${SITE_CONFIG.dates} at TSM Madurai (a 17-acre residential campus founded in 1962 by Karumuttu Thiagarajan Chettiar, NAAC A+ & NBA accredited).
4. Management Arenas (8 Tracks):
${MANAGEMENT_EVENTS.map(ev => `   - ${ev.title} (${ev.domain}): Team: ${ev.teamSize} | Fee: ${ev.fee} | Prize: ${ev.prizes} | Focus: ${ev.shortDesc}`).join('\n')}
5. Cultural Events (5 Tracks):
${CULTURAL_EVENTS.map(c => `   - ${c.title} (${c.category}): Team: ${c.teamSize} | Fee: ${c.fee} | Prize: ${c.prizes} | Tagline: ${c.tagline}`).join('\n')}
6. Registration & Payment:
   - Participants register via the Registration Portal on the website.
   - Fees range from ₹300 (individual) to ₹1,500 (group).
   - Instant UPI QR code payment with local confirmation receipt generation.
7. Keep answers structured, dignified, concise, and helpful.
`
        // Google AI Studio / Gemini API call
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: `[System Instruction: ${fullSystemContext}]\n\nUser Question: ${userText}` }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 350,
              }
            })
          }
        )

        const data = await response.json()
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (candidate) {
          setMessages(prev => [...prev, { sender: 'bot', text: candidate }])
          setIsLoading(false)
          return
        }
      } catch (err) {
        console.warn('Gemini API call error, falling back to local knowledge base:', err)
      }
    }

    // Fast Intelligent Knowledge Response (Instant Fallback)
    setTimeout(() => {
      const localAnswer = getKnowledgeResponse(userText) || 
        `I am happy to guide you! YUKTI ’27 features a monumental ₹20,00,000 grand prize pool across 8 Management Arenas and 5 Cultural Events at TSM Madurai. Click the navigation tabs or the Registration Portal to explore full rulebooks and instant payment options!`

      setMessages(prev => [...prev, { sender: 'bot', text: localAnswer }])
      setIsLoading(false)
    }, 350)
  }

  return (
    <div className="mascot-dock">
      {/* Floating Elephant Button */}
      <div className="mascot-trigger-wrap">
        {!isOpen && (
          <div className="mascot-speech-bubble" onClick={() => setIsOpen(true)}>
            <span className="speech-badge mono">₹20L PRIZE POOL</span>
            <p>Ask Gaja anything</p>
          </div>
        )}

        <button
          className={`mascot-btn ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Interact with YUKTI Mascot"
        >
          <div className="mascot-canvas-holder">
            <ElephantCanvas />
          </div>
          <div className="mascot-pulse-ring" />
        </button>
      </div>

      {/* Chat Drawer Window */}
      {isOpen && (
        <div className="mascot-chat-window">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-title-group">
              <span className="mascot-avatar-dot" />
              <div>
                <h4>Gaja · YUKTI ’27 AI Guide</h4>
                <small className="mono">TSM Knowledge Core · Interactive Guide</small>
              </div>
            </div>
            <div className="header-actions">
              <button
                className="key-config-btn"
                title="Configure Studio Key"
                onClick={() => setShowKeyInput(!showKeyInput)}
              >
                ⚙
              </button>
              <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>
          </div>

          {/* Optional Google Studio API Key Configuration Drawer */}
          {showKeyInput && (
            <form onSubmit={handleSaveKey} className="key-input-drawer">
              <label className="mono" style={{ fontSize: '0.65rem', color: 'var(--gold)' }}>
                Google AI Studio Key (Optional):
              </label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="key-input-field"
                />
                <button type="submit" className="btn" style={{ padding: '6px 12px', fontSize: '0.72rem' }}>
                  Save
                </button>
              </div>
              <small style={{ color: '#94a3b8', fontSize: '0.65rem' }}>
                If empty, Gaja uses the instant embedded YUKTI summit knowledge core.
              </small>
            </form>
          )}

          {/* Messages Body */}
          <div className="chat-messages-scroll">
            {messages.map((m, idx) => (
              <div key={idx} className={`chat-bubble-row ${m.sender === 'user' ? 'user-row' : 'bot-row'}`}>
                {m.sender === 'bot' && <div className="bot-mini-icon">🐘</div>}
                <div className={`chat-bubble ${m.sender === 'user' ? 'bubble-user' : 'bubble-bot'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-bubble-row bot-row">
                <div className="bot-mini-icon">🐘</div>
                <div className="chat-bubble bubble-bot typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="chat-quick-prompts">
            <button onClick={() => setInputVal('What is the total prize pool?')}>
              ₹20L Prize Pool?
            </button>
            <button onClick={() => setInputVal('Tell me about Best Manager event')}>
              The Last Knight?
            </button>
            <button onClick={() => setInputVal('How to register and pay with QR?')}>
              Payment & QR?
            </button>
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="chat-input-bar">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask Gaja about YUKTI ’27..."
              className="chat-text-input"
            />
            <button type="submit" className="chat-send-btn" disabled={!inputVal.trim() || isLoading}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
