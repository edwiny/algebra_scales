import { useState, useEffect } from 'react'
import Workspace from './components/Workspace'
import VictoryModal from './components/VictoryModal'
import { getDefaultEquation, equations } from './data/equations'
import { checkVictoryCondition, calculateBalance, canDivideBy } from './utils/balanceLogic'
import { stateToEquation } from './utils/algebraParser'
import { WEBSITE_NAME, WEBSITE_URL, SUPPORT_EMAIL } from './config/constants'
import './App.css'

function App() {
  const [activeEquation, setActiveEquation] = useState(getDefaultEquation())
  const [activePage, setActivePage] = useState('app')
  const [equationState, setEquationState] = useState({
    leftSide: [],
    rightSide: [],
  })
  const [isVictory, setIsVictory] = useState(false)
  const [pendingRemoval, setPendingRemoval] = useState(null)

  const initializeEquation = (equation) => {
    setIsVictory(false)
    setPendingRemoval(null)

    setEquationState({
      leftSide: equation.leftSide,
      rightSide: equation.rightSide,
    })
  }

  useEffect(() => {
    initializeEquation(activeEquation)
  }, [])

  useEffect(() => {
    const resolvePage = () => {
      const hash = window.location.hash.replace('#', '')
      if (['terms', 'privacy', 'contact'].includes(hash)) {
        setActivePage(hash)
        return
      }

      setActivePage('app')
    }

    resolvePage()
    window.addEventListener('hashchange', resolvePage)

    return () => {
      window.removeEventListener('hashchange', resolvePage)
    }
  }, [])

  useEffect(() => {
    const victory = checkVictoryCondition(
      equationState.leftSide,
      equationState.rightSide,
      activeEquation.solution
    )
    setIsVictory(victory)
  }, [equationState, activeEquation.solution])

  const handleReset = () => {
    initializeEquation(activeEquation)
  }

  const handleNextEquation = () => {
    const currentIndex = equations.findIndex((eq) => eq.id === activeEquation.id)
    if (currentIndex < equations.length - 1) {
      const nextEquation = equations[currentIndex + 1]
      setActiveEquation(nextEquation)
      initializeEquation(nextEquation)
    }
  }

  const handlePreviousEquation = () => {
    const currentIndex = equations.findIndex((eq) => eq.id === activeEquation.id)
    if (currentIndex > 0) {
      const prevEquation = equations[currentIndex - 1]
      setActiveEquation(prevEquation)
      initializeEquation(prevEquation)
    }
  }

  const handleRemoveItem = (side, index, item) => {
    const otherSide = side === 'leftSide' ? 'rightSide' : 'leftSide'
    const hasMatchingItem = equationState[otherSide].some(
      (candidate) => candidate.type === item.type
    )

    setEquationState((prev) => ({
      ...prev,
      [side]: prev[side].filter((_, itemIndex) => itemIndex !== index),
    }))

    if (pendingRemoval) {
      const isMatchingSide = side !== pendingRemoval.fromSide
      const isMatchingType = item.type === pendingRemoval.type

      if (isMatchingSide && isMatchingType) {
        setPendingRemoval(null)
      }

      return
    }

    const isBalanced = calculateBalance(
      equationState.leftSide,
      equationState.rightSide,
      activeEquation.solution
    ) === 0

    if (hasMatchingItem && isBalanced) {
      setPendingRemoval({
        type: item.type,
        fromSide: side,
        item,
        index,
      })
    }
  }

  const handleCancelPendingRemoval = () => {
    if (!pendingRemoval) return

    setEquationState((prev) => {
      const updatedSide = [...prev[pendingRemoval.fromSide]]
      updatedSide.splice(pendingRemoval.index, 0, pendingRemoval.item)

      return {
        ...prev,
        [pendingRemoval.fromSide]: updatedSide,
      }
    })

    setPendingRemoval(null)
  }

  const handleCloseVictory = () => {
    setIsVictory(false)
  }

  const handleDivide = () => {
    if (!availableDivideOperation) return

    const { divisor, sideWithUnknowns, sideWithValue } = availableDivideOperation

    setEquationState((prev) => {
      const newState = { ...prev }

      // Reduce unknowns from divisor to 1
      const unknowns = newState[sideWithUnknowns].filter(item => item.type === 'unknown')
      const nonUnknowns = newState[sideWithUnknowns].filter(item => item.type !== 'unknown')
      
      // Keep one unknown and add back non-unknowns
      newState[sideWithUnknowns] = [
        { type: 'unknown', value: 1 },
        ...nonUnknowns
      ]

      // Divide the other side's values by divisor
      const otherSideItems = newState[sideWithValue].filter(item => item.type !== 'unknown')
      const otherSideUnknowns = newState[sideWithValue].filter(item => item.type === 'unknown')
      
      // Calculate how many weights we need
      const numWeights = otherSideItems.filter(item => item.type === 'weight').length
      const numBalloons = otherSideItems.filter(item => item.type === 'balloon').length
      
      // New counts after division
      const newNumWeights = Math.floor(numWeights / divisor)
      const newNumBalloons = Math.floor(numBalloons / divisor)

      newState[sideWithValue] = [
        ...Array(newNumWeights).fill({ type: 'weight', value: 1 }),
        ...Array(newNumBalloons).fill({ type: 'balloon', value: -1 }),
        ...otherSideUnknowns
      ]

      return newState
    })
  }

  // Calculate if division is possible
  const availableDivideOperation = !pendingRemoval && !isVictory
    ? canDivideBy(equationState.leftSide, equationState.rightSide)
    : null

  const currentEquationIndex = equations.findIndex((eq) => eq.id === activeEquation.id)
  const currentStep = currentEquationIndex + 1
  const totalSteps = equations.length
  const originalEquation = stateToEquation({ leftSide: activeEquation.leftSide, rightSide: activeEquation.rightSide })

  const staticPageContent = {
    terms: {
      title: 'Terms of Service',
      subtitle: `Thank you for using ${WEBSITE_NAME}. By accessing the app, you agree to the following.`,
      sections: [
        {
          title: `About ${WEBSITE_NAME}`,
          body: [
            `${WEBSITE_NAME} (${WEBSITE_URL}) is a free educational tool designed to help students practise algebra. It is provided as a personal project with no warranty or guarantee of availability.`,
          ],
        },
        {
          title: 'Educational Use',
          body: [
            `${WEBSITE_NAME} is free to use for personal and educational purposes.`,
            'You may share the app with students and educators as long as the experience remains free and unmodified.',
            'You may not copy, reproduce, or redistribute the code, design, or content without permission.',
          ],
        },
        {
          title: 'Intellectual Property',
          body: [
            'The pedagogical concepts used in explanations are not claimed as proprietory. All other content, code, and visual design on Algebra Scales is © 2026 Algebra Scales.',
          ],
        },
        {
          title: 'Disclaimer',
          body: [
            `${WEBSITE_NAME} is provided "as is" without warranty of any kind. We make no guarantees about accuracy, availability, or suitability for any particular purpose. Use of the site is at your own risk.`,
          ],
        },
        {
          title: 'Updates',
          body: [
            'We may update these terms periodically to reflect improvements to the learning experience.',
            'Continued use means you accept the most recent version.',
          ],
        },
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Your privacy is important. This policy explains what we collect and how it is used.',
      sections: [
        {
          title: 'Overview',
          body: [
            `${WEBSITE_NAME} (${WEBSITE_URL}) is a free, static educational web application that helps students practise algebra through interactive visualisations.`,
            'We are committed to protecting your privacy and being transparent about how we handle data.',
            `This policy explains what information is collected when you use ${WEBSITE_NAME}, how it is used, and your rights in relation to that information.`,
          ],
        },
        {
          title: 'Information We Collect',
          body: [
            `${WEBSITE_NAME} does not require you to create an account or provide any personal information to use the site.`,
            'However, we use Google Analytics to understand how visitors use the site. Google Analytics automatically collects the following types of information when you visit:',
          ],
          bullets: [
            'Your approximate location (country and city, derived from your IP address).',
            'The type of device, browser, and operating system you are using.',
            'Pages you visit and how long you spend on them.',
            'How you arrived at the site (e.g. search engine, direct link).',
            'Interactions with the application (e.g. button clicks, page navigation).',
          ],
        },
        {
          title: 'Cookies',
          body: [
            'Google Analytics uses cookies — small text files stored on your device — to distinguish visitors and track sessions.',
            `You can disable cookies through your browser settings. Doing so will not affect your ability to use ${WEBSITE_NAME}, but it will prevent Google Analytics from collecting usage data about your visit.`
          ],
        },
        {
          title: 'How we use this information',
          body: [
            'We do not use this information for advertising, and we do not sell or share it with third parties for commercial purposes.',
            'The information collected via Google Analytics is used solely to:'
          ],
          bullets: [
            'Understand which parts of the site are used most',
            'Identify technical issues or areas for improvement',
            'Inform decisions about future content and features'
          ]
        },

      ],
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'We love hearing from educators, students, and families. Here is how to reach us.',
      sections: [
        {
          title: 'Email',
          body: [
            `Send feedback or questions to ${SUPPORT_EMAIL} and we will be in touch.`,
          ],
        }
      ],
    },
  }

  const renderStaticPage = () => {
    const content = staticPageContent[activePage]
    if (!content) return null

    return (
      <main className="app-main static-page">

        <div className="static-back">
          <a className="back-link" href="#">← Back to the app</a>
        </div>

        <section className="intro-card static-card" aria-label={content.title}>
          <div className="intro-header">
            <p className="intro-title">{content.title}</p>
            <p className="intro-subtitle">{content.subtitle}</p>
          </div>
        </section>


        <section className="static-sections">
          {content.sections.map((section) => (
            <div className="static-section" key={section.title}>
              <h2>{section.title}</h2>
              {section.body?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets ? (
                <ul className="static-list">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </section>
      </main>
    )
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="app-header-copy">
          <p className="eyebrow">visual algebra solver</p>
          <h1>{WEBSITE_NAME}</h1>
          <p className="app-subtitle">
            Learn algebra with visual scales — for free.
          </p>
        </div>

        <div className="progress-card" aria-label={`Equation ${currentStep} of ${totalSteps}`}>
          <span className="progress-label">Progress</span>
          <strong>{currentStep} / {totalSteps}</strong>
          
        </div>
      </header>

      {activePage === 'app' ? (
        <main className="app-main">
          <section className="intro-card" aria-label="How the algebra model works">
            <div className="intro-header">
              <span className="intro-label">Step 1 — Current challenge</span>
              <p className="intro-title">{activeEquation.name}</p>
              <p className="intro-subtitle">{activeEquation.description}</p>
            </div>
          </section>

          <Workspace
            equationState={equationState}
            setEquationState={setEquationState}
            pendingRemoval={pendingRemoval}
            onRemoveItem={handleRemoveItem}
            onCancelPendingRemoval={handleCancelPendingRemoval}
            solution={activeEquation.solution}
            divideOperation={availableDivideOperation}
            onDivide={handleDivide}
            isVictory={isVictory}
            onNextEquation={handleNextEquation}
            hasNextEquation={currentEquationIndex < equations.length - 1}
            currentEquationIndex={currentEquationIndex}
            equations={equations}
          />

          <div className="reset-section">
            <div className="footer-legend">
              <span className="legend-title">Legend</span>
              <div className="legend-items">
                <span className="legend-pill legend-weight">Weight = +1</span>
                <span className="legend-pill legend-balloon">Balloon = -1</span>
                <span className="legend-pill legend-unknown">Unknown = x</span>
              </div>
            </div>
            <div className="reset-buttons">
              {currentEquationIndex > 0 && (
                <button
                  onClick={handlePreviousEquation}
                  className="reset-button previous-button"
                  aria-label="Go to the previous equation"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleReset}
                className="reset-button"
                aria-label="Reset the current equation to its initial state"
              >
                Reset
              </button>
            </div>
          </div>
        </main>
      ) : (
        renderStaticPage()
      )}

      <footer className="app-footer">
        <div className="footer-links" aria-label="Legal and support">
          <a href="#terms">Terms of Service</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#contact">Contact Us</a>
        </div>
        <p>© {new Date().getFullYear()} {WEBSITE_NAME}. All rights reserved.</p>
      </footer>

      <VictoryModal
        isVisible={isVictory && currentEquationIndex === equations.length - 1}
        solution={activeEquation.solution}
        originalEquation={originalEquation}
        onNextEquation={handleNextEquation}
        onReset={handleReset}
        onClose={handleCloseVictory}
        hasNextEquation={currentEquationIndex < equations.length - 1}
        isFinalEquation={currentEquationIndex === equations.length - 1}
      />
    </div>
  )
}

export default App
