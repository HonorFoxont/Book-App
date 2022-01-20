// Book Class
class Books {
    constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    }
}
//UI class: Handles UI tasks
class UI {
    static displayBooks() {
     const books = Store.getBook();
     books.forEach((book) => UI.addBooksToList(book));
    }

    static addBooksToList(book){
        const bookList = document.querySelector('#book-list');
        //create booklist element
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><a href='#' class="btn btn-secondary btn-sm btn-edit">edit</a></td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td class="isbn">${book.isbn}</td>
            <td><a href='#' class="btn btn-danger btn-sm delete">X</a></td>
        `;

        bookList.appendChild(row);
    }

    static showAlert(messege, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`
        const container = document.querySelector('.container');
        const table = document.querySelector('.table');
        div.appendChild(document.createTextNode(`${messege}`))
        container.insertBefore(div, table);

        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
    static clearFeilds(){
        document.querySelector('#title').value = ''
        document.querySelector('#author').value = ''
        document.querySelector('#isbn').value = ''
    }
    static deleteBooks(toRemove){  
      let bookList = document.getElementById('book-list');  
      let isbn = document.getElementsByClassName('isbn');
      Array.from(isbn).forEach((item) => {
          if(item.textContent == toRemove){
              bookList.removeChild(item.parentElement);
          }
      })
      
    }
    static editBooks(title, author, isbnInfo){  
        let isbn = document.getElementsByClassName('isbn');
        Array.from(isbn).forEach((item) => {
            if(item.textContent == isbnInfo){
             item.previousElementSibling.previousElementSibling.textContent = title;
             item.previousElementSibling.textContent = author;
            }
        })
        
      }
    static clearBookForm(){
        document.getElementById('title-error').innerText = '';
        document.getElementById('author-error').innerText = '';
        document.getElementById('isbn-error').innerText = '';
        document.getElementById('title').classList.remove('is-invalid');
        document.getElementById('author').classList.remove('is-invalid');
        document.getElementById('isbn').classList.remove('is-invalid');
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
        document.querySelector('#edit-title').value = '';
        document.querySelector('#edit-author').value = '';
        document.querySelector('#edit-details').value = '';
        document.querySelector('#isbnH').value = '';
        document.getElementById('edit-title').classList.remove('is-invalid');
        document.getElementById('edit-author').classList.remove('is-invalid');
    }
    static closePopup(){
   UI.clearBookForm();
    var popup  =  document.getElementsByClassName('popup-bg');
      Array.from(popup).forEach( item => {
          item.style.display = 'none';
      })
    }

}
//Store Class: Handles Storage
class Store{
    static getBook(){
        let books;

        if(localStorage.getItem('books') === null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    };

   static addBook(book){
    const books = Store.getBook();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books))
   };

    static removeBook(isbn){
        const books = Store.getBook();
        books.forEach((book, index) => {
        if(book.isbn === isbn){
            books.splice(index, 1);
        }
    })
    localStorage.setItem('books', JSON.stringify(books));
    }

    static editBook(title, author, isbn){
        const books = Store.getBook();
        books.forEach((book, index) => {
        if(book.isbn === isbn){
            books[index].title = title;
            books[index].author = author;
        }
    })
    localStorage.setItem('books', JSON.stringify(books));
    }
}
//Event : Display Book
document.addEventListener('DOMContentLoaded', UI.displayBooks);
//Validation
document.querySelector('#book-form').addEventListener('submit', (e) =>{
    e.preventDefault();
    var bookTitle = document.querySelector('#title').value.trim();
    var bookAuthor = document.querySelector('#author').value.trim();
    var bookIsbn = document.querySelector('#isbn').value.trim();
    var titleError = document.getElementById('title-error');
    var authorError = document.getElementById('author-error');
    var isbnError = document.getElementById('isbn-error');
    var isbnList = document.getElementsByClassName('isbn');
    
    if(!bookTitle.length || !bookAuthor.length || !bookIsbn.length){
        if(!bookTitle.length){
            var titleEtext = document.createTextNode('Please input title');
            titleError.appendChild(titleEtext);
           titleError.innerHTML = 'Please input title';
           document.getElementById('title').classList.add('is-invalid');
        } else {
            titleError.innerHTML = '';
            document.getElementById('title').classList.remove('is-invalid');
        }
        if(!bookAuthor.length){
           authorError.innerHTML = 'Please input the name of author';
           document.getElementById('author').classList.add('is-invalid');

        } else {
            authorError.innerHTML = '';
            document.getElementById('author').classList.remove('is-invalid');
        }
        if(!bookIsbn.length){
           isbnError.innerHTML = 'Please input the ISBN number';
           document.getElementById('isbn').classList.add('is-invalid');
        } else {
            isbnError.innerHTML = '';
            document.getElementById('isbn').classList.remove('is-invalid');
        }
        return;
    }


    if(bookIsbn.length && isbnList.length) {
        let isUnique = true;

        for(let el of isbnList) {
            if(el.innerText === bookIsbn) {
                isUnique = false;
                break;
            }
        }

        if(!isUnique) {
            isbnError.innerHTML = 'ISBN should be unique!';
            document.getElementById('isbn').classList.add('is-invalid');
            return;
        }
    }
    // Event : Add Book
    titleError.innerText = ''
    authorError.innerText = ''
    isbnError.innerText = ''
    document.getElementById('title').classList.remove('is-invalid');
    document.getElementById('author').classList.remove('is-invalid');
    document.getElementById('isbn').classList.remove('is-invalid');


    const book = new Books(bookTitle,bookAuthor,bookIsbn);

    Store.addBook(book);
    UI.addBooksToList(book);
    UI.clearFeilds();
    UI.closePopup();
    UI.showAlert('Book added', 'success')
})
// Event: Remove Book
document.getElementById('book-list').addEventListener('click', del)
function del(e){
    if(e.target.classList.contains('delete')){
    document.getElementById('background').style.display = 'block';
    isbn = e.target.parentElement.previousElementSibling.textContent;
    document.getElementById('isbnH').value = isbn;
}}
        


//Popup
document.getElementById('confirm-yes').addEventListener('click', removeItem)
document.getElementById('confirm-no').addEventListener('click', () => UI.closePopup());
window.addEventListener('click', (e) => {
    if(e.target.classList.contains('popup-bg')){
        UI.closePopup();
        document.getElementById('isbnH').value = '';
    }
})
function removeItem(){   
    isbn = document.getElementById('isbnH').value;
    Store.removeBook(isbn);
    UI.deleteBooks(isbn);
    UI.closePopup();
    UI.showAlert('Book removed', 'success');   
}

//Adding book popup

document.getElementById('add-new').addEventListener('click', openForm);
function openForm(){
    document.getElementById('form').style.display = 'block';
}

const cancelForm = document.getElementsByClassName('cancel-form');
Array.from(cancelForm).forEach( item => {
    item.addEventListener('click', UI.closePopup)
var closeP = document.getElementsByClassName('close-popup');
Array.from(closeP).forEach(item =>{
    item.addEventListener('click', UI.closePopup)
})
})
// Editing books

document.querySelector('#book-list').addEventListener('click', (e) =>{
if(e.target.classList.contains('btn-edit')){
    document.getElementById('edit').style.display = 'block';
    titleInfo = e.target.parentElement.nextElementSibling.textContent;
    authorInfo = e.target.parentElement.nextElementSibling.nextElementSibling.textContent;
    isbnInfo = e.target.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.textContent;
    document.getElementById('edit-title').value = titleInfo;
    document.getElementById('edit-author').value = authorInfo;
    document.getElementById('edit-details').value = isbnInfo;
}
})

document.getElementById('edit-form').addEventListener('submit', e => {
    e.preventDefault();
    bookTitle = document.getElementById('edit-title').value.trim();
    bookAuthor = document.getElementById('edit-author').value.trim();
    isbnInfo = document.getElementById('edit-details').value.trim();
    var titleError = document.getElementById('edit-title-error');
    var authorError = document.getElementById('edit-author-error');
    
    if(!bookTitle.length || !bookAuthor.length){
        if(!bookTitle.length){
            var titleEtext = document.createTextNode('Please input title');
            titleError.appendChild(titleEtext);
           titleError.innerHTML = 'Please input title';
           document.getElementById('edit-title').classList.add('is-invalid');
        } else {
            titleError.innerHTML = '';
            document.getElementById('edit-title').classList.remove('is-invalid');
        }
        if(!bookAuthor.length){
           authorError.innerHTML = 'Please input the name of author';
           document.getElementById('edit-author').classList.add('is-invalid');

        } else {
            authorError.innerHTML = '';
            document.getElementById('edit-author').classList.remove('is-invalid');
        }
        return;
    }
    titleError.innerText = '';
    authorError.innerText = '';
    document.getElementById('edit-title').classList.remove('is-invalid');
    document.getElementById('edit-author').classList.remove('is-invalid');
    UI.editBooks(bookTitle, bookAuthor, isbnInfo);
    Store.editBook(bookTitle, bookAuthor, isbnInfo);
    UI.closePopup();
})