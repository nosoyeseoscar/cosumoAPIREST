const API_KEY = '616cb726-cd84-4584-b6b5-8188eb2b0d26'

const BASE_URL = "https://api.thecatapi.com/v1/"
const URL_RANDOM = `${BASE_URL}images/search?limit=2`
//const URL_FAVOURITES = `${BASE_URL}favourites?api_key=${API_KEY}`
const URL_FAVOURITES = `${BASE_URL}favourites`
//const URL_FAVOURITES_DELETE = (id) => `${BASE_URL}favourites/${id}?api_key=${API_KEY}`
const URL_FAVOURITES_DELETE = (id) => `${BASE_URL}favourites/${id}`
const URL_UPLOAD = `${BASE_URL}images/upload`

const spanError = document.getElementById("error")

const api = axios.create({
    baseURL: BASE_URL,
})
api.defaults.headers.common['X-API-KEY'] = API_KEY

async function loadRandomMichis() {
    const res = await fetch(URL_RANDOM)
    const data = await res.json()

    if (res.status !== 200) {
        spanError.innerHTML = `Hubo un error al cargar imagenes aleatorias: ${res.status}`
    }
    else {
        const img1 = document.getElementById("img1");
        img1.src = data[0].url
        const img2 = document.getElementById("img2");
        img2.src = data[1].url

        const btnFav1 = document.getElementById('btnFav1')
        btnFav1.addEventListener('click', () => saveFavouriteMichi(data[0].id))
        const btnFav2 = document.getElementById('btnFav2')
        btnFav2.addEventListener('click', () => saveFavouriteMichi(data[1].id))
    }

}

async function loadFavouritesMichis() {
    const res = await fetch(URL_FAVOURITES, {
        method: 'GET',
        headers: {
            'X-API-KEY': API_KEY
        }
    })
    const data = await res.json()

    if (res.status !== 200) {
        spanError.innerHTML = `Hubo un error al cargar favoritos: ${res.status} ${data.message}`
    } else {
        const section = document.getElementById('favouriteMiches')
        section.innerHTML = ""
        const h2 = document.createElement('h2')
        const h2Text = document.createTextNode('Michis Favoritos:')
        h2.appendChild(h2Text)
        section.appendChild(h2)

        data.forEach(michi => {
            const article = document.createElement('article')
            const img = document.createElement('img')
            const btn = document.createElement('button')
            const btnText = document.createTextNode('Sacar al michi de favoritos')

            btn.appendChild(btnText)
            btn.onclick = () => deleteFavouriteMichi(michi.id)
            img.src = michi.image.url
            img.width = 150
            article.appendChild(img)
            article.appendChild(btn)
            section.appendChild(article)
        })
    }
}

async function saveFavouriteMichi(id) {
    const { data, status } = await api.post('/favourites', {
        image_id: id
    })
    /* const res = await fetch(URL_FAVOURITES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,

        },
        body: JSON.stringify({
            image_id: id,
        }),
    })
    const data = await res.json()
*/
    if (status !== 200) {
        spanError.innerHTML = `Hubo un error al dar de alta favorito: ${status} ${data.message}`
    }
    else console.log(`Se agregó el michi: ${id} a Favoritos`)
    loadFavouritesMichis();

}

async function deleteFavouriteMichi(id) {
    const res = await fetch(URL_FAVOURITES_DELETE(id), {
        method: 'DELETE',
        headers: {
            'X-API-KEY': API_KEY
        }
    })
    const data = await res.json()

    if (res.status !== 200) {
        spanError.innerHTML = `Hubo un error al dar de baja de favorito: ${res.status} ${data.message}`
    }
    else {
        console.log(`Se quitó el michi: ${id} de Favoritos`)
        loadFavouritesMichis();
    }

}

function miniatura() {
    const form = document.getElementById('uploadingForm')
    const formData = new FormData(form)
    const reader = new FileReader();

    if (form.children.length === 3) {
        const preview = document.getElementById("preview")
        form.removeChild(preview)
    }
    reader.readAsDataURL(formData.get('file'))

    reader.onload = () => {
        const previewImage = document.createElement('img')
        previewImage.id = "preview"
        previewImage.width = 50
        previewImage.src = reader.result
        form.appendChild(previewImage);
    }

}

async function uploadMichiPhoto() {
    const form = document.getElementById('uploadingForm')
    const formData = new FormData(form)

    console.log(formData.get('file'))


    const res = await fetch(URL_UPLOAD, {
        method: 'POST',
        headers: {
            //'Content-Type': 'multipart/formdata;',
            'X-API-KEY': API_KEY
        },
        body: formData,
    })

    const data = await res.json();

    if (res.status !== 201) {
        spanError.innerHTML = `Hubo un error al subir imagen: ${res.status} ${data.message}`
    }
    else {
        console.log("Foto de michi subida :)");
        console.log({ data });
        console.log(data.url);
        saveFavouriteMichi(data.id)

    }
}

loadRandomMichis()
loadFavouritesMichis()

const btnRandom = document.getElementById('btnRandom')
btnRandom.addEventListener('click', loadRandomMichis)

