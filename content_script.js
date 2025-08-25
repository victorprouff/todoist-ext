browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getH1") {
    const h1 = document.querySelector('h1');
    sendResponse({h1: h1 ? h1.textContent : "Aucun H1 trouvé"});
  }
});
