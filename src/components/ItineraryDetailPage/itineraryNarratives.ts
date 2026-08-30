import { itineraryImages } from './itineraryImages'

/** A stay (or a waypoint) along a journey. */
export type ItineraryStay = {
  kind?: 'stay'
  /** The large numeral: "01", "1–2", "13". */
  number: string
  /** Reads before the place: "Day 1", "Nights 1–2", "Waypoint". */
  label: string
  place: string
  title: string
  copy: readonly string[]
  /** An aside under the copy, e.g. that a stop is passed through, not slept in. */
  note?: string
  image?: string
  imageAlt?: string
}

/** A break in the run of stays — used where the Dynasty route forks. */
export type ItineraryDivider = {
  kind: 'divider'
  label?: string
  title: string
  copy?: readonly string[]
}

export type ItineraryEntry = ItineraryStay | ItineraryDivider

export type ItineraryNarrative = {
  slug: string
  /** Matches the journey name on the Itineraries page. */
  name: string
  eyebrow: string
  duration: string
  nights: string
  lede: string
  heroImage: string
  heroImageAlt: string
  entries: readonly ItineraryEntry[]
  /** Only the first reading carries a closing passage of its own. */
  closing?: {
    title: string
    copy: readonly string[]
  }
}

export function isDivider(entry: ItineraryEntry): entry is ItineraryDivider {
  return entry.kind === 'divider'
}

/**
 * The narratives, supplied by the client as Word documents and transcribed
 * here. Where a property name was left blank in a source document the sentence
 * is phrased around the gap until the name is confirmed.
 */
export const itineraryNarratives: readonly ItineraryNarrative[] = [
  {
    slug: 'discovery',
    name: 'Discovery',
    eyebrow: 'The First Reading',
    duration: '10 Days',
    nights: '9 Nights',
    lede:
      'Four nights on the Indian Ocean, framing a journey through the island’s ancient heart and misted hills in between.',
    heroImage: itineraryImages.sigiriya,
    heroImageAlt: 'The rock fortress of Sigiriya',
    entries: [
      {
        number: '01',
        label: 'Day 1',
        place: 'Negombo',
        title: 'Arrival',
        copy: [
          'You arrive at Katunayake at midday, to a warm welcome from the Royale Isles team. You’re taken directly to a VIP lounge while your immigration and luggage are cleared on your behalf, via the green channel.',
          'From there, it’s a smooth 30-minute drive in a luxury SUV to Negombo — your first breath of the Indian Ocean. Your room looks out over the coast, and after a long journey, tonight is simply about arriving: the sea breeze, the quiet, and settling into island time.',
        ],
        image: itineraryImages.negombo,
        imageAlt: 'The coast at Negombo',
      },
      {
        number: '02',
        label: 'Day 2',
        place: 'Sigiriya',
        title: 'Cultural Triangle',
        copy: [
          'This morning, you skip the long road transfer entirely. A private helicopter lifts you from Negombo over paddy fields, ancient reservoirs, and jungle canopy — your first glimpse of the Cultural Triangle from the air, and a spectacular way to cross the island.',
          'By late afternoon, you’re at the base of Sigiriya — timed deliberately so the heat of the day has passed and the light has turned soft and golden. You climb the 5th-century rock fortress of King Kasaapa, past the water gardens and boulder gardens, the ancient frescoes, and the mirror wall, reaching the summit as the whole Cultural Triangle opens up beneath you in the day’s most beautiful light.',
          'Tonight, you rest on the edge of the Parakrama Samudra — an ancient reservoir that turns gold, then silver, as the sun goes down.',
        ],
        image: itineraryImages.sigiriya,
        imageAlt: 'The rock fortress of Sigiriya rising from the jungle',
      },
      {
        number: '03',
        label: 'Day 3',
        place: 'Polonnaruwa',
        title: 'Ancient Capital',
        copy: [
          'This morning, your private national guide walks you through Polonnaruwa, Sri Lanka’s medieval capital — the Royal Palace complex, the sacred Quadrangle, and the monumental rock-cut Buddhas of the Gal Vihara. There’s no group, no fixed pace — you move through nearly a thousand years of history at whatever rhythm feels right to you.',
          'Tonight, you retreat into the jungle at Habarana — private villas, dense green surroundings, and a stillness that comes from being genuinely away from the road. And don’t be surprised if you are greeted by a wild elephant bathing in the lake.',
        ],
        image: itineraryImages.polonnaruwaGalVihara,
        imageAlt: 'The rock-cut Buddhas of the Gal Vihara, Polonnaruwa',
      },
      {
        number: '04',
        label: 'Day 4',
        place: 'Kandy',
        title: 'The Hill Capital',
        copy: [
          'You leave Habarana this morning in a super luxury SUV, climbing steadily toward Kandy. Along the way, lunch is set among the tea hills — with the surrounding slopes already telling you the altitude, and the climate, is changing.',
          'In the early evening, you’re taken to the Temple of the Sacred Tooth Relic — Sri Lanka’s most venerated Buddhist site — timed so you witness one of the daily pooja ceremonies, when the temple is at its most alive with chanting and ritual. Afterward, you’re shown Kandy by night — the lakeside promenade, the old colonial streets — before returning to your hotel by 10 PM.',
          'You spend the night in the cool hill air, right in the heart of Kandy.',
        ],
        image: itineraryImages.kandySacredTooth,
        imageAlt: 'The Temple of the Sacred Tooth Relic, Kandy',
      },
      {
        number: '05',
        label: 'Day 5',
        place: 'Hatton',
        title: 'Ascent into Tea Country',
        copy: [
          'You leave Kandy early this morning — timed so you catch the mountain pass roads in clear morning light, before the mist rolls in later in the day. It’s one of the most beautiful drives on the island, and this hour is when it looks its best.',
          'Tonight, you stay at a restored colonial planter’s residence set among working tea estates above Hatton, with sweeping views over rolling green terraces and the cool air of the hills around you.',
        ],
        image: itineraryImages.hattonTeaCountry,
        imageAlt: 'Tea country above Hatton',
      },
      {
        number: '06',
        label: 'Day 6',
        place: 'Thalpe',
        title: 'Tea Country to the South Coast',
        copy: [
          'Your morning is left free — an estate walk among the tea pickers, or simply time to sit with the view. After five days on the move, this morning is yours to slow down.',
          'In the afternoon, you head south toward the coast, arriving at Thalpe to watch the sun setting on one of the far corners of the planet earth — your first taste of the tropical south, and a clear shift from hill-country cool to warm coastal air. You virtually live on the beach as long as you wish.',
        ],
        image: itineraryImages.thalpe,
        imageAlt: 'The coast at Thalpe',
      },
      {
        number: '07',
        label: 'Day 7',
        place: 'Galle',
        title: 'Galle Fort',
        copy: [
          'After lunch, a short and scenic drive brings you into Galle. By evening, you’re inside Galle Fort itself — the UNESCO World Heritage walled city built by the Portuguese and fortified by the Dutch, modernised by the English — its ramparts lit warmly at night, its restored colonial townhouses now home to some of the island’s finest dining and a lively evening energy.',
          'You spend the night right inside the Fort walls — steps from dinner, the ramparts, and everything the evening has to offer.',
        ],
        image: itineraryImages.galleFort,
        imageAlt: 'The ramparts of Galle Fort',
      },
      {
        number: '08',
        label: 'Day 8',
        place: 'Colombo',
        title: 'Number 11',
        copy: [
          'After lunch, you make your way north to Colombo. Tonight, you stay at Number 11 — the private Colombo residence of Geoffrey Bawa, the architect behind Sri Lanka’s tropical modernist movement. This isn’t a hotel room; it’s a walk through courtyards, verandas, and a house built entirely around his design philosophy. You’re staying inside a living work of architecture.',
        ],
        image: itineraryImages.colombo,
        imageAlt: 'Colombo',
      },
      {
        number: '09',
        label: 'Day 9',
        place: 'Colombo',
        title: 'An Easy Pace',
        copy: [
          'Today is yours to explore Colombo at an easy pace. We recommend a visit to The Gallery Cafe — once Geoffrey Bawa’s own architectural office, just a few steps from Number 11 — so you see both where he lived and where he worked.',
          'Tonight, you return to Number 11 for a second, unhurried evening in the city.',
        ],
        image: itineraryImages.colombo,
        imageAlt: 'Colombo',
      },
      {
        number: '10',
        label: 'Day 10',
        place: 'Katunayake',
        title: 'Departure',
        copy: [
          'At 6 AM, you’re taken back to Katunayake, timed comfortably ahead of your 9 AM departure — bringing your ten days across Sri Lanka to a close.',
        ],
        image: itineraryImages.negombo,
        imageAlt: 'The coast beside Katunayake, where the journey began',
      },
    ],
    closing: {
      title: 'We are committed to your freedom',
      copy: [
        'What you’ve just read is an invitation, so it is not a fixed pattern.',
        'Over these ten days, four nights are spent right on the Indian Ocean — in Negombo, in Thalpe, and within the walls of Galle Fort — framing a journey through the island’s ancient heart and misted hills in between. We’ve drawn it this way because we believe Sri Lanka rewards those who see many of her faces. But this is your journey, and your time.',
        'If a place asks you to stay longer — another morning among the tea pickers at Tea Trails, one more sunset from the ramparts of Galle Fort, an extra night inside Geoffrey Bawa’s own walls in Colombo — simply say so. We will rearrange the days around your wishes, not the other way around.',
        'This itinerary is a beginning. Where you choose to linger is entirely, beautifully, up to you.',
      ],
    },
  },

  {
    slug: 'deep-dive',
    name: 'Deep Dive',
    eyebrow: 'The Second Reading · Portraits of Place',
    duration: '16 Days',
    nights: '15 Nights',
    lede: 'Nine landscapes, one journey — the deeper story behind each stay.',
    heroImage: itineraryImages.hattonTeaCountry,
    heroImageAlt: 'Tea country above Hatton',
    entries: [
      {
        number: '1–2',
        label: 'Nights 1–2',
        place: 'Balapitiya',
        title: 'Where the river remembers the sea',
        copy: [
          'The Madu Ganga is not one river but a hundred — a labyrinth of more than sixty islets bound together by mangrove roots that breathe with the tide. Cinnamon peelers still work these banks as their grandfathers did, curling bark into quills by hand while kingfishers drop like blue sparks into the shallows. This is Sri Lanka before spectacle: a slow, green hush where the loudest sound is a boatman’s pole lifting clear of the water. Arrival here is less a beginning than an exhale.',
        ],
        image: itineraryImages.balapitiyaMaduGanga,
        imageAlt: 'The mangrove waterways of the Madu Ganga, Balapitiya',
      },
      {
        number: '3–4',
        label: 'Nights 3–4',
        place: 'Thalpe & Galle',
        title: 'A rampart between two empires of light',
        copy: [
          'Galle Fort is a city built with the sea’s permission — Portuguese foundations, Dutch gables, a rampart walk that turns, at every angle, into a different century. By day the ocean light bleaches its coral walls to bone; by dusk the same walls turn the colour of tamarind, and old Fort families still take the evening air on their verandahs as church bell and call to prayer answer one another across the rooftops. Thalpe, just beyond, is where that same coastline falls quiet again — palm-shadowed, unhurried, made for watching the horizon do nothing in particular, beautifully.',
        ],
        image: itineraryImages.galleFort,
        imageAlt: 'The ramparts of Galle Fort',
      },
      {
        number: '5–6',
        label: 'Nights 5–6',
        place: 'Yala',
        title: 'The republic of the wild',
        copy: [
          'Yala is scrub jungle and ancient royal tanks, holding one of the highest densities of leopard on earth — though the land gives up its animals slowly, on its own terms, never on request. Dawn smells of dust and wild jasmine; a herd of elephants can appear from the thorn scrub as suddenly as a change in weather. This is a landscape that predates the island’s kingdoms and will outlast its lodges — two days spent at the mercy of something far older and wilder than any itinerary.',
        ],
        image: itineraryImages.yala,
        imageAlt: 'The scrub jungle of Yala',
      },
      {
        number: '7–8',
        label: 'Nights 7–8',
        place: 'Ella',
        title: 'A green hush above the clouds',
        copy: [
          'Ella sits high enough that the clouds arrive at eye level, drifting through a valley of tea terraces and waterfalls with the unhurried logic of a watercolour still being painted. The Nine Arches Bridge, built in brick and stone by local craftsmen when wartime shortages held up the steel, stands as quiet proof that necessity and beauty are often the same instinct. Climb to Little Adam’s Peak at first light and the whole hill country declares itself at once — ridgeline after ridgeline, softened by mist, entirely indifferent to the hour.',
        ],
        image: itineraryImages.ellaNineArches,
        imageAlt: 'The Nine Arches Bridge at Ella',
      },
      {
        number: '9–10',
        label: 'Nights 9–10',
        place: 'Hatton — Tea Country',
        title: 'The colour green, taken seriously',
        copy: [
          'A century ago these hills were terraformed into something almost musical — row upon row of tea bush following the land’s contour like handwriting. The air carries the scent of withering leaf drifting from the factories, and the light here does something to the colour green that no photograph quite holds. It was built as a private world for planters once, and it remains one still, largely unconcerned with the passage of time — save for the bell that continues to call the pickers home at dusk.',
        ],
        image: itineraryImages.hattonTeaCountry,
        imageAlt: 'Tea country above Hatton',
      },
      {
        number: '11–12',
        label: 'Nights 11–12',
        place: 'Kandy',
        title: 'A city built around a single act of devotion',
        copy: [
          'Kandy was the last independent kingdom of Ceylon, and it still carries itself that way — a lake dug by royal decree, a skyline of temple roofs, and at its centre, the Sacred Tooth Relic, guarded through centuries of invasion and approached each evening by drummers and pilgrims in a ceremony scarcely changed in six hundred years. Night falls over the lake in violet, and the entire town seems to lower its voice for it.',
        ],
        image: itineraryImages.kandySacredTooth,
        imageAlt: 'The Temple of the Sacred Tooth Relic, Kandy',
      },
      {
        number: '13',
        label: 'Night 13',
        place: 'Polonnaruwa',
        title: 'A medieval capital, still standing in the grass',
        copy: [
          'Polonnaruwa is Sri Lanka’s great forgotten capital — a twelfth-century royal city of brick palaces, moonstone thresholds, and the Gal Vihara’s colossal Buddha figures, drawn directly from a single sweep of granite, their expressions somehow both monumental and intimate. Bicycles remain the best way to see it: temple bells, parakeets, and eight centuries of silence, all at walking pace.',
        ],
        image: itineraryImages.polonnaruwaGalVihara,
        imageAlt: 'The rock-cut Buddhas of the Gal Vihara, Polonnaruwa',
      },
      {
        number: '14',
        label: 'Night 14',
        place: 'Sigiriya & Habarana',
        title: 'A fortress raised on defiance and desire',
        copy: [
          'Sigiriya was built by a king who seized the throne and then set about building his way to paradise — a palace atop a 200-metre column of rock, its base once ringed with water gardens, its flanks still holding frescoes of women painted some fifteen centuries ago, their colour scarcely dimmed. Climb it as the day cools toward evening, and the surrounding jungle unrolls to every horizon like something out of myth — because, in the retelling, it very nearly is.',
        ],
        image: itineraryImages.habarana,
        imageAlt: 'The jungle around Habarana',
      },
      {
        number: '15',
        label: 'Night 15',
        place: 'Colombo',
        title: 'A tropical modernism, built from shadow and light',
        copy: [
          'Colombo does not announce its beauty; it withholds it behind garden walls, exactly as Geoffrey Bawa intended. His own city house, and Number 11 within the Fort, taught a generation of architects that the tropics could be luxurious without excess — deep verandahs, courtyards open to the rain, light filtered rather than simply let in. Seen at night from a rooftop or a garden table, warm with salt air and frangipani, it makes an unhurried final chapter to a journey that began, two weeks earlier, in mangroves.',
        ],
        image: itineraryImages.colombo,
        imageAlt: 'Colombo',
      },
    ],
  },

  {
    slug: 'dynasty',
    name: 'The Dynasty',
    eyebrow: 'Portraits of Place',
    duration: '22 Days',
    nights: '21 Nights',
    lede: 'Twelve landscapes, one journey — the deeper story behind each stay.',
    heroImage: itineraryImages.trincomaleeNilaveli,
    heroImageAlt: 'The turquoise water off Nilaveli, Trincomalee',
    entries: [
      {
        number: '1–2',
        label: 'Nights 1–2',
        place: 'Balapitiya',
        title: 'Where the river remembers the sea',
        copy: [
          'The Madu Ganga is not one river but a hundred — a labyrinth of more than sixty islets bound together by mangrove roots that breathe with the tide. Cinnamon peelers still work these banks as their grandfathers did, curling bark into quills by hand while kingfishers drop like blue sparks into the shallows. This is Sri Lanka before spectacle: a slow, green hush where the loudest sound is a boatman’s pole lifting clear of the water. Arrival here is less a beginning than an exhale.',
        ],
        image: itineraryImages.balapitiyaMaduGanga,
        imageAlt: 'The mangrove waterways of the Madu Ganga, Balapitiya',
      },
      {
        number: '3–4',
        label: 'Nights 3–4',
        place: 'Thalpe & Galle',
        title: 'A rampart between two empires of light',
        copy: [
          'Galle Fort is a city built with the sea’s permission — Portuguese foundations, Dutch gables, a rampart walk that turns, at every angle, into a different century. By day the ocean light bleaches its coral walls to bone; by dusk the same walls turn the colour of tamarind, and old Fort families still take the evening air on their verandahs as church bell and call to prayer answer one another across the rooftops. Thalpe, just beyond, is where that same coastline falls quiet again — palm-shadowed, unhurried, made for watching the horizon do nothing in particular, beautifully.',
        ],
        image: itineraryImages.galleFort,
        imageAlt: 'The ramparts of Galle Fort',
      },
      {
        number: '5–6',
        label: 'Nights 5–6',
        place: 'Yala',
        title: 'The republic of the wild',
        copy: [
          'Yala is scrub jungle and ancient royal tanks, holding one of the highest densities of leopard on earth — though the land gives up its animals slowly, on its own terms, never on request. Dawn smells of dust and wild jasmine; a herd of elephants can appear from the thorn scrub as suddenly as a change in weather. This is a landscape that predates the island’s kingdoms and will outlast its lodges — two days spent at the mercy of something far older and wilder than any itinerary.',
        ],
        image: itineraryImages.yala,
        imageAlt: 'The scrub jungle of Yala',
      },
      {
        number: '7–8',
        label: 'Nights 7–8',
        place: 'Ella',
        title: 'A green hush above the clouds',
        copy: [
          'Ella sits high enough that the clouds arrive at eye level, drifting through a valley of tea terraces and waterfalls with the unhurried logic of a watercolour still being painted. The Nine Arches Bridge, built in brick and stone by local craftsmen when wartime shortages held up the steel, stands as quiet proof that necessity and beauty are often the same instinct. Climb to Little Adam’s Peak at first light and the whole hill country declares itself at once — ridgeline after ridgeline, softened by mist, entirely indifferent to the hour.',
        ],
        image: itineraryImages.ellaLittleAdamsPeak,
        imageAlt: 'The view from Little Adam’s Peak, Ella',
      },
      {
        number: '9–10',
        label: 'Nights 9–10',
        place: 'Hatton — Tea Country',
        title: 'The colour green, taken seriously',
        copy: [
          'A century ago these hills were terraformed into something almost musical — row upon row of tea bush following the land’s contour like handwriting. The air carries the scent of withering leaf drifting from the factories, and the light here does something to the colour green that no photograph quite holds. It was built as a private world for planters once, and it remains one still, largely unconcerned with the passage of time — save for the bell that continues to call the pickers home at dusk.',
        ],
        image: itineraryImages.hattonTeaCountry,
        imageAlt: 'Tea country above Hatton',
      },
      {
        number: '11–12',
        label: 'Nights 11–12',
        place: 'Kandy',
        title: 'A city built around a single act of devotion',
        copy: [
          'Kandy was the last independent kingdom of Ceylon, and it still carries itself that way — a lake dug by royal decree, a skyline of temple roofs, and at its centre, the Sacred Tooth Relic, guarded through centuries of invasion and approached each evening by drummers and pilgrims in a ceremony scarcely changed in six hundred years. Night falls over the lake in violet, and the entire town seems to lower its voice for it.',
        ],
        image: itineraryImages.kandySacredTooth,
        imageAlt: 'The Temple of the Sacred Tooth Relic, Kandy',
      },
      {
        number: '13',
        label: 'Night 13',
        place: 'Polonnaruwa',
        title: 'A medieval capital, still standing in the grass',
        copy: [
          'Polonnaruwa is Sri Lanka’s great forgotten capital — a twelfth-century royal city of brick palaces, moonstone thresholds, and the Gal Vihara’s colossal Buddha figures, drawn directly from a single sweep of granite, their expressions somehow both monumental and intimate. Bicycles remain the best way to see it: temple bells, parakeets, and eight centuries of silence, all at walking pace.',
        ],
        image: itineraryImages.polonnaruwaGalVihara,
        imageAlt: 'The rock-cut Buddhas of the Gal Vihara, Polonnaruwa',
      },
      {
        number: '14',
        label: 'Night 14',
        place: 'Sigiriya & Habarana',
        title: 'A fortress raised on defiance and desire',
        copy: [
          'Sigiriya was built by a king who seized the throne and then set about building his way to paradise — a palace atop a 200-metre column of rock, its base once ringed with water gardens, its flanks still holding frescoes of women painted some fifteen centuries ago, their colour scarcely dimmed. Climb it as the day cools toward evening, and the surrounding jungle unrolls to every horizon like something out of myth — because, in the retelling, it very nearly is.',
        ],
        image: itineraryImages.sigiriya,
        imageAlt: 'The rock fortress of Sigiriya',
      },
      {
        number: '15–16',
        label: 'Nights 15–16',
        place: 'Trincomalee',
        title: 'A harbour deep enough to hold an empire’s fleet',
        copy: [
          'Trincomalee has one of the finest natural deep-water harbours on earth, and every power that came to Ceylon — Portuguese, Dutch, French, British — fought to hold it. Swami Rock still carries the scars: a temple destroyed and rebuilt, a fort raised over its ruins, and a sheer drop to the sea where legend says a princess once leapt rather than leave her god. By day the water off Nilaveli turns an improbable turquoise over sand as fine as flour; by evening, Fort Frederick’s resident deer graze in the last light as if centuries of siege had never happened.',
        ],
        image: itineraryImages.trincomaleeKoneswaram,
        imageAlt: 'Koneswaram temple above Swami Rock, Trincomalee',
      },
      {
        kind: 'divider',
        title: 'The road forks',
        copy: [
          'From here the journey divides. What follows are two different endings to the same story — read the one that matches the route chosen.',
        ],
      },
      {
        kind: 'divider',
        label: 'Option A',
        title: 'Via Jaffna, Mannar & Wilpattu',
      },
      {
        number: '17–18',
        label: 'Nights 17–18',
        place: 'Jaffna',
        title: 'A peninsula that kept its own counsel',
        copy: [
          'Jaffna spent decades cut off from the rest of the island, and it shows in the best way — a cuisine built on palmyrah and crab found nowhere else in the country, a skyline of kovil towers rather than stupas, and a resilience in its people that the old Dutch fort’s crumbling ramparts only underline. Nallur’s temple courtyard is pure sensory overload — bells, incense, colour — and the road out past the lagoons feels like driving toward the edge of the country in every sense. This is Sri Lanka’s other story, told in a different language, at a different pace.',
        ],
        image: itineraryImages.jaffnaNallurKovil,
        imageAlt: 'Nallur Kandaswamy Kovil, Jaffna',
      },
      {
        number: '—',
        label: 'Waypoint',
        place: 'Mannar',
        title: 'Baobabs, and the bridge that reaches for India',
        copy: [
          'Mannar is less a stop than a passage — a spit of wind-scoured land where centuries-old baobab trees, carried here by Arab traders long before the Dutch arrived, rise absurdly out of the scrub like something misplaced from another continent. Offshore, the shoals of Adam’s Bridge trace a near-continuous line toward India, close enough that memory and myth here become the same thing. In season the lagoons fill with flamingos, pink against the salt flats, gone as quickly as they arrived.',
        ],
        note: 'A waypoint on the road, not a night’s stay.',
        image: itineraryImages.mannarBaobabs,
        imageAlt: 'Baobab trees on the Mannar peninsula',
      },
      {
        number: '19–20',
        label: 'Nights 19–20',
        place: 'Wilpattu',
        title: 'The republic of the wild, its northern chapter',
        copy: [
          'Where Yala is scrub and stone, Wilpattu is water — some threescore natural lakes, or villu, scattered through the oldest protected forest in the country, giving its leopards and sloth bears a landscape unlike anywhere else on the island. It is also the quietest of Sri Lanka’s great parks, having spent years closed to visitors during the conflict years and returned since to something closer to true wilderness. A dawn game drive here is not a performance; it is simply what the forest does when no one is watching.',
        ],
        image: itineraryImages.wilpattu,
        imageAlt: 'The villu lakes of Wilpattu',
      },
      {
        kind: 'divider',
        label: 'Option B',
        title: 'Via Batticaloa & Ampara (Gal Oya)',
      },
      {
        number: '17–18',
        label: 'Nights 17–18',
        place: 'Batticaloa',
        title: 'A lagoon that is said to sing',
        copy: [
          'Batticaloa was built by water before it was ever built by empire — a town wrapped around a lagoon so central to its identity that local legend holds the water itself sings on certain still nights, a phenomenon storytellers and marine biologists alike have argued over for a century without resolving. Dutch-era windows look out over a bridge crossing that could be mistaken for a smaller, quieter Galle, and the pastel façades of the old town carry the particular unhurried grace of a place the modern coast road never fully found.',
        ],
        image: itineraryImages.batticaloa,
        imageAlt: 'The lagoon town of Batticaloa',
      },
      {
        number: '19–20',
        label: 'Nights 19–20',
        place: 'Gal Oya, Ampara',
        title: 'Where elephants learned to swim',
        copy: [
          'Gal Oya keeps a secret most of Sri Lanka’s safari circuit has never bothered to chase: a reservoir large enough that its elephant herds cross between islands by swimming, trunks lifted like snorkels, in a sight found almost nowhere else on earth. The park is explored in partnership with the Vedda, the island’s indigenous forest people, whose reading of this land reaches back further than any kingdom this journey has passed through. It remains, deliberately, one of the quietest corners of the country — beautiful largely because so few have thought to look.',
        ],
        image: itineraryImages.galOya,
        imageAlt: 'The reservoir at Gal Oya',
      },
      {
        number: '21',
        label: 'Night 21',
        place: 'Colombo',
        title: 'A tropical modernism, built from shadow and light',
        copy: [
          'Colombo does not announce its beauty; it withholds it behind garden walls, exactly as Geoffrey Bawa intended. His own city house, and Number 11 within the Fort, taught a generation of architects that the tropics could be luxurious without excess — deep verandahs, courtyards open to the rain, light filtered rather than simply let in. Seen at night from a rooftop or a garden table, warm with salt air and frangipani, it makes an unhurried final chapter to a journey that began, three weeks earlier, in mangroves.',
        ],
        image: itineraryImages.colombo,
        imageAlt: 'Colombo',
      },
    ],
  },
]

/** Turns a journey name into the slug its page lives at. */
export function itinerarySlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function narrativeForSlug(slug: string): ItineraryNarrative | undefined {
  return itineraryNarratives.find((entry) => entry.slug === slug)
}
