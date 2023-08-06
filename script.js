const characters = [
    "Reverendo Green", "Colonnello Mustard", "Dottoressa Orchid", 
    "Contessa Peacock", "Professor Plum", "Miss Scarlett"
];
const weapons = [
    "Candeliere", "Pugnale", "Tubo di Piombo", 
    "Pistola", "Corda", "Chiave Inglese"
];
const rooms = [
    "Sala da Ballo", "Sala da Biliardo", "Serra", 
    "Sala da pranzo", "Bagno", "Cucina", 
    "Biblioteca", "Salotto", "Studio"
];

let allCards = [...characters, ...weapons, ...rooms];
let selectedCards = [];
let remainingCharacters = [...characters];
let remainingWeapons = [...weapons];
let remainingRooms = [...rooms];
let players = [];
let suspects = {};

document.querySelector('.banner-button').addEventListener('click', acceptBanner);
document.getElementById('add-player-button').addEventListener('click', addPlayer);

// Accepts the banner
function acceptBanner() {
    document.getElementById('banner').style.display = 'none';
}

// Adds a player
function addPlayer() {
    let playerInput = document.getElementById('player-input');
let playerName = playerInput.value.trim();
console.log(playerName); // Aggiungi questa linea
if (playerName === '') {
    alert('Inserisci il nome del giocatore.');
    return;
}
    players.push(playerName);
    playerInput.value = '';
    updatePlayerList();
}

// Rimuove un giocatore
function removePlayer(player) {
  const playerIndex = players.indexOf(player);
  if (playerIndex !== -1) {
    if (confirm(`Sei sicuro di voler eliminare il giocatore "${player}"?`)) {
      players.splice(playerIndex, 1);
      updatePlayerList();
    }
  }
}

// Updates the player list
function updatePlayerList() {
    const playerList = document.getElementById('player-list');
    playerList.innerHTML = '';
    players.forEach(player => {
        let listItem = createListItem(player, removePlayer);
        playerList.appendChild(listItem);
    });
}

// Creates a list item
function createListItem(text, removeAction) {
    const listItem = document.createElement('li');
    listItem.className = 'player-list-item';
    const playerText = document.createElement('span');
    playerText.textContent = text;
    listItem.appendChild(playerText);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Elimina';
    deleteButton.onclick = function() {
        removeAction(text);
    };
    listItem.appendChild(deleteButton);
    return listItem;
}

// Adds card to cards seen
function addCardToCardsSeen() {
    let cardsSeenSelector = document.getElementById('cards-seen-selector');
    let selectedCard = cardsSeenSelector.value;

    if (selectedCards.includes(selectedCard)) {
        alert('Questa carta è già stata selezionata.');
        return;
    }

    selectedCards.push(selectedCard);
    let listItem = createCardListItem(selectedCard, removeCardFromCardsSeen);
    document.getElementById('cards-seen').appendChild(listItem);

    // Remove the card from the possibilities sections
    let cardLists = {
        'cards-remaining-characters': remainingCharacters,
        'cards-remaining-weapons': remainingWeapons,
        'cards-remaining-rooms': remainingRooms
    };

    for (let id in cardLists) {
        if (cardLists[id].includes(selectedCard)) {
            cardLists[id].splice(cardLists[id].indexOf(selectedCard), 1);
            let listElement = document.getElementById(id);
            let listItem = Array.from(listElement.children).find(li => li.textContent.includes(selectedCard));
            if (listItem) {
                listElement.removeChild(listItem);
            }
        }
    }
}


// Rimuove una carta dalle carte viste
function removeCardFromCardsSeen(card, listItem) {
  if (confirm(`Sei sicuro di voler eliminare la carta "${card}" dalle carte viste?`)) {
    selectedCards = selectedCards.filter(selected => selected !== card);
    listItem.parentNode.removeChild(listItem);

    // Aggiunge la carta nuovamente alle sezioni delle possibilità, se non presente
    const cardTypes = [remainingCharacters, remainingWeapons, remainingRooms];
    const allCardTypes = [characters, weapons, rooms];

    allCardTypes.forEach((cardType, index) => {
      if (cardType.includes(card) && !cardTypes[index].includes(card)) {
        cardTypes[index].push(card);
        cardTypes[index].sort();
      }
    });

    updateRemainingCards();
  }
}

// Creates a card list item
function createCardListItem(text, removeAction) {
    let listItem = document.createElement('li');
    listItem.textContent = text;
    listItem.className = 'card-list-item';

    let removeButton = document.createElement('button');
    removeButton.textContent = 'Elimina';
    removeButton.onclick = function() {
        removeAction(text, listItem);
    };
    listItem.appendChild(removeButton);

    return listItem;
}

// And the rest of your code...

// Open the player selector
function openPlayerSelector(listItem, card) {
    let playerSelector = createPlayerSelector();
    let confirmButton = createConfirmButton(playerSelector, listItem, card);

    listItem.appendChild(playerSelector);
    listItem.appendChild(confirmButton);
}

function createPlayerSelector() {
    let playerSelector = document.createElement('select');
    playerSelector.className = 'player-selector';

    players.forEach(player => {
        let option = document.createElement('option');
        option.value = player;
        option.textContent = player;
        playerSelector.appendChild(option);
    });

    return playerSelector;
}

function createConfirmButton(playerSelector, listItem, card) {
    let confirmButton = document.createElement('button');
    confirmButton.textContent = 'Conferma';
    confirmButton.onclick = function() {
        let selectedPlayer = playerSelector.value;
        suspects[card] = selectedPlayer;
        let playerName = document.createElement('span');
        playerName.className = 'player-name';
        playerName.textContent = ' (' + selectedPlayer + ')';
        listItem.appendChild(playerName);
        listItem.removeChild(playerSelector);
        listItem.removeChild(confirmButton);
    };

    return confirmButton;
}

// Update remaining cards
function updateRemainingCards() {
    const cardLists = {
        'cards-remaining-characters': remainingCharacters,
        'cards-remaining-weapons': remainingWeapons,
        'cards-remaining-rooms': remainingRooms
    };

    for (let id in cardLists) {
        updateCardList(id, cardLists[id]);
    }
}

function updateCardList(id, cards) {
    let list = document.getElementById(id);
    list.innerHTML = '';

    cards.forEach(card => {
        let listItem = document.createElement('li');
        listItem.textContent = card;
        listItem.className = 'card-list-item';

        let assignButton = createAssignButton(listItem, card);
        listItem.appendChild(assignButton);

        if (suspects[card]) {
            let playerName = document.createElement('span');
            playerName.className = 'player-name';
            playerName.textContent = ' (' + suspects[card] + ')';
            listItem.appendChild(playerName);
        }

        list.appendChild(listItem);
    });
}

function createAssignButton(listItem, card) {
    let assignButton = document.createElement('button');
    assignButton.textContent = 'Sospetto +';
    assignButton.onclick = function() {
        openPlayerSelector(listItem, card);
    };

    let cancelButton = document.createElement('button');
    cancelButton.textContent = 'Annulla';
    cancelButton.onclick = function() {
        resetSuspect(card, listItem);
    };

    let buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.appendChild(assignButton);
    buttonContainer.appendChild(cancelButton);

    return buttonContainer;
}


// Rimuove un sospetto da una carta
function resetSuspect(card, listItem) {
	if (confirm(`Sei sicuro di voler rimuovere il sospetto per la carta "${card}"?`)) {
    delete suspects[card];
    let playerName = listItem.querySelector('.player-name');
    if (playerName) {
        listItem.removeChild(playerName);
    }
	}
}


// Initialize cards seen selector on page load
let cardsSeenSelector = document.getElementById('cards-seen-selector');
allCards.forEach(card => {
    let option = document.createElement('option');
    option.value = card;
    option.textContent = card;
    cardsSeenSelector.appendChild(option);
});

// Initialize player list on start
updatePlayerList();

// Initialize remaining cards list on start
updateRemainingCards();

// Accept banner
function acceptBanner() {
  const banner = document.getElementById('banner');
  banner.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

// Mostra un avviso di conferma prima del refresh della pagina
window.addEventListener('beforeunload', function(event) {
  event.preventDefault();
  event.returnValue = ''; // Richiesto per i browser più vecchi
});

// Funzione per confermare la volontà di aggiornare la pagina
function confirmPageRefresh() {
  const confirmMessage = 'Sei sicuro di voler aggiornare la pagina? Tutti i dati non salvati andranno persi.';
  return confirm(confirmMessage);
}
