import icons from 'url:../../img/icons.svg';
export default class View {
     _data;
     /**
      * @param {Object | Object[]} data
      * @param {boolean} [render=true]
      * @return {undefined | string}
      * @this {Object}
      * @author Minhaz Halim
      * @todo
      */
     render(data,render = true){
          if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
          this._data = data;
          const markup = this._generateMarkup();
          if(!render) return markup;
          this._clear();
          this._parentElement.insertAdjacentHTML('afterbegin',markup);
     }
     update(data){
          this._data = data;
          const newMarkup = this._generateMarkup();
          const newDOM = document.createRange().createContextualFragment(newMarkup);
          const newElements = Array.from(newDOM.querySelectorAll('*'))
          const currentElements = Array.from(this._parentElement.querySelectorAll('*'));
          newElements.forEach((newElement,index) => {
               const current = currentElements[index];
               if(!newElement.isEqualNode(current) && newElement.firstChild?.nodeValue.trim() !== ""){
                    current.textContent = newElement.textContent;
               }
               if(!newElement.isEqualNode(current)){
                    Array.from(newElement.attributes).forEach(attribute => {
                         current.setAttribute(attribute.name,attribute.value);
                    });
               }
          });
     }
     _clear(){
          this._parentElement.innerHTML = "";
     }
     renderSpinner(){
          const markup = `
               <div class="spinner">
                    <svg><use href="${icons}#icon-loader"></use></svg>
               </div>
          `;
          this._clear();
          this._parentElement.insertAdjacentHTML('afterbegin',markup);
     }
     renderError(message = this._errorMessage){
          const markup = `
               <div class="error">
                    <div>
                         <svg><use href="${icons}#icon-alert-triangle"></use></svg>
                    </div>
                    <p>${message}</p>
               </div>
          `;
          this._clear();
          this._parentElement.insertAdjacentHTML('afterbegin',markup);
     }
     renderMessage(message = this._message){
          const markup = `
               <div class="message">
                    <div>
                         <svg><use href="${icons}#icon-smile"></use></svg>
                    </div>
                    <p>${message}</p>
               </div>
          `;
          this._clear();
          this._parentElement.insertAdjacentHTML('afterbegin',markup);
     }
}