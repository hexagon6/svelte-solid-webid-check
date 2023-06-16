// imported from https://solidproject.org//users/get-a-pod#get-a-pod-from-a-pod-provider
const officialPods = [
  'https://start.inrupt.com/',
  'https://inrupt.net/',
  'https://solidcommunity.net/',
  'https://solidweb.org/',
  'https://trinpod.us/',
  'https://get.use.id/',
  'https://solidweb.me/',
  'https://datapod.igrant.io/',
  'https://solid.redpencil.io/',
]

// other known pods
const others = ['https://solid.fet.li/']

export const pods = [...officialPods, ...others]
