// ESCONDER E MOSTRAR CONTEÚDO
const showHideBtns = document.querySelectorAll('h4')

const recipes = document.querySelector('.recipes')


const instructions = document.querySelector('.instructions')


function addShowHideBtns() {
  if (!showHideBtns.length) return

  for (let showHide of showHideBtns) {
    showHide.addEventListener("click", function(){

      const currentInstructions = showHide.getAttribute('data-alvo');
      const target = document.querySelector(`.${currentInstructions}`)
      const targetInstructions = target.querySelector('.instructions')
      const targetButton = target.querySelector('.topic h4')

      targetInstructions.classList.toggle('hidden')
      
      if (targetInstructions.classList.contains('hidden')) {
        targetButton.textContent = 'MOSTRAR'
      }   else {
        targetButton.textContent = 'ESCONDER'
      }
    })
  }
}

addShowHideBtns()