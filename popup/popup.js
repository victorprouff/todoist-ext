document.addEventListener('DOMContentLoaded', function() {
  const taskTitleInput = document.getElementById('taskTitle');
  const taskCommentInput = document.getElementById('taskComment');
  const taskUrlInput = document.getElementById('taskUrl');
  const taskSectionSelect = document.getElementById('taskSection');
  const addToTodoistButton = document.getElementById('addToTodoist');
  const openOptionsLink = document.getElementById('openOptions');
  const messageDiv = document.getElementById('message');

  // Fonction pour afficher un message
  function showMessage(text, isSuccess) {
    messageDiv.textContent = text;
    messageDiv.className = isSuccess ? 'success' : 'error';
  }

  // Ouvre la page d'options
  openOptionsLink.addEventListener('click', (e) => {
    e.preventDefault();
    browser.runtime.openOptionsPage();
  });

  // Remplit les champs avec l'URL et le H1 de la page active
  browser.tabs.query({active: true, currentWindow: true})
    .then(tabs => {
      const url = tabs[0].url;
      taskUrlInput.value = url;

      browser.tabs.sendMessage(tabs[0].id, {action: "getH1"})
        .then(response => {
          const h1 = response.h1;
          taskTitleInput.value = h1 || "Nouvelle tâche";
        })
        .catch(error => {
          taskTitleInput.value = "Nouvelle tâche";
        });
    });

  // Ajoute la tâche à Todoist
  addToTodoistButton.addEventListener('click', () => {
    const title = taskTitleInput.value;
    const comment = taskCommentInput.value;
    const url = taskUrlInput.value;
    const sectionId = taskSectionSelect.value;

    browser.storage.local.get(['apiToken', 'projectId'])
      .then(data => {
        if (!data.apiToken) {
          showMessage('Veuillez renseigner votre clé API Todoist dans les options.', false);
          return;
        }
        if (!data.projectId) {
          showMessage('Veuillez renseigner l\'ID du projet Todoist dans les options.', false);
          return;
        }
        addTaskToTodoist(title, comment, url, data.apiToken, sectionId);
      });
  });

  function addTaskToTodoist(content, comment, url, apiToken, sectionId) {
    const taskData = {
      content: `[${content}](${url})` + (comment ? ` - ${comment}` : ''),
      section_id: sectionId
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
      showMessage('Tâche ajoutée à Todoist avec succès !', true);
    })
    .catch(error => {
      console.error('Erreur:', error);
      showMessage('Erreur lors de l\'ajout de la tâche.', false);
    });
  }
});
