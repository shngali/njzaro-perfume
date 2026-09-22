import { Perfume } from './types';

let idCounter = 1;
const p = (
  brand: string,
  name: string,
  notes: string,
  img: string | null,
  sizes: { ml: number; price: number }[] = [
    { ml: 10, price: 13000 },
    { ml: 20, price: 24000 },
    { ml: 40, price: 34000 },
  ],
  badge: string | null = 'New'
): Perfume => ({
  id: idCounter++,
  brand,
  name,
  notes,
  img,
  badge,
  category: brand === 'Women Perfumes' ? 'Women Perfumes' : brand,
  sizes,
});

export const perfumes: Perfume[] = [
  // Ibrahim Al Qurashi
  p('Ibrahim Al Qurashi', 'Balas Rose', 'Rose · Saffron · Raspberry', 'images/balas.webp', undefined, null),
  p('Ibrahim Al Qurashi', 'Black Diamond Incense', 'woody · smoky · vanilla', 'images/black.webp', undefined, null),
  p('Ibrahim Al Qurashi', 'Brazilian Tobacco', 'Tobacco · warm spicy · sweet', 'images/brazilian.webp', undefined, null),
  p('Ibrahim Al Qurashi', 'Cullinan Diamond Iris', 'woody · sweet · iris', 'images/cullinan.webp', undefined, null),
  p('Ibrahim Al Qurashi', 'Emerald Soul Diamond', 'iris · powdery · musky', 'images/soul.webp', undefined, null),
  p('Ibrahim Al Qurashi', 'French Tobacco', 'citrus · fresh spicy · fruity', 'images/french.webp', undefined, null),
  p('Ibrahim Al Qurashi', 'Nude Coral Diamond', 'vanilla · amber · white floral', 'images/nudecoral.webp', undefined, null),
  p('Ibrahim Al Qurashi', 'Purple Heart Diamond', 'white floral · sweet · woody', 'images/purpleheart.webp', undefined, null),
  p('Ibrahim Al Qurashi', 'Pink Diamond Sakura', 'white floral · Rose · powdery', 'images/pinksakura.webp', undefined, null),
  p('Ibrahim Al Qurashi', 'White Regent Diamond', 'woody· vanilla · warm spicy', 'images/whiteregent.webp', undefined, null),
  p('Ibrahim Al Qurashi', 'Greek Amber', 'fruity · floral · fresh', 'images/greek.webp', undefined, null),

  // Rayhaan
  p('Rayhaan', 'Ocean Rush Rayhaan', 'aromatic· fresh spicy · woody', 'images/ocean.webp'),
  p('Rayhaan', 'Rayhaan Elixir', 'vanilla · aromatic · amber', 'images/elixir.webp'),
  p('Rayhaan', 'Rayhaan Divine for Women', 'fresh · fruity · rose', 'images/devine.webp'),
  p('Rayhaan', 'Rayhaan Pretty in Pink', 'Mandarin Orange · Pear · Black Currant', 'images/pink.webp'),
  p('Rayhaan', 'Rayhaan X Valhalla', 'woody · sweet · fruity', 'images/valhalla.webp'),
  p('Rayhaan', 'Tonquin Giza', 'woody · sweet · fruity', 'images/giza.webp'),

  // Iven
  p('Iven', 'Classy', 'bergamot · citrus · green accord', 'images/classy.webp', [
    { ml: 10, price: 20000 },
    { ml: 20, price: 37000 },
    { ml: 40, price: 47000 },
  ]),
  p('Iven', 'Mood', 'Bergamot · Lemon · Citrus', 'images/mood.webp', [
    { ml: 10, price: 20000 },
    { ml: 20, price: 37000 },
    { ml: 40, price: 47000 },
  ]),
  p('Iven', 'Peace', 'Bergamot · Citrus · Cardamom', 'images/peace.webp', [
    { ml: 10, price: 20000 },
    { ml: 20, price: 37000 },
    { ml: 40, price: 47000 },
  ]),

  // Stevano
  p('Stevano', 'Pour Homme', 'Fresh Notes · Cinnamon · Citron', 'images/homme.webp', [
    { ml: 10, price: 25000 },
    { ml: 20, price: 48000 },
  ]),
  p('Stevano', 'Blue Ghost', 'Grapefruit · Lavender · Sandalwood', 'images/ghost.webp', [
    { ml: 10, price: 25000 },
    { ml: 20, price: 48000 },
  ]),

  // Encre Noire
  p('Encre Noire', 'Encre Noire', 'woody · aromatic · earthy', 'images/nore.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 28000 },
    { ml: 40, price: 50000 },
  ]),
  p('Encre Noire', "Encre Noire A L'Extreme Lalique", 'warm spicy· aromatic · woody', 'images/ex.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 28000 },
    { ml: 40, price: 50000 },
  ]),
  p('Encre Noire', 'Encre Noire Sport', 'woody · aromatic · earthy', 'images/sport.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 28000 },
    { ml: 40, price: 50000 },
  ]),

  // Samam
  p('Samam', 'Caramelore', 'caramel · patchouli · sweet', 'images/samam.webp'),
  p('Samam', 'Mina', 'floral · fruity · musky', 'images/mina.webp'),

  // Women Perfumes
  p('Women Perfumes', 'Arrogate Pink Assaf', 'white floral · powdery · musky', 'images/arrogatepink.webp'),
  p('Women Perfumes', 'Miss Laverne Garden', 'fruity · rose · fresh', 'images/miss.webp'),
  p('Women Perfumes', 'Lady Rose Bloom Laverne', 'warm spicy · fruity · cacao', 'images/bloom.webp'),
  p('Women Perfumes', 'Rue Broca The Oreme', 'white floral · tuberose · powdery', 'images/broca.webp'),
  p('Women Perfumes', 'Club De Nuit Woman', 'citrus · patchouli · rose', 'images/nightgirl.webp'),
  p('Women Perfumes', 'Aura Crisp Flower La Fade', 'musky · fruity · powdery', 'images/aura.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 29000 },
    { ml: 40, price: 40000 },
  ]),
  p('Women Perfumes', 'Sense Laverne', 'white floral · musky · woody', 'images/sense.webp'),
  p('Women Perfumes', 'Hooked Pour Femme', 'fruity · rose · musky', 'images/hooked.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 28000 },
    { ml: 40, price: 40000 },
  ]),
  p('Women Perfumes', 'Now Women', 'sweet · powdery · fruity', 'images/now.webp'),
  p('Women Perfumes', 'Gissah One & Only EDP', 'musky · amber · sweet', 'images/one&only.webp'),
  p('Women Perfumes', 'La Vivacité', 'sweet · vanilla · patchouli', 'images/vivicate.webp'),
  p('Women Perfumes', 'Balas Rose', 'Rose · Saffron · Raspberry', 'images/balas.webp'),
  p('Women Perfumes', 'Purple Heart', 'white floral · sweet · woody', 'images/purpleheart.webp'),
  p('Women Perfumes', 'Pink Sakura', 'white floral · Rose · powdery', 'images/pinksakura.webp'),
  p('Women Perfumes', 'Rayhaan Divine', 'fresh · fresh · fresh', 'images/devine.webp'),
  p('Women Perfumes', 'Rayhaan Pretty in Pink', 'Mandarin Orange · Pear · Black Currant', 'images/pink.webp'),
  p('Women Perfumes', 'Assaf Risk', 'rose · woody · powdery', 'images/risk.webp'),
  p('Women Perfumes', 'Club de Nuit Woman Intense', 'citrus · rose · powdery', 'images/intense.webp'),
  p('Women Perfumes', 'Oud & Roses', 'rose · oud · powdery', 'images/oudroses.webp'),
  p('Women Perfumes', 'Prestige Ruby', 'white floral · woody · powdery', 'images/ruby.webp', [
    { ml: 10, price: 18000 },
    { ml: 20, price: 35000 },
    { ml: 40, price: 40000 },
  ]),
  p('Women Perfumes', 'Hawas Diva', 'vanilla · powdery · fruity', 'images/diva.webp'),
  p('Women Perfumes', 'Hawas For Her', 'sweet · fruity · woody', 'images/hawasher.webp'),

  // Assaf
  p('Assaf', 'Wild Colt Bakhur', 'leather · woody · sweet', 'images/wild.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 28000 },
    { ml: 40, price: 45000 },
  ]),
  p('Assaf', 'Frankel Storm', 'citrus · woody · earthy', 'images/storm.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 28000 },
    { ml: 40, price: 45000 },
  ]),
  p('Assaf', 'Frankel black Elixir', 'aromatic · citrus · woody', 'images/blacke.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 28000 },
    { ml: 40, price: 45000 },
  ]),
  p('Assaf', 'Frankel Imagination', 'citrus · green · fresh', 'images/ima.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 28000 },
    { ml: 40, price: 45000 },
  ]),
  p('Assaf', 'Arrogate Glitch', 'fruity · sweet · citrus', 'images/glitch.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 28000 },
    { ml: 40, price: 45000 },
  ]),
  p('Assaf', 'Arrogate Blue De', 'citrus · amber · aromatic', 'images/blue.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 28000 },
    { ml: 40, price: 45000 },
  ]),
  p('Assaf', 'Arrogate Risk Comete', 'rose · woody · powdery', 'images/risk.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 28000 },
    { ml: 40, price: 45000 },
  ]),
  p('Assaf', 'Arrogate Attack', 'woody · fresh spicy · aromatic', 'images/attack.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 28000 },
    { ml: 40, price: 45000 },
  ]),
  p('Assaf', 'Arrogate Pink', 'Oud · Amber · Spice', 'images/arrogatepink.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 28000 },
    { ml: 40, price: 45000 },
  ]),

  // Laverne
  p('Laverne', 'Fearless', 'Oud · Amber · Spice', 'images/fear.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 29000 },
    { ml: 40, price: 40000 },
  ]),
  p('Laverne', 'Blue', 'Oud · Amber · Spice', 'images/bluelaverne.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 29000 },
    { ml: 40, price: 40000 },
  ]),
  p('Laverne', '7:00 AM', 'Oud · Amber · Spice', 'images/7am.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 29000 },
    { ml: 40, price: 40000 },
  ]),
  p('Laverne', 'Lady Rose Bloom', 'Oud · Amber · Spice', 'images/bloom.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 29000 },
    { ml: 40, price: 40000 },
  ]),
  p('Laverne', 'Sense', 'Oud · Amber · Spice', 'images/sense.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 29000 },
    { ml: 40, price: 40000 },
  ]),
  p('Laverne', 'King Tobacco', 'Oud · Amber · Spice', 'images/king.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 29000 },
    { ml: 40, price: 40000 },
  ]),
  p('Laverne', 'Soir', 'Oud · Amber · Spice', 'images/soir.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 29000 },
    { ml: 40, price: 40000 },
  ]),
  p('Laverne', 'Miss Laverne Garden', 'fruity  · rose · fresh', 'images/miss.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 29000 },
    { ml: 40, price: 40000 },
  ]),

  // Gissah
  p('Gissah', 'Sava', 'Oud · Amber · Spice', 'images/sava.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 29000 },
    { ml: 40, price: 50000 },
  ]),
  p('Gissah', 'Laluna Valley', 'Oud · Amber · Spice', 'images/laluna.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 29000 },
    { ml: 40, price: 50000 },
  ]),
  p('Gissah', 'Hudson Valley', 'Oud · Amber · Spice', 'images/laluna.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 29000 },
    { ml: 40, price: 50000 },
  ]),
  p('Gissah', 'one & Only EDP', 'Oud · Amber · Spice', 'images/one&only.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 29000 },
    { ml: 40, price: 50000 },
  ]),
  p('Gissah', 'Imperial Valley', 'Oud · Amber · Spice', 'images/imp.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 29000 },
    { ml: 40, price: 50000 },
  ]),

  // Club de Nuit
  p('Club de Nuit', 'Club de Nuit Intense Man', 'citrus ·fruity · leather', 'images/man.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 29000 },
    { ml: 40, price: 40000 },
  ]),
  p('Club de Nuit', 'Club de Nuit Woman Intense', 'citrus · rose · powdery', 'images/intense.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 29000 },
    { ml: 40, price: 40000 },
  ]),
  p('Club de Nuit', 'Club de Nuit Blue Iconic', 'citrus · woody · fresh spicy', 'images/iconic.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 29000 },
    { ml: 40, price: 40000 },
  ]),
  p('Club de Nuit', 'Club De Nuit Urban Elixir', 'amber · aromatic · citrus', 'images/urban.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 29000 },
    { ml: 40, price: 40000 },
  ]),
  p('Club de Nuit', 'Club De Nuit Woman', 'citrus · patchouli · rose', 'images/nightgirl.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 29000 },
    { ml: 40, price: 40000 },
  ]),

  // Sedra
  p('Sedra', 'Nero', 'powdery · vanilla · powdery', 'images/nero.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 30000 },
    { ml: 40, price: 50000 },
  ]),
  p('Sedra', 'Blanco', 'fresh · sweet · fruity', 'images/blanco.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 30000 },
    { ml: 40, price: 50000 },
  ]),
  p('Sedra', 'Dorado', 'aromatic · fresh spicy · powdery', 'images/dorado.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 30000 },
    { ml: 40, price: 50000 },
  ]),

  // Unique
  p('Unique', 'Hugo Boss', 'woody · violet · powdery', 'images/boss.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 30000 },
    { ml: 40, price: 55000 },
  ]),
  p('Unique', 'Kenzo Homme Eau de Toilette Intense', 'woody · aquatic · marine', 'images/kenzo.webp', [
    { ml: 10, price: 18000 },
    { ml: 20, price: 35000 },
    { ml: 40, price: 70000 },
  ]),
  p('Unique', 'Prestige Ruby', 'white floral · woody · powdery', 'images/ruby.webp', [
    { ml: 10, price: 18000 },
    { ml: 20, price: 35000 },
    { ml: 40, price: 40000 },
  ]),
  p('Unique', 'SHK I Armaf', 'woody · musky · amber', 'images/shk.webp', [
    { ml: 10, price: 25000 },
    { ml: 20, price: 48000 },
  ]),
  p('Unique', 'Obsidian French Avenue', 'amber · citrus · vanilla', 'images/obs.webp', [
    { ml: 10, price: 16000 },
    { ml: 20, price: 30000 },
    { ml: 40, price: 55000 },
  ]),
  p('Unique', 'Oud & Roses', 'rose · oud · floral', 'images/oudroses.webp'),
  p('Unique', 'al khawaja oud', 'Bergamot · Lavender · Musk', 'images/xawaj.webp', [
    { ml: 10, price: 22000 },
    { ml: 20, price: 40000 },
  ]),
  p('Unique', 'Hersh Lahb', 'woody · spicy · amber', 'images/hershlahb.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 28000 },
    { ml: 40, price: 40000 },
  ]),
  p('Unique', 'French Avenue Atlantis EDP', 'aquatic · fresh · woody', 'images/french.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 28000 },
    { ml: 40, price: 40000 },
  ]),
  p('Unique', 'Ghost Spectre', 'woody · musky · aromatic', 'images/ghostspectre.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 28000 },
    { ml: 40, price: 40000 },
  ]),

  // Sultan
  p('Sultan', 'Sultan 9', 'White Musk · Sandalwood ·  Apple and Oud', 'images/9.webp'),

  // Hawas
  p('Hawas', 'Hawas for Him', 'fruity · citrus · fresh', 'images/hawashim.webp'),
  p('Hawas', 'Hawas for Her', 'sweet · fruity · woody', 'images/hawasher.webp'),
  p('Hawas', 'Hawas black', 'Woody · citrus · mossy', 'images/hawasblack.webp'),
  p('Hawas', 'Hawas Elixir', 'vanilla · aromatic · green', 'images/hawaselixir.webp'),
  p('Hawas', 'Hawas Diva', 'vanilla · powdery · fruity', 'images/diva.webp'),
  p('Hawas', 'Hawas Fire', 'amber · aromatic · mineral', 'images/fire.webp'),
  p('Hawas', 'Hawas Kobra', 'citrus · fresh spicy · musky', 'images/kobra.webp'),

  // Afnan
  p('Afnan', '9 PM Rebel', 'amber · vanilla · woody', 'images/9rebel.webp'),
  p('Afnan', '9 PM Night Out', 'fruity · sweet · musky', 'images/nightout.webp'),
  p('Afnan', 'Supremacy', 'amber · woody · spicy', 'images/supremacy.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 29000 },
    { ml: 40, price: 40000 },
  ]),
  p('Afnan', 'Supremacy Not Only Intense EDP', 'amber · woody · spicy', 'images/supremacynotonlyintenseedp.webp', [
    { ml: 10, price: 15000 },
    { ml: 20, price: 29000 },
    { ml: 40, price: 40000 },
  ]),
];
