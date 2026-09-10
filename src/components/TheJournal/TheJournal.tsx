import './TheJournal.css'
import kandyPeraheraImage from '../../assets/optimised/images/Kandy Perahera.jpg'
import kelaniTempleImage from '../../assets/images/Kelani temple.jpeg'
import nuwaraEliyaImage from '../../assets/optimised/images/NuwaraEliya .jpg'

const journalImages = {
  featured: kandyPeraheraImage,
  temple: kelaniTempleImage,
  tea: nuwaraEliyaImage,
} as const

const featuredParagraphs = [
  'We sat in the jeep for almost two hours and saw nothing. The guide said nothing either. He simply waited, as though waiting were part of the arrangement.',
  'Then, without announcement, they appeared — not as a spectacle, but as a procession. A matriarch leading her family across the plain, unhurried, as though they had all the time in the world.',
  'No one spoke. No one needed to. The elephants moved through the dry season grass with a patience that made our own restlessness feel slightly absurd.',
  'When they passed, the silence remained. Not empty silence — the kind that stays with you long after the engine starts again.',
  'Some experiences do not announce themselves. They simply arrive, and ask whether you are ready to receive them.',
]

export function TheJournal() {
  return (
    <section className="the-journal">
      <header className="journal-header">
        <div className="journal-header-left">
          <span className="journal-eyebrow">Field Notes From the Island</span>
          <h2 className="journal-headline">The Journal</h2>
          <p className="journal-subhead">
            Not a guide. A collection of things that were noticed, by people who were paying
            attention.
          </p>
        </div>
        <a href="#" className="journal-browse-link">
          Browse the Journal
        </a>
      </header>

      <article className="journal-featured">
        <img
          className="journal-featured-image"
          src={journalImages.featured}
          alt="Kandy Perahera procession in Sri Lanka"
        />
        <div className="journal-meta">
          <span>Wildlife &amp; Wilderness</span>
          <span className="journal-meta-rule"></span>
          <span className="journal-meta-location">Minneriya, the dry season — March 2025</span>
        </div>
        <h3 className="journal-article-title">Waiting for the Elephants</h3>
        <div className="journal-article-body">
          {featuredParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <a href="#" className="journal-continue-link">
          Continue Reading
        </a>
      </article>

      <div className="journal-grid">
        <article>
          <img
            className="journal-card-image"
            src={journalImages.temple}
            alt="Temple courtyard at dawn"
          />
          <div className="journal-meta">
            <span>Culture</span>
            <span className="journal-meta-rule"></span>
            <span className="journal-meta-location">Minneriya, the dry season — March 2025</span>
          </div>
          <h3 className="journal-article-title">A Temple Before Sunrise</h3>
          <p className="journal-card-body">
            The monk arrives before the birds do. By the first bell, he has swept the courtyard
            twice, lit the lamps, and said good morning to a cat that belongs to no one in
            particular. Nothing here is arranged for visitors. The lamps would be lit whether anyone
            came to watch or not. There is something comforting about that. In a world increasingly
            built around attention, some things are still done simply because they matter.
          </p>
          <a href="#" className="journal-continue-link">
            Continue Reading
          </a>
        </article>

        <article>
          <img className="journal-card-image" src={journalImages.tea} alt="Tea country landscape in Nuwara Eliya" />
          <div className="journal-meta">
            <span>Heritage</span>
            <span className="journal-meta-rule"></span>
            <span className="journal-meta-location">Minneriya, the dry season — March 2025</span>
          </div>
          <h3 className="journal-article-title">The Tea Maker&apos;s Hands</h3>
          <p className="journal-card-body">
            Ranjith has picked tea on the same eleven acres for forty-one years. He can smell rain
            coming an hour before the sky agrees with him. I asked what he thinks about, all those
            hours among the bushes. He looked at me as though the question itself was unusual. Then
            he smiled. &apos;I&apos;m not thinking about anything,&apos; he said. Standing there,
            watching him return to work, I wondered if perhaps that was the secret. Some people spend
            their lives searching for peace. Others quietly learn how to live inside it.
          </p>
          <a href="#" className="journal-continue-link">
            Continue Reading
          </a>
        </article>
      </div>
    </section>
  )
}
