function toRoman(num) {
  const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
  return romans[num - 1] ?? String(num)
}

function getServiceNumber(id) {
  return parseInt(id.split('-')[1], 10)
}

const CROWN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 28" width="45" height="28" fill="none" aria-hidden="true">
  <path d="M2 26 L6 10 L14 18 L20 4 L26 18 L34 10 L38 26 Z" fill="#c9922a" stroke="#b07d20" stroke-width="1.5" stroke-linejoin="round"/>
  <circle cx="2"  cy="9"  r="2.5" fill="#c9922a" stroke="#b07d20" stroke-width="1"/>
  <circle cx="20" cy="3"  r="2.5" fill="#c9922a" stroke="#b07d20" stroke-width="1"/>
  <circle cx="38" cy="9"  r="2.5" fill="#c9922a" stroke="#b07d20" stroke-width="1"/>
  <rect x="2" y="25" width="36" height="3" rx="1.5" fill="#c9922a" stroke="#b07d20" stroke-width="1"/>
</svg>`

function makeBadgeSVG(roman) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
  <text x="12" y="17" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="800" fill="currentColor">${roman}</text>
</svg>`
}

function createServiceCard(service) {
  const card = document.createElement('article')
  card.className = service.featured ? 'service-card service-card--featured' : 'service-card'

  if (service.featured) {
    const crown = document.createElement('span')
    crown.className = 'service-card__crown'
    crown.setAttribute('aria-hidden', 'true')
    crown.innerHTML = CROWN_SVG
    card.appendChild(crown)
  }

  const body = document.createElement('div')
  body.className = 'service-card__body'

  const top = document.createElement('div')
  top.className = 'service-card__top'

  const name = document.createElement('div')
  name.className = 'service-card__name'
  name.textContent = service.name

  const badge = document.createElement('div')
  badge.className = 'service-card__badge'
  const num = getServiceNumber(service.id)
  badge.innerHTML = makeBadgeSVG(toRoman(num))

  top.appendChild(name)
  top.appendChild(badge)

  const divider = document.createElement('div')
  divider.className = 'service-card__divider'

  const desc = document.createElement('p')
  desc.className = 'service-card__desc'
  desc.textContent = service.description

  body.appendChild(top)
  body.appendChild(divider)
  body.appendChild(desc)
  card.appendChild(body)

  return card
}

function renderServices(list) {
  const grid = document.getElementById('servicesGrid')
  if (!grid) return

  grid.replaceChildren()
  list.forEach((service) => {
    grid.appendChild(createServiceCard(service))
  })
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('./data/services.json')
    .then((res) => res.json())
    .then((services) => renderServices(services))
    .catch((err) => console.error('Error loading services:', err))
})
