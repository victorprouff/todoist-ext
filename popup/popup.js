function addTaskToTodoist(content, url, apiToken, projectId) {
  const taskData = {
    content: `[${content}](${url})`,
    project_id: projectId
  };

  fetch('https://api.todoist.com/rest/v2/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiToken}`
    },
    body: JSON.stringify(taskData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout de la tâche.');
    }
    return response.json();
  })
  .then(data => {
    alert('Tâche ajoutée à Todoist avec succès !');
  })
  .catch(error => {
    console.error('Erreur:', error);
    alert('Erreur lors de l\'ajout de la tâche.');
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const addToTodoistButton = document.getElementById('addToTodoist');

  browser.tabs.query({active: true, currentWindow: true})
    .then(tabs => {
      const url = tabs[0].url;
      document.getElementById('url').textContent = `URL: ${url}`;

      browser.tabs.sendMessage(tabs[0].id, {action: "getH1"})
        .then(response => {
          const h1 = response.h1;
          document.getElementById('h1').textContent = `Premier H1: ${h1}`;

          addToTodoistButton.addEventListener('click', () => {
            browser.storage.local.get(['apiToken', 'projectId'])
              .then(data => {
                if (!data.apiToken) {
                  alert('Veuillez renseigner votre clé API Todoist dans les options.');
                  return;
                }
                if (!data.projectId) {
                  alert('Veuillez renseigner l\'ID du projet Todoist dans les options.');
                  return;
                }
                addTaskToTodoist(h1, url, data.apiToken, data.projectId);
              });
          });
        })
        .catch(error => {
          document.getElementById('h1').textContent = "Aucun H1 trouvé.";
        });
    });
});
