import rawEvents from '../../public/events.json'

export function getAllEvents() {
  return rawEvents
}

export function getManagementEvents() {
  return rawEvents.filter(ev => ev.type === 'man')
}

export function getCulturalEvents() {
  return rawEvents.filter(ev => ev.type === 'cul')
}
