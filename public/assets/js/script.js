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
  updateItemCounts(items)
}

const addItemInDom = (item) => {
  console.log(item.cleanliness)
  $('.item-container').prepend(`
    <div class="item" id="${item.id}">
      <div class="item-name"><strong>${item.name}</strong></div>
      <div class="item-explanation hidden"><strong>Why is this here?</strong> ${item.staleness_reason}</div>
      <div class="item-cleanliness hidden"><strong>Condition:</strong>
        <select id="itemCondition">
          <option value="Sparkling" ${checkSelected(item.cleanliness, 'Sparkling')}>Sparkling</option>
          <option value="Dusty" ${checkSelected(item.cleanliness, 'Dusty')}>Dusty</option>
          <option value="Rancid" ${checkSelected(item.cleanliness, 'Rancid')}>Rancid</option>
        </select>
      </div>
  `)
}

const updateCondition = (event) => {
  const itemId = $(event.target).closest('.item').attr('id')
  apiUpdateCondition(itemId, $(event.target)[0].value)
}

const checkSelected = (cleanliness, option) => {
  return cleanliness === option ? 'selected' : ''
}

const updateItemCounts = items => {
  $('#totalCount').text(items.length)
  $('#sparklingCount').text(items.filter(item => item.cleanliness === 'Sparkling').length)
  $('#dustyCount').text(items.filter(item => item.cleanliness === 'Dusty').length)
  $('#rancidCount').text(items.filter(item => item.cleanliness === 'Rancid').length)
}

const apiGetItems = () => fetch('/api/v1/items')
  .then(response => response.json())
  .catch(error => console.log(error))

const apiUpdateCondition = (id, cleanliness) => {
  fetch(`/api/v1/items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ cleanliness })
  })
    .then((response) => {
      if (!response.ok) throw Error(response.statusText)
      return response.json()
    })
    .catch(error => console.log(error))
}

$('#asc').on('click', sortPageItems)
$('#desc').on('click', sortPageItems)
$('.item-container').on('change', '#itemCondition', updateCondition)
$('.garage-door').click(() => {
  if ($('.garage-door').hasClass('slideup')) {
    $('.garage-door').removeClass('slideup').addClass('slidedown')
  } else {
    $('.garage-door').removeClass('slidedown').addClass('slideup')
  }
})
