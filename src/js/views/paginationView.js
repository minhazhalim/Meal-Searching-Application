import View from './view.js';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
     _parentElement = document.querySelector('.pagination');
     addHandlerClick(handler){
          this._parentElement.addEventListener('click',function (event){
               const button = event.target.closest('.btn--inline');
               if(!button) return;
               const goToPage = +button.dataset.goto;
               handler(goToPage);
          });
     }
     _generateMarkup(){
          const currentPage = this._data.page;
          const numberPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
          if(numberPages === 1 && numberPages > 1){
               return `
                    <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
                         <span>Page ${currentPage + 1}</span>
                         <svg class="search__icon"><use href="${icons}#icon-arrow-right"></use></svg>
                    </button>
               `;
          }
          if(currentPage === numberPages && numberPages > 1){
               return `
                    <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
                         <svg class="search__icon"><use href="${icons}#icon-arrow-left"></use></svg>
                         <span>Page ${currentPage - 1}</span>
                    </button>
               `;
          }
          if(currentPage < numberPages){
               return `
                    <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
                         <svg class="search__icon"><use href="${icons}#icon-arrow-left"></use></svg>
                         <span>Page ${currentPage - 1}</span>
                    </button>
                    <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
                         <span>Page ${currentPage + 1}</span>
                         <svg class="search__icon"><use href="${icons}#icon-arrow-right"></use></svg>
                    </button>
               `;
          }
          return "";
     }
}
export default new PaginationView();