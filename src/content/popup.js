var boxWidth;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if(msg.action === 'measurementConverter') {
    console.log(msg.msg);
    
    document.getElementById("resultText").innerText = msg.msg;
    var newWidth = document.getElementById("share-snippet").offsetWidth;
    document.getElementById("share-snippet").style.left = boxWidth + ((boxWidth - newWidth)/2)+'px';
    console.log((boxWidth + (boxWidth - newWidth)/2));
  }
});

document.addEventListener('contextmenu', box, false);

const delay = millis => new Promise((resolve, reject) => {
  setTimeout(_ => resolve(), millis)
});

function getOffset(element) {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    right: rect.right + window.scrollX,
    bottom: rect.bottom + window.scrollY,
    top: rect.top + window.scrollY,
  }
}

async function box(event) {
  await delay(100);
  if (document.contains(document.getElementById("share-snippet"))) {
    document.getElementById("share-snippet").remove();
  }

  if (window.getSelection().toString().length > 0) {
    const scrollTop = (window.scrollY !== undefined) ? window.scrollY : (document.documentElement || document.body.parentNode || document.body).scrollTop;

    /*const posX = event.clientX - 75;
    const posY = event.clientY - 90 + scrollTop;*/
    var sel = window.getSelection().getRangeAt(0);
    var posX = getOffset(sel).left - 60;
    var posY = getOffset(sel).top - 80;

    if(posX < 0 || posY < 0) {
      posX = event.clientX - 75;
      posY = event.clientY - 90 + scrollTop;
    }

    console.log(`x: ${posX}, y: ${posY}, s: ${scrollTop}`);
    document.body.insertAdjacentHTML('afterend', `<div id="share-snippet" style="z-index: 9999999; display: flex; align-items: center; position: absolute; top: ${posY}px; left: ${posX}px;"><div class="speech-bubble"><div class="share-inside"><h2 id="resultText">Waiting for result...</h2></div></div></div>`); 
    boxWidth = document.getElementById("share-snippet").offsetWidth;
  }
}

window.setInterval(() => {
  if (document.contains(document.getElementById("share-snippet")) && window.getSelection().toString().length === 0) {
    document.getElementById("share-snippet").remove();
  }
}, 10);