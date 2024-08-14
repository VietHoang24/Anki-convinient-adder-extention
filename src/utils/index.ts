export function getFields(modelName) {
  return fetch('http://localhost:8765', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'modelFieldNames',
      version: 6,
      params: {
        modelName: modelName,
      },
    }),
  }).then((response) => response.json())
}

export function getModels() {
    return fetch('http://localhost:8765', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'modelNames',
        version: 6
      })
    }).then(response => response.json());
  }
  