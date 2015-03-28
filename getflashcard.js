function FlashDeck(key) {
    var deckList = key["deck"],
        deck = [],
        discard = [];
    self.shuffle = function(deckOnly) {
        var tmp = [];
        while(deck.length > 0) {
            tmp.push(deck.pop());
        }
        while(discard.length > 0) {
            tmp.push(discard.pop());
        }
        while(tmp.length > 0) {
            deck.splice(Math.floor(Math.random() * (deck.length + 1)), 0, tmp.pop());
        }
    }
    self.draw = function() {
        if(deck.length < 1) {
            self.shuffle();
        }
        var card = deck.pop();
        discard.push(card);
        return card;
    }
    for(var c in deckList) {
        deck.push(deckList[c]);
    }
    return self;
}
var unixDeck;
function nextCard() {
    var card = unixDeck.draw();
    var answerElem = document.getElementById("answer");
    var promptElem = document.getElementById("prompt");
    answerElem.hidden = true;
    promptElem.innerHTML = card["prompt"];
    answerElem.innerHTML = card["answer"];
}
function showAnswer() {
    document.getElementById("answer").hidden = false;
}

function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'answerkey.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
}
function init() {
    loadJSON(function(response) {
        var answerkey = JSON.parse(response);
        unixDeck = new FlashDeck(answerkey);
        unixDeck.shuffle();
        var show = document.getElementById("showanswer");
        var next = document.getElementById("next");
        show.disabled = false;
        next.disabled = false;
        nextCard();
        show.addEventListener('click', showAnswer);
        next.addEventListener('click', nextCard);
    });
}
init();