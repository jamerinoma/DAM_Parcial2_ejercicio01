const cards = document.querySelector('#card-dinamica');
const templateCard = document.querySelector('#template-card').content;
const loading = document.querySelector('#loading');
const error = document.querySelector('#error');
const anterior = document.querySelector('#anterior');
const siguiente = document.querySelector('#siguiente');
const paginaTexto = document.querySelector('#pagina');
const total = document.querySelector('#total');

let paginaActual = 1;
let totalPaginas = 1;

const loadingData = (estado) => {
  loading.hidden = !estado;
  anterior.disabled = estado || paginaActual === 1;
  siguiente.disabled = estado || paginaActual === totalPaginas;
};

const showData = (data) => {
  const fragment = document.createDocumentFragment();
  cards.replaceChildren();

  data.results.forEach((item) => {
    const clone = templateCard.cloneNode(true);
    const imagen = clone.querySelector('.foto');
    imagen.src = item.image;
    imagen.alt = item.name;
    clone.querySelector('.nombre').textContent = item.name;
    clone.querySelector('.estado').textContent = `Estado: ${item.status}`;
    clone.querySelector('.especie').textContent = item.species;
    clone.querySelector('.genero').textContent = item.gender;
    clone.querySelector('.origen').textContent = item.origin.name;
    fragment.appendChild(clone);
  });

  cards.appendChild(fragment);
  total.textContent = `${data.info.count} personajes registrados`;
  totalPaginas = data.info.pages;
  paginaTexto.textContent = `Página ${paginaActual} de ${totalPaginas}`;
};

const fetchData = async (pagina = 1) => {
  try {
    loadingData(true);
    error.hidden = true;
    const respuesta = await fetch(`https://rickandmortyapi.com/api/character?page=${pagina}`);
    if (!respuesta.ok) throw new Error('No se pudo obtener la información.');
    const data = await respuesta.json();
    paginaActual = pagina;
    showData(data);
  } catch (err) {
    cards.replaceChildren();
    total.textContent = 'Sin información disponible';
    error.textContent = 'No fue posible consultar los personajes. Comprueba tu conexión a Internet.';
    error.hidden = false;
  } finally {
    loadingData(false);
  }
};

anterior.addEventListener('click', () => fetchData(paginaActual - 1));
siguiente.addEventListener('click', () => fetchData(paginaActual + 1));
document.addEventListener('DOMContentLoaded', () => fetchData());
