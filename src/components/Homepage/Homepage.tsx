import { useEffect, useRef, useState } from 'react'
import './Homepage.css'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import royaleIslesLogoImage from '../../assets/images/logo_bg_remove.png'

/*const images = {
  hero: '/figma-homepage/hero.jpg',
  consultation: '/figma-homepage/consultation.jpg',
  teaEstate: '/figma-homepage/tea-estate.jpg',
  artisan: '/figma-homepage/artisan.jpg',
  beachDinner: '/figma-homepage/beach-dinner.jpg',
  junglePavilion: '/figma-homepage/jungle-pavilion.jpg',
  ancientRuins: '/figma-homepage/ancient-ruins.jpg',
  highlandGolden: '/figma-homepage/highland-golden.jpg',
  coastJungle: '/figma-homepage/coast-jungle.jpg',
  travellerOutcrop: '/figma-homepage/traveller-outcrop.jpg',
  journalHours: '/figma-homepage/journal-hours.jpg',
  journalGuide: '/figma-homepage/journal-guide.jpg',
  hiroko: '/figma-homepage/hiroko.jpg',
  guideCover: '/figma-homepage/guide-cover.jpg',
}*/

const heroVideo = '/figma-homepage/hero.mp4'
const heroPoster = '/figma-homepage/hero.jpg'

export function Homepage() {
  const pageRef = useRef<HTMLElement>(null)
  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const [isHeroMuted, setIsHeroMuted] = useState(false)

  useScrollReveal(pageRef)

  useEffect(() => {
    const video = heroVideoRef.current
    if (!video) return

    video.volume = 1
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')

    let hasStartedPlaying = false

    const attemptPlay = async () => {
      // Guard against loadeddata/canplay firing again after playback has
      // already started — re-issuing play() on a playing video can cause
      // an audible restart/overlap ("double sound").
      if (hasStartedPlaying) return

      video.muted = false

      try {
        await video.play()
        hasStartedPlaying = true
        setIsHeroMuted(false)
        return
      } catch {
        video.muted = true
        setIsHeroMuted(true)

        try {
          await video.play()
          hasStartedPlaying = true
        } catch {
          // Autoplay can still be blocked on some devices.
        }
      }
    }

    const handleLoadedData = () => {
      void attemptPlay()
    }

    const handleCanPlay = () => {
      void attemptPlay()
    }

    void attemptPlay()
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('canplay', handleCanPlay)

    const handleVisibilityChange = () => {
      if (!document.hidden && video.paused) {
        void video.play().catch(() => {})
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('canplay', handleCanPlay)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const toggleHeroSound = () => {
    const video = heroVideoRef.current
    if (!video) return

    if (video.muted) {
      video.muted = false
      video.volume = 1
      setIsHeroMuted(false)
      void video.play().catch(() => {})
    } else {
      video.muted = true
      setIsHeroMuted(true)
    }
  }

  return (
    <main className="figma-homepage" ref={pageRef} data-node-id="101:12274">
      <section className="figma-hero" data-node-id="101:12275">
        <video
          ref={heroVideoRef}
          className="figma-hero-video"
          src={heroVideo}
          poster={heroPoster}
          autoPlay
          muted={isHeroMuted}
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
        />
        <button
          type="button"
          className="figma-hero-sound"
          onClick={toggleHeroSound}
          aria-label={isHeroMuted ? 'Unmute video' : 'Mute video'}
        >
          <span aria-hidden="true" data-state={isHeroMuted ? 'muted' : 'unmuted'} />
          <small>{isHeroMuted ? 'Unmute sound' : 'Mute sound'}</small>
        </button>
        <div className="figma-hero-overlay" />
        <div className="figma-hero-content">
          <h1>
            Sri Lanka,
            <span>held privately.</span>
          </h1>
          <p className="figma-hero-choose">           
          </p>
          <div className="figma-hero-actions">
            <a className="figma-hero-action-primary" href="/itineraries">
              Designed Packages
            </a>
            <a className="figma-hero-action-ghost" href="/expectations">
              Design Your Own Package
            </a>
          </div>
        </div>
      </section>

      <section className="figma-experiences" id="experiences" data-node-id="103:12794">
        <div className="figma-container">
          <header className="figma-section-header figma-experiences-header reveal">
            <div>
              <p className="figma-overline">Inspiration Before Curation</p>
              <h2>
                Ways Into The{' '}
                <span className="figma-experiences-brand">
                  <img
                    className="figma-experiences-mark"
                    src={royaleIslesLogoImage}
                    alt=""
                    aria-hidden="true"
                  />
                  Royale Isles
                </span>
              </h2>
              <p>
                These Discovery Worlds are not decisions. They are editorial lenses for understanding
                Sri Lanka before any journey is saved, scored, or shaped around you.
              </p>
            </div>
            <aside className="figma-experience-brief">
              <span>First Curation Step</span>
              <p>
                When one world feels like yours, continue to Expectations. That is where your
                preferences begin shaping My Journey.
              </p>
              <a href="/expectations">Continue To Expectations</a>
            </aside>
          </header>

        </div>
      </section>

      <section className="figma-invitation" id="begin" data-node-id="103:12992">
        <div className="figma-invitation-inner reveal">
          <div className="figma-invitation-mark" aria-hidden="true">
            ✦
          </div>
          <p className="figma-overline">A Personal Invitation</p>
          <h2>Begin With a Private Conversation</h2>
          <p>
            Tell us who is travelling, what must be protected, what should feel effortless, and what
            would make Sri Lanka feel personally meaningful. We will respond with considered next
            steps, not a catalogue.
          </p>
          <a className="figma-invitation-cta" href="/expectations">
            Begin With Expectaions
          </a>
          <small>Explore the island privately, with no obligation.</small>
          <p className="figma-invitation-aside">
            Planning your arrival?{' '}
            <a href="/travel-preparation#assurance">See what we arrange before you land</a>
          </p>
        </div>
      </section>

    </main>
  )
}