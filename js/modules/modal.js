function openModal (modalSelector) {
   const modal = document.querySelector(modalSelector);
   modal.classList.add('show');
   modal.classList.remove('hide');
   document.body.style.overflow = 'hidden';
}

function closeModal (modalSelector){
   const modal = document.querySelector(modalSelector);
   modal.classList.add('hide');
   modal.classList.remove('show');
   document.body.style.overflow = '';
}

function modal(triggerSelector, modalSelector){
   // Modal

   const modal = document.querySelector(modalSelector),
   modalTrigger = document.querySelectorAll(triggerSelector);

   modalTrigger.forEach(item => {
   item.addEventListener('click', () => openModal(modalSelector));
   });

   modal.addEventListener('click', e => {
      if(e.target === modal || e.target.getAttribute('data-close') == ''){
         closeModal(modalSelector);
      }
   });

   document.addEventListener('keydown', e => {
      if(e.code === "Escape" && modal.classList.contains('show')){
        closeModal(modalSelector);
      }
   });

   function showModalByScroll(){
      if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
         openModal(modalSelector);
         window.pageYOffset -= 1;
      }
   }

   window.addEventListener('scroll', showModalByScroll);
}



export default modal;
export {closeModal};
export {openModal};