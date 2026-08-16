/**
 * The international office network, as supplied by the client.
 *
 * Shared by the About page (the network section) and the Contact page (how to
 * reach us), so the addresses and numbers only ever live in one place.
 */
export type Office = {
  country: string
  city: string
  address: readonly string[]
  region: string
  phone: string
}

export const offices: readonly Office[] = [
  {
    country: 'The UK',
    city: 'Oxford',
    address: ['4 The Willows', 'Headington', 'Oxford OX3 9FE'],
    region: 'United Kingdom',
    phone: '+44 7843 223982',
  },
  {
    country: 'Canada',
    city: 'Ottawa',
    address: ['1919 Bank Street', 'Ottawa — Ontario', 'K1V 8A2'],
    region: 'Canada',
    phone: '+1 613 618 9990',
  },
  {
    country: 'Bahrain',
    city: 'Nabi Saleh',
    address: ['Villa 01, Entrance 1920', 'Road 8047, Block Area 380', 'Nabi Saleh'],
    region: 'Kingdom of Bahrain',
    phone: '+973 3919 0838',
  },
]

/** `tel:` href for an office number (strips spaces the dialler cannot use). */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, '')}`
}
