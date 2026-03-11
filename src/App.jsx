import { useState, useEffect } from 'react'
import Workspace from './components/Workspace'
import EquationDisplay from './components/EquationDisplay'
import VictoryModal from './components/VictoryModal'
import { getDefaultEquation, equations } from './data/equations'
import { checkVictoryCondition, calculateBalance } from './utils/balanceLogic'
import { stateToEquation } from './utils/algebraParser'
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

  const currentEquationIndex = equations.findIndex((eq) => eq.id === activeEquation.id)
  const currentStep = currentEquationIndex + 1
  const totalSteps = equations.length
  const originalEquation = stateToEquation({ leftSide: activeEquation.leftSide, rightSide: activeEquation.rightSide })

  const staticPageContent = {
    terms: {
      title: 'Terms of Service',
      subtitle: 'Thank you for using MathSlay. By accessing the app, you agree to the following.',
      sections: [
        {
          title: 'About MathSlay',
          body: [
            'MathSlay (mathslay.com) is a free educational tool designed to help students practise algebra. It is provided as a personal project with no warranty or guarantee of availability.',

          ],
        },
        {
          title: 'Educational Use',
          body: [
            'MathSlay is free to use for personal and educational purposes.',
            'You may share the app with students and educators as long as the experience remains free and unmodified.',
            'You may not copy, reproduce, or redistribute the code, design, or content without permission.',
          ],
        },
        {
          title: 'Intellectual Property',
          body: [
            'The pedagogical concepts used in explanations are not claimed as proprietory. All other content, code, and visual design on MathSlay is © 2026 MathSlay.',
          ],
        },
        {
          title: 'Disclaimer',
          body: [
            'MathSlay is provided "as is" without warranty of any kind. We make no guarantees about accuracy, availability, or suitability for any particular purpose. Use of the site is at your own risk.',
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
            'MathSlay (mathslay.com) is a free, static educational web application that helps students practise algebra through interactive visualisations.',
            'We are committed to protecting your privacy and being transparent about how we handle data.',
            'This policy explains what information is collected when you use MathSlay, how it is used, and your rights in relation to that information.',
          ],
        },
        {
          title: 'Information We Collect',
          body: [
            'MathSlay does not require you to create an account or provide any personal information to use the site.',
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
            'You can disable cookies through your browser settings. Doing so will not affect your ability to use MathSlay, but it will prevent Google Analytics from collecting usage data about your visit.'
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
            'Send feedback or questions to mathslayapp@gmail.com and we will be in touch.',
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
          <h1>MathSlay</h1>
          <p className="app-subtitle">
            Slay at math
          </p>
        </div>

        <div className="progress-card" aria-label={`Equation ${currentStep} of ${totalSteps}`}>
          <span className="progress-label">Equation</span>
          <strong>{currentStep} / {totalSteps}</strong>
          <span className="progress-name">{activeEquation.name}</span>
        </div>
      </header>

      {activePage === 'app' ? (
        <main className="app-main">
          <section className="intro-card" aria-label="How the algebra model works">
            <div className="intro-header">
              <span className="intro-label">Current challenge</span>
              <p className="intro-title">{activeEquation.name}</p>
              <p className="intro-subtitle">{activeEquation.description}</p>
            </div>

            <div className="legend-card">
              <span className="legend-title">Legend</span>
              <div className="legend-items">
                <span className="legend-pill legend-weight">Weight = +1</span>
                <span className="legend-pill legend-balloon">Balloon = -1</span>
                <span className="legend-pill legend-unknown">Triangle = x</span>
              </div>
            </div>

            <p className="micro-tip">
              Tip: remove matching items from both sides until x is by itself.
            </p>
          </section>

          <EquationDisplay equationState={equationState} solution={activeEquation.solution} />

          <Workspace
            equationState={equationState}
            setEquationState={setEquationState}
            pendingRemoval={pendingRemoval}
            onRemoveItem={handleRemoveItem}
            onCancelPendingRemoval={handleCancelPendingRemoval}
            solution={activeEquation.solution}
          />

          <div className="reset-section">
            <button
              onClick={handleReset}
              className="reset-button"
              aria-label="Reset the current equation to its initial state"
            >
              Start Over
            </button>
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
        <p>© {new Date().getFullYear()} MathSlay. All rights reserved.</p>
      </footer>

      <VictoryModal
        isVisible={isVictory}
        solution={activeEquation.solution}
        originalEquation={originalEquation}
        onNextEquation={handleNextEquation}
        onReset={handleReset}
        onClose={handleCloseVictory}
        hasNextEquation={currentEquationIndex < equations.length - 1}
      />
    </div>
  )
}

export default App











