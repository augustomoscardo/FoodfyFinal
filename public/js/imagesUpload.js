const ImagesUpload = {
  input:"",
  preview: document.querySelector('#images-preview'),
  uploadLimit: 5,
  files: [],
  handleFileInput(event) {
    const { files: fileList } = event.target

    ImagesUpload.input = event.target

    if (ImagesUpload.hasLimit(event)) return

    Array.from(fileList).forEach( file => {

        ImagesUpload.files.push(file)

        const reader = new FileReader()

        reader.onload = () => {

          const image = new Image()
          image.src = String(reader.result)

          const div = ImagesUpload.getContainer(image)
          ImagesUpload.preview.appendChild(div)
        }

        reader.readAsDataURL(file)

        ImagesUpload.input.files = ImagesUpload.getAllFiles()
    })
  },
  hasLimit(event) {
    const { uploadLimit, input, preview } = ImagesUpload

    const { files: fileList } = input

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} imagens`)
      event.preventDefault()
      return true
    }

    const imagesDiv = []
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == "image")
        imagesDiv.push(item)
    })

    const totalImages = fileList.length + imagesDiv.length
    if (totalImages > uploadLimit) {
      alert(`Você atingiu o limite máximo de imagens`)
      event.preventDefault()
      return true
    }

    return false
  },
  getAllFiles() {
    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

    ImagesUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files
  },
  getContainer(image) {
    const div = document.createElement('div')
    
    div.classList.add('image')

    div.onclick = ImagesUpload.removeImage

    div.appendChild(image)

    div.appendChild(ImagesUpload.getRemoveButton())

    return div
  },
  getRemoveButton() {
    const button = document.createElement('i')
    button.classList.add('material-icons')
    button.innerHTML = "close"
    return button
  },
  removeImage(event) {
    const imageDiv = event.target.parentNode
    const imagesArray = Array.from(ImagesUpload.preview.children)
    const index = imagesArray.indexOf(imageDiv)

    ImagesUpload.files.splice(index, 1)
    ImagesUpload.input.files = ImagesUpload.getAllFiles()

    imageDiv.remove()
  },
  removeOldImage(event) {
    const imageDiv = event.target.parentNode

    if (imageDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"]')
      if (removedFiles) {
        removedFiles.value += `${imageDiv.id},`
      }
    }
    imageDiv.remove()
  }
}

const ImageGallery = {
  highlight: document.querySelector(".recipe-image .highlight > img "),
  preview: document.querySelectorAll(".gallery-preview img"),
  setImage(e) {
    const { target } = e

    ImageGallery.preview.forEach(preview => preview.classList.remove('active'))
    target.classList.add('active')

    ImageGallery.highlight.src = target.src
    Lightbox.image.src = target.src
  }
}

const Lightbox = {
  target: document.querySelector('.lightbox-target'),
  image: document.querySelector('.lightbox-target img'),
  closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
  open() {
    Lightbox.target.style.opacity = 1
    Lightbox.target.style.top = 0
    Lightbox.target.style.bottom = 0
    Lightbox.closeButton.style.top = 0
  },
  close() {
    Lightbox.target.style.opacity = 0
    Lightbox.target.style.top = "-100%"
    Lightbox.target.style.bottom = "initial"
    Lightbox.closeButton.style.top = "-80%"
  }
}