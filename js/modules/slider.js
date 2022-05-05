function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}){
   // Slider
   const slides = document.querySelectorAll(slide),
         slider = document.querySelector(container),
         prev = document.querySelector(prevArrow),
         next = document.querySelector(nextArrow),
         current = document.querySelector(currentCounter),
         total = document.querySelector(totalCounter),
         offerSliderWrapper = document.querySelector(wrapper),
         offerSliderInner = offerSliderWrapper.querySelector(field),
         width = window.getComputedStyle(offerSliderWrapper).width;

   function getNum(someWidth){
      return +someWidth.replace(/\D/g, '');
   };
   


   let slideIndex = 1,
       offset = (getNum(width) * (slideIndex - 1)),
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
         offset = getNum(width) * (slideTo - 1);

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
      if(offset == getNum(width) * (slides.length - 1)){
         offset = 0;
      } else {
         offset += getNum(width); 
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
         offset = getNum(width) * (slides.length - 1);
      } else {
         offset -= getNum(width);
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
}

export default slider;