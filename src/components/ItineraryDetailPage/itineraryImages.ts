/**
 * Photographs for the journey pages, supplied by the client and named by place.
 * Kept in one module so a stay in `itineraryNarratives` refers to a picture by
 * name rather than repeating an import path.
 */
import balapitiyaMaduGanga from '../../assets/itineraries/balapitiya-madu-ganga.jpg'
import batticaloa from '../../assets/itineraries/batticaloa.jpg'
import colombo from '../../assets/itineraries/colombo.webp'
import ellaLittleAdamsPeak from '../../assets/itineraries/ella-little-adams-peak.jpg'
import ellaNineArches from '../../assets/itineraries/ella-nine-arches-bridge.jpg'
import galOya from '../../assets/itineraries/gal-oya.jpg'
import galleFort from '../../assets/itineraries/galle-fort.jpg'
import habarana from '../../assets/itineraries/habarana.jpg'
import hattonTeaCountry from '../../assets/itineraries/hatton-tea-country.jpg'
import jaffnaNallurKovil from '../../assets/itineraries/jaffna-nallur-kovil.jpg'
import kandySacredTooth from '../../assets/itineraries/kandy-sacred-tooth.jpg'
import mannarBaobabs from '../../assets/itineraries/mannar-baobabs.jpg'
import negombo from '../../assets/itineraries/negombo.png'
import polonnaruwaGalVihara from '../../assets/itineraries/polonnaruwa-gal-vihara.jpg'
import sigiriya from '../../assets/itineraries/sigiriya.jpg'
import thalpe from '../../assets/itineraries/thalpe.jpg'
import trincomaleeKoneswaram from '../../assets/itineraries/trincomalee-koneswaram.jpg'
import trincomaleeNilaveli from '../../assets/itineraries/trincomalee-nilaveli.png'
import wilpattu from '../../assets/itineraries/wilpattu.jpg'
import yala from '../../assets/itineraries/yala.jpg'

export const itineraryImages = {
  balapitiyaMaduGanga,
  batticaloa,
  colombo,
  ellaLittleAdamsPeak,
  ellaNineArches,
  galOya,
  galleFort,
  habarana,
  hattonTeaCountry,
  jaffnaNallurKovil,
  kandySacredTooth,
  mannarBaobabs,
  negombo,
  polonnaruwaGalVihara,
  sigiriya,
  thalpe,
  trincomaleeKoneswaram,
  trincomaleeNilaveli,
  wilpattu,
  yala,
} as const
