document.addEventListener('DOMContentLoaded', function() {
  const apiTokenInput = document.getElementById('apiToken');
  const projectIdInput = document.getElementById('projectId');
  const saveButton = document.getElementById('save');

  // Charge les données sauvegardées
  browser.storage.local.get(['apiToken', 'projectId'])
    .then(data => {
      if (data.apiToken) {
        apiTokenInput.value = data.apiToken;
      }
      if (data.projectId) {
        projectIdInput.value = data.projectId;
      }
    });

  // Sauvegarde les données quand on clique sur "Enregistrer"
  saveButton.addEventListener('click', () => {
    const apiToken = apiTokenInput.value;
    const projectId = projectIdInput.value;
    browser.storage.local.set({ apiToken: apiToken, projectId: projectId })
      .then(() => {
        alert('Paramètres enregistrés avec succès !');
      });
  });
});
