import React, { useState, useRef, useEffect } from 'react'
import ElephantCanvas from './ElephantCanvas'
import { SITE_CONFIG, MANAGEMENT_EVENTS, CULTURAL_EVENTS } from '../utils/confluenceData'

export default function ElephantMascotChat({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openrouter_key') || '')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Vanakkam! I am Gaja, the official YUKTI ’27 AI mascot. Ask me anything about the ₹20,00,000 prize pool, management arenas, cultural spectacles, registration fees, or Thiagarajar School of Management!`
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
    localStorage.setItem('openrouter_key', apiKey.trim())
    setShowKeyInput(false)
  }

  // Pre-baked smart fallback answers in case OpenRouter key isn't provided yet
  const getKnowledgeResponse = (query) => {
    const q = query.toLowerCase()
    if (q.includes('prize') || q.includes('money') || q.includes('cash') || q.includes('pool') || q.includes('20')) {
      return `The cumulative grand prize bounty for YUKTI ’27 is a monumental ₹20,00,000 (Twenty Lakhs Rupees), distributed across all flagship management arenas and cultural competitions along with national rolling trophies!`
    }
    if (q.includes('date') || q.includes('when') || q.includes('schedule')) {
      return `YUKTI ’27 is officially scheduled for ${SITE_CONFIG.dates} at the lush 17-acre residential campus of Thiagarajar School of Management (TSM), Madurai, Tamil Nadu.`
    }
    if (q.includes('management') || q.includes('events') || q.includes('arena') || q.includes('tracks')) {
      return `We have 8 flagship management tracks: 
1. The Last Knight (Best Manager - ₹2,50,000)
2. Optimize (Operations & Supply Chain - ₹1,50,000)
3. Fintorum (Finance & Quant - ₹1,50,000)
4. DataVista (Business Analytics - ₹1,50,000)
5. Emporia (Marketing & Brand - ₹1,50,000)
6. Manav Prasth (HR & Leadership - ₹1,50,000)
7. BizThrive: TerraPitch (Venture Inception - ₹2,00,000)
8. Quorum Quest (Corporate Quiz & Auctions - ₹1,00,000).`
    }
    if (q.includes('cultural') || q.includes('dance') || q.includes('music') || q.includes('fashion')) {
      return `YUKTI's cultural confluences include StyleVerse (Haute Couture - ₹2,00,000), Rhythm (Battle of the Bands - ₹1,75,000), Natya Kavya (Thematic Dance - ₹1,50,000), Vox Populi (Street Theatre - ₹1,50,000), and Lens (Photojournalism - ₹1,00,000)!`
    }
    if (q.includes('fee') || q.includes('cost') || q.includes('register') || q.includes('pay') || q.includes('qr')) {
      return `You can register through our integrated Portal page! Delegate fees start from ₹300 for individual contests up to ₹1,500 for large cultural crews. You can generate a Priority Dossier and scan the instant UPI QR code to complete payment locally!`
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

    // Check OpenRouter API key first
    const key = apiKey.trim() || localStorage.getItem('openrouter_key')

    if (key) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
            'HTTP-Referer': 'https://yukti27.tsm.ac.in',
            'X-Title': 'YUKTI 27 Assistant'
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.2-3b-instruct:free',
            messages: [
              {
                role: 'system',
                content: `You are Gaja, the regal, articulate, and welcoming 3D elephant mascot of YUKTI ’27 — the flagship national management and cultural summit at Thiagarajar School of Management (TSM), Madurai.
Key facts:
- Grand Prize Pool: ₹20,00,000 (Twenty Lakhs)
- Dates: February 19 - 21, 2027
- 8 Management Events (The Last Knight, Optimize, Fintorum, DataVista, Emporia, Manav Prasth, BizThrive, Quorum Quest)
- 5 Cultural Events (StyleVerse, Rhythm, Lens, Natya Kavya, Vox Populi)
- Keep responses concise, enthusiastic, dignified, and helpful.`
              },
              { role: 'user', content: userText }
            ]
          })
        })

        const data = await response.json()
        if (data.choices && data.choices[0]?.message?.content) {
          const reply = data.choices[0].message.content
          setMessages(prev => [...prev, { sender: 'bot', text: reply }])
          setIsLoading(false)
          return
        }
      } catch (err) {
        console.warn('OpenRouter call error, falling back to local knowledge base:', err)
      }
    }

    // Fast Intelligent Knowledge Response (Instant & Free)
    setTimeout(() => {
      const localAnswer = getKnowledgeResponse(userText) || 
        `I am happy to guide you! YUKTI ’27 features a massive ₹20,00,000 prize pool across 8 Management Arenas and 5 Cultural Events at TSM Madurai. Click the navigation tabs or the Registration Portal to explore full rulebooks and instant payment options!`

      setMessages(prev => [...prev, { sender: 'bot', text: localAnswer }])
      setIsLoading(false)
    }, 450)
  }

  return (
    <div className="mascot-dock">
      {/* Floating Elephant Button */}
      <div className="mascot-trigger-wrap">
        {!isOpen && (
          <div className="mascot-speech-bubble" onClick={() => setIsOpen(true)}>
            <span className="speech-badge mono">₹20L PRIZE POOL</span>
            <p>Ask Gaja anything ↗</p>
          </div>
        )}

        <button
          className={`mascot-btn ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Interact with YUKTI Mascot"
        >
          <ElephantCanvas />
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
                <small className="mono">Free Llama 3.2 / TSM Knowledge Core</small>
              </div>
            </div>
            <div className="header-actions">
              <button
                className="key-config-btn"
                title="Configure OpenRouter Key"
                onClick={() => setShowKeyInput(!showKeyInput)}
              >
                ⚙
              </button>
              <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>
          </div>

          {/* Optional OpenRouter Key Configuration Bar */}
          {showKeyInput && (
            <form onSubmit={handleSaveKey} className="key-input-drawer">
              <label className="mono" style={{ fontSize: '0.65rem', color: '#e9c878' }}>
                OpenRouter API Key (Optional — Free Llama / DeepSeek):
              </label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="key-input-field"
                />
                <button type="submit" className="btn" style={{ padding: '6px 12px', fontSize: '0.72rem' }}>
                  Save
                </button>
              </div>
              <small style={{ color: '#94a3b8', fontSize: '0.65rem' }}>
                If empty, Gaja uses the instant embedded YUKTI summit database.
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
              placeholder="Ask about events, rules, fees..."
              className="chat-text-input"
            />
            <button type="submit" className="chat-send-btn" disabled={!inputVal.trim() || isLoading}>
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
