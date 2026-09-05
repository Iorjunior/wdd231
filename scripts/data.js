const currentYearElement = document.querySelector('#currentYear') || document.querySelector('#anoAtual');
if (currentYearElement) {
  currentYearElement.textContent = new Date().getFullYear();
}

const lastModifiedElement = document.querySelector('#ultimaModificacao');
if (lastModifiedElement) {
  lastModifiedElement.textContent = `Última Modificação: ${document.lastModified}`;
}
