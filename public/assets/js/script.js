let itemArray = []
let currentSort

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

const addItem = () => {
  apiAddItem($('.input-name').val(), $('.input-reason').val(), $('.input-cleanliness').val())
}

const sortItems = (items, dir = 'asc') => {
  if (dir === 'asc') {
    return items.sort((a, b) => ((b.name.toUpperCase() > a.name.toUpperCase()) ? 1 : ((a.name.toUpperCase() > b.name.toUpperCase()) ? -1 : 0)))
  } else {
    return items.sort((a, b) => ((a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0)))
  }
}

const loadItemsInDom = (items) => {
  $('.item-container').empty()
  for (let i = 0; i < items.length; i++) {
    addItemInDom(items[i])
  }
  updateItemCounts(items)
}

const addItemInDom = (item) => {
  $('.item-container').prepend(`
    <div class="item" id="${item.id}">
      <div class="item-name"><strong>${item.name}</strong></div>
      <div class="item-explanation hidden"><strong>Why is this here?</strong> ${item.staleness_reason}</div>
      <div class="item-cleanliness hidden"><strong>Cleanliness:</strong>
        <select class="item-cleanliness" id="itemCleanliness">
          <option value="Sparkling" ${checkSelected(item.cleanliness, 'Sparkling')}>Sparkling</option>
          <option value="Dusty" ${checkSelected(item.cleanliness, 'Dusty')}>Dusty</option>
          <option value="Rancid" ${checkSelected(item.cleanliness, 'Rancid')}>Rancid</option>
        </select>
      </div>
  `)
}

const updateCleanliness = (event) => {
  const itemId = $(event.target).closest('.item').attr('id')
  apiUpdateCondition(itemId, $(event.target)[0].value)
  updateItemInArray(itemId, 'cleanliness', $(event.target)[0].value)
  updateItemCounts(itemArray)
}

const checkSelected = (cleanliness, option) => {
  return cleanliness === option ? 'selected' : ''
}

const updateItemInArray = (id, key, value) => {
  itemArray = itemArray.map(item => {
    if (item.id === parseInt(id, 10)) item[key] = value
    return item
  })
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

const apiAddItem = (name, reason, cleanliness) => {
  fetch('/api/v1/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      staleness_reason: reason,
      cleanliness
    })
  })
    .then(response => response.json())
    .then(response => itemArray.push(response.data))
    .then(response => loadItemsInDom(sortItems(itemArray, currentSort)))
    .catch(error => console.log(error))
}

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

const sortPage = () => {
  if ($('#sortBtn').text() === 'Sort Asc') {
    $('#sortBtn').text('Sort Desc')
    currentSort = 'asc'
    loadItemsInDom(sortItems(itemArray, 'asc'))
  } else {
    $('#sortBtn').text('Sort Asc')
    currentSort = 'desc'
    loadItemsInDom(sortItems(itemArray, 'desc'))
  }
}
const toggleItemVisibility = (event) => {
  if ($(event.target).parent().siblings('div').hasClass('hidden')) {
    $(event.target).parent().siblings('div').removeClass('hidden')
  } else {
    $(event.target).parent().siblings('div').addClass('hidden')
  }
}

$('.add-btn').on('click', addItem)
$('.sort-btn').on('click', sortPage)
$('.item-container').on('change', '#itemCleanliness', updateCleanliness)
  .on('click', '.item-name', toggleItemVisibility)
$('.garage-btn').click(() => {
  if ($('.garage-door').hasClass('slideup')) {
    $('.garage-door').removeClass('slideup').addClass('slidedown')
    $('.garage-btn').removeClass('garage-btn-close').addClass('garage-btn-open')
  } else {
    $('.garage-door').removeClass('slidedown').addClass('slideup')
    $('.garage-btn').removeClass('garage-btn-open').addClass('garage-btn-close')
  }
})
