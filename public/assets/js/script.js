let itemArray = []

const pageSetup = () => {
  apiGetItems()
      .then(response => updateItemsArray(response.data))
      .then(response => loadItemsInDom(sortItems(itemArray)))
      .catch(error => console.log(error))
}

// Document setup
$(document).ready(pageSetup)

const updateItemsArray = (data) => {
  itemArray = data
}

const sortItems = (items, dir = 'asc') => {
  if (dir === 'asc') {
    return items.sort((a, b) => ((b.name.toUpperCase() > a.name.toUpperCase()) ? 1 : ((a.name.toUpperCase() > b.name.toUpperCase()) ? -1 : 0)))

  } else {
    return items.sort((a, b) => ((a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0)))
  }
}

const sortPageItems = (event) => {
  itemArray = sortItems(itemArray, $(event.target).attr('id'))
  loadItemsInDom(itemArray)
}

const loadItemsInDom = (items) => {
  $('.item-container').empty()
  for (let i = 0; i < items.length; i++) {
    addItemInDom(items[i])
  }
}

const addItemInDom = (item) => {
  $('.item-container').prepend(`
    <div class="item" id="${item.id}">
      <div class="item-name"><strong>Name:</strong> ${item.name}</div>
      <div class="item-explanation"><strong>Why is this here?</strong> ${item.staleness_reason}</div>
      <div class="item-cleanliness"><strong>Condition:</strong> ${item.cleanliness}</div>
    </div>
  `)
}

const apiGetItems = () => fetch('/api/v1/items')
  .then(response => response.json())
  .catch(error => console.log(error))

$('#asc').on('click', sortPageItems)
$('#desc').on('click', sortPageItems)
