const searchEngine = document.querySelector('#searchEngine');
const minSearch = document.querySelector('#searchNummin');
const maxSearch = document.querySelector('#searchNummax');
const minDelay = document.querySelector('#searchDelaymin');
const maxDelay = document.querySelector('#searchDelaymax');
const customSearch = document.querySelector('#customSearch');
const notifiBtn = document.querySelector('.notificationBtn');
const searchCount = document.querySelector('.searchCount');

let delay = 2000;
let c = 0;
let interval;

function start() {
  const searches = randomNum(toNum(minSearch), toNum(maxSearch));
  interval = setInterval(function() {
    delay = randomNum(toNum(minDelay), toNum(maxDelay)) * 1000,
      search(searches, delay);
  }, delay);
}

function stop() {
  clearInterval(interval);
  c = 0;
}

function search(searches, delay) {
  if (c < searches) {
    openWindow(searchEngine.value, customSearch.value);
    showNoti(searches, delay);
    c++;
    searchCount.innerText = `Search Started!\nTotal Searches: ${searches} \nSearch Remaining: ${searches - c} \nNext Search in: ${delay/1000}s`;
  }
  else {
    stop();
  }
}

function randomNum(min, max) {
  if (min > 0 && max > 0) {
    // Generate a random number between the minimum and maximum values
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  else { return `Negative Number` }
}

function openWindow(searchE, customS) {
  switch (customS) {
    case 'randomSentences':
      fetch("https://icanhazdadjoke.com/slack")
        .then((data) => data.json())
        .then((jokeData) => {
          let query = jokeData.attachments[0].text;
          window.open(`${searchE}${query}`, '_blank');
        }).catch(err => alert(`Error: ` + err));
      break;
    case 'googleTrend':
      alert('google trend');
      break;
  }
}

function toNum(num) {
  return Number(num.value);
}

function showNoti(noSearch, time) {
  // Register the service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function(registration) {
      console.log('Service worker registered with scope: ', registration.scope);
      // Check if the browser supports notifications
      if ("Notification" in window) {
        // Request permission to display notifications
        Notification.requestPermission().then(function(result) {
          // Create a new notification with options
          const title = 'Auto Bing Search';
          const options = {
            body: `Search Started!\nTotal Searches: ${noSearch} \nSearch Remaining: ${noSearch - c} \nNext Search in: ${time/1000}s`,
            icon: '/icons/favicon-32x32.png',
            tag: 'abs-started',
            vibrate: [200]
            /*badge: '/path/to/badge.png',
                actions: [
                  { action: "yes", title: "Yes", icon: "path/to/yes-icon.png" },
                  { action: "no", title: "No", icon: "path/to/no-icon.png" }
              ]*/
          };
          registration.showNotification(title, options);
          if ((noSearch - c) == 0) {
            registration.showNotification('Search Stopped', { icon: '/icons/favicon-32x32.png', vibrate: [200, 100, 200] });
          }
        });
      }
    }).catch(function(error) {
      console.log('Service worker registration failed: ', error);
    });
  }
}

notifiBtn.addEventListener('click', () => {
  if ("Notification" in window) {
    // Request permission to display notifications
    Notification.requestPermission().then(function(result) {
      console.log(result);
    });
  }
});