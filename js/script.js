'use strict';

window.addEventListener('DOMContentLoaded', () => {

   // Tabs
   const tabs = document.querySelectorAll('.tabheader__item'),
         tabsContent = document.querySelectorAll('.tabcontent'),
         tabsParent = document.querySelector('.tabheader__items');

   function hideTabsContent(){
      tabsContent.forEach(item => {
         item.style.display = 'none';
      });

      tabs.forEach(item => {
         item.classList.remove('tabheader__item_active');
      });
   }

   function showTabContent(i = 0){
      tabsContent[i].style.display = "block";
      tabs[i].classList.add('tabheader__item_active');
   }

   hideTabsContent();
   showTabContent();

   tabsParent.addEventListener('click', e => {
      const target = e.target;

      
      if(target && target.classList.contains('tabheader__item')){
         tabs.forEach((item, i) => {
            if(target == item){
               hideTabsContent();
               showTabContent(i);
            }
         });
      }
   });
   // Tabs END!!!
   // Timer
   const deadline = "2022-03-31T21:30:00";

   function getTimeRemaining(endtime){
      const t = Date.parse(new Date()) - Date.parse(endtime),
            days = Math.floor(t / (1000*60*60*24)),
            hours = Math.floor((t / (1000*60*60) % 24)),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

      return {
         'total': t,
         'days': days,
         'hours': hours,
         'minutes': minutes,
         'seconds': seconds
      };

   }

   // getTimeRemaining(deadline);

   function getZero(num){
      if(num >= 0 && num < 10){
         return `0${num}`;
      } else {
         return num;
      }
   }

   function setClock(selector, endtime){
      const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

      updateClock();
            
      function updateClock(){
         const t = getTimeRemaining(endtime);

         days.innerHTML = getZero(t.days);
         hours.innerHTML = getZero(t.hours);
         minutes.innerHTML = getZero(t.minutes);
         seconds.innerHTML = getZero(t.seconds);

         if(t.total <= 0 ){
            clearInterval(timeInterval);
            days.innerHTML = '00';
            hours.innerHTML = '00';
            minutes.innerHTML = '00';
            seconds.innerHTML = '00';
         }
      }
   }

   setClock('.timer', deadline);

  // Modal

  const modal = document.querySelector('.modal'),
        modalTrigger = document.querySelectorAll('[data-modal]');


   function openModal () {
         modal.classList.add('show');
         modal.classList.remove('hide');
         document.body.style.overflow = 'hidden';
   }

   modalTrigger.forEach(item => {
      item.addEventListener('click', openModal);
   });

   function closeModal(){
      modal.classList.add('hide');
      modal.classList.remove('show');
      document.body.style.overflow = '';
   }

   modal.addEventListener('click', e => {
      if(e.target === modal || e.target.getAttribute('data-close') == ''){
         closeModal();
      }
   });

   document.addEventListener('keydown', e => {
      if(e.code === "Escape" && modal.classList.contains('show')){
         closeModal();
      }
   });

   function showModalByScroll(){
      if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
         openModal();
         window.pageYOffset -= 1;
      }
   }

   window.addEventListener('scroll', showModalByScroll);

   class createMenuCard {
      constructor(src, alt, title, descr, price, parentSelector, ...classes){
         this.src = src,
         this.alt = alt,
         this.title = title,
         this.descr = descr,
         this.price = price,
         this.classes = classes,
         this.parent = document.querySelector(parentSelector),
         this.transfer = 10,
         this.changeToUAH();
      }

      changeToUAH() {
         this.price *= this.transfer;
      }

      render(){
         const element = document.createElement('div');
         
         if(this.classes.length === 0){
            this.element = "menu__item";
            element.classList.add(this.element);
         } else {
            this.classes.forEach(className => element.classList.add(className));
         }

         element.innerHTML = `
               <img src=${this.src} alt=${this.alt}>
               <h3 class="menu__item-subtitle">${this.title}</h3>
               <div class="menu__item-descr">${this.descr}</div>
               <div class="menu__item-divider"></div>
               <div class="menu__item-price">
                  <div class="menu__item-cost">Цена:</div>
                  <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
               </div>
         `;
         this.parent.append(element);
      }
   }

   // const getResource = async (url) => {
   //    const res = await fetch(url);

   //    if(!res.ok){
   //       throw new Error('Pizdec');
   //    }

   //    return await res.json();
   // };

   // getResource('http://localhost:3000/menu')
   //    .then(data => {
   //       data.forEach(({img, altimg, title, descr, price}) => {
   //          new createMenuCard(img, altimg, title, descr, price, ".menu .container").render();
   //       });
   //    });

   axios.get('http://localhost:3000/menu')
      .then( data => {
         data.data.forEach(({img, altimg, title, descr, price}) => {
            new createMenuCard(img, altimg, title, descr, price, ".menu .container").render();
         });
      });




   // Forms!
   
   const forms = document.querySelectorAll('form');
   const massage = {
      loading: "img/svg/spinner.svg",
      success: 'Дякую, ми вам передзвонемо',
      failure: 'Щось пішло не так!'
   };


   forms.forEach(item => {
      bindPostData(item);
   });

   const postData = async (url, data) => {
      const res = await fetch(url , {
         method: "POST",
         headers: {
            'Content-type': 'application/json'
         },
         body: data
      });

      return await res.json();
   };

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
      openModal();

      const thanksModal = document.createElement('div');
      thanksModal.classList.add('modal__dialog');
      thanksModal.innerHTML = `
         <div class="modal__content">
            <div class="modal__close" data-close>×</div>
            <div class="modal__title">${massageModal}</div>
         </div>
      `;

      modal.append(thanksModal);
      setTimeout(()=>{
         thanksModal.remove();
         prevModalDialog.classList.add('show');
         prevModalDialog.classList.remove('hide');
         closeModal();
      }, 2500);
   }

   // fetch('http://localhost:3000/requests')
   //    .then(data => data.json())
   //    .then(res => console.log(res));

   // Slider

   const slides = document.querySelectorAll('.offer__slide'),
         slider = document.querySelector('.offer__slider'),
         prev = document.querySelector('.offer__slider-prev'),
         next = document.querySelector('.offer__slider-next'),
         current = document.querySelector('#current'),
         total = document.querySelector('#total'),
         offerSliderWrapper = document.querySelector('.offer__slider-wrapper'),
         offerSliderInner = offerSliderWrapper.querySelector('.offer__slider-inner'),
         width = window.getComputedStyle(offerSliderWrapper).width;
   


   let slideIndex = 4,
       offset = (+width.slice(0, width.length - 2) * (slideIndex - 1)),
       dotArr = [];

   if(slides.length < 10){
      total.textContent = `0${slides.length}`;
      current.textContent = `0${slideIndex}`;
   } else {
      total.textContent = slides.length;
      current.textContent = slideIndex;
   }

   offerSliderInner.style.width = 100 * slides.length + '%';
   slides.forEach( img => {
      img.style.width = width;
   });

   offerSliderInner.style.display = 'flex';
   offerSliderWrapper.style.overflow = 'hidden';
   offerSliderInner.style.transition = '0.5s all';

   slider.style.position = 'relative';

   const dots = document.createElement('ol');
   dots.classList.add('carousel-indicators');
   slider.append(dots);

   for (let i = 0; i < slides.length; i++){
      const dot = document.createElement('li');
      dot.setAttribute('data-slide-to', i + 1);
      dot.classList.add('dot');
      dots.append(dot);
      dotArr.push(dot);
   }

   dotArr[slideIndex - 1].style.opacity = '1';
   offerSliderInner.style.transform = `translateX(-${offset}px)`;

   dotArr.forEach(item => {
      item.addEventListener('click', (e)=>{
         const slideTo = e.target.getAttribute('data-slide-to');

         slideIndex = slideTo;
         offset = +width.slice(0, width.length - 2) * (slideTo - 1);

         offerSliderInner.style.transform = `translateX(-${offset}px)`;

         // dotArr.forEach( el => el.style.opacity = '.5');
         // dotArr[slideIndex - 1].style.opacity = '1';

         activeSlide(dotArr , slideIndex);

         // if(slides.length < 10){
         //    current.textContent = `0${slideIndex}`;
         // } else {
         //    current.textContent = slideIndex;
         // }

         currentSlide(slides , current);
      });
   });

   next.addEventListener('click', ()=>{
      if(offset == +width.slice(0, width.length - 2) * (slides.length - 1)){
         offset = 0;
      } else {
         offset += +width.slice(0, width.length - 2); 
      }

      offerSliderInner.style.transform = `translateX(-${offset}px)`;

      if(slideIndex == slides.length){
         slideIndex = 1;
      } else {
         slideIndex++;
      }

      // if(slides.length < 10){
      //    current.textContent = `0${slideIndex}`;
      // } else {
      //    current.textContent = slideIndex;
      // }

      currentSlide(slides , current);

      // dotArr.forEach( el => el.style.opacity = '.5');
      // dotArr[slideIndex - 1].style.opacity = '1';

      activeSlide(dotArr , slideIndex);
   });

   prev.addEventListener('click', ()=>{
      if(offset == 0){
         offset = +width.slice(0, width.length - 2) * (slides.length - 1);
      } else {
         offset -= +width.slice(0, width.length - 2); 
      }

      offerSliderInner.style.transform = `translateX(-${offset}px)`;

      if(slideIndex == 1){
         slideIndex = slides.length;
      } else {
         slideIndex--;
      }

      // if(slides.length < 10){
      //    current.textContent = `0${slideIndex}`;
      // } else {
      //    current.textContent = slideIndex;
      // }
      currentSlide(slides , current);

      // dotArr.forEach( el => el.style.opacity = '.5');
      // dotArr[slideIndex - 1].style.opacity = '1';

      activeSlide(dotArr , slideIndex);
   });

   const currentSlide = ( sli , cur ) => {
      if(sli.length < 10){
         cur.textContent = `0${slideIndex}`;
      } else {
         cur.textContent = slideIndex;
      }
   };

   const activeSlide = ( arr, ind ) => {
      arr.forEach( el => el.style.opacity = '.5');
      arr[ind - 1].style.opacity = '1';
   };

   


   // if(slides.length < 10){
   //    total.textContent = `0${slides.length}`;
   // } else {
   //    total.textContent = slides.length;
   // }

   // showSlides(slideIndex);

   // function showSlides(n){
   //    if(n > slides.length){
   //       slideIndex = 1;
   //    }

   //    if(n < 1){
   //       slideIndex = slides.length;
   //    }

   //    slides.forEach( item => {
   //       item.classList.add('hide');
   //    });

   //    slides[slideIndex - 1].classList.remove('hide');
   //    slides[slideIndex - 1].classList.add('show');

   //    if(slideIndex < 10){
   //       current.textContent = `0${slideIndex}`;
   //    } else {
   //       current.textContent = slideIndex;
   //    }
   // } 

   // function plusSlides(n){
   //    showSlides(slideIndex += n);
   // }

   // prev.addEventListener('click', () => {
   //    plusSlides(-1);
   // });

   // next.addEventListener('click', ()=>{
   //    plusSlides(1);
   // });
   
});

