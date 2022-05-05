import {closeModal, openModal} from './modal';
import {postData} from '../services/services';

function forms(formSelector){
 // Forms!
      
   const forms = document.querySelectorAll(formSelector);
   const massage = {
      loading: "img/svg/spinner.svg",
      success: 'Дякую, ми вам передзвонемо',
      failure: 'Щось пішло не так!'
   };


   forms.forEach(item => {
      bindPostData(item);
   });


   function bindPostData(form){
      form.addEventListener('submit', (e) => {
         e.preventDefault();

         const statusMassege = document.createElement('img');
         statusMassege.src = massage.loading;
         statusMassege.style.cssText = `
            display: block;
            margin: auto;
         `;

         form.insertAdjacentElement('afterend', statusMassege);

         const formData = new FormData(form);

         const object = {};
         formData.forEach(function(value, key){
            object[key] = value;
         });
         
         const json = JSON.stringify(Object.fromEntries(formData.entries()));

         postData('http://localhost:3000/requests', json)
         .then( data => {
               console.log( data );
               showThanksModal(massage.success);
               statusMassege.remove();
         }).catch( () => {
            showThanksModal(massage.failure);
         }).finally( () => {
            form.reset();
         });

      });
   }

   // Thanks Modal

   function showThanksModal(massageModal){
      const prevModalDialog = document.querySelector('.modal__dialog');

      prevModalDialog.classList.add('hide');
      openModal('.modal');

      const thanksModal = document.createElement('div');
      thanksModal.classList.add('modal__dialog');
      thanksModal.innerHTML = `
         <div class="modal__content">
            <div class="modal__close" data-close>×</div>
            <div class="modal__title">${massageModal}</div>
         </div>
      `;

      document.querySelector('.modal').append(thanksModal);
      setTimeout(()=>{
         thanksModal.remove();
         prevModalDialog.classList.add('show');
         prevModalDialog.classList.remove('hide');
         closeModal('.modal');
      }, 2500);
 }

 // fetch('http://localhost:3000/requests')
 //    .then(data => data.json())
 //    .then(res => console.log(res));

}

export default forms;