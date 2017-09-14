const items = [
  {
    name: 'An old bicycle',
    staleness_reason: 'My kids moved away and now I have their old, shitty bike.',
    cleanliness: 'Dusty'
  },
  {
    name: 'A basketball',
    staleness_reason: "Our basketball hoop broke and I never fixed it because I'm always doing Turing homework.",
    cleanliness: 'Rancid'
  },
  {
    name: 'A motorcycle',
    staleness_reason: "I love motorcycles, but haven't been able to ride in a while.",
    cleanliness: 'Dusty'
  },
  {
    name: 'Skis',
    staleness_reason: "I don't even ski. WTF?",
    cleanliness: 'Sparkling'
  },
  {
    name: 'Toolchest',
    staleness_reason: "Inherited some tools from my dad, but haven't been able to clean them off yet.",
    cleanliness: 'Dusty'
  },
  {
    name: 'A chicken salad sandwich',
    staleness_reason: 'I got baked in the garage and forgot to eat this.',
    cleanliness: 'Rancid'
  },
  {
    name: 'The neighbor kid',
    staleness_reason: "He keeps wandering into my f**king garage. I don't get it.",
    cleanliness: 'Sparkling'
  }
]

exports.seed = (knex, Promise) => {
  return knex('items')
    .del()
    .then(() => {
      return Promise.all(
        items.map(item => {
          return knex('items').insert(item)
        })
      )
    })
    .catch(error => console.log({ error }))
}
