class Book {
  constructor(title, category, author, isbn, addby) {
    this.title = title;
    this.category = category;
    this.author = author;
    this.isbn = isbn;
    this.addby = addby;
  }
}

class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.category}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td>${book.addby}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if(el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    
    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#category').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
    document.querySelector('#addby').value = '';
  }
}

// Store Class: Handles Storage
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault();
  
  // Get form values
  const title = document.querySelector('#title').value;
  const category = document.querySelector('#category').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;
  const addby = document.querySelector('#addby').value;

  // Validate
  if(title === '' || category === '' || author === '' || isbn === '' || addby === '') {
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    // Instantiate book
    const book = new Book(title, category, author, isbn, addby);

    // Add a Book to UI
    UI.addBookToList(book);

    // Add book to store
    Store.addBook(book);

    // Show success message
    UI.showAlert('Book Added', 'success');

    // Clear fields
    UI.clearFields()
  }
});

// Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
  // Remove book from UI
  UI.deleteBook(e.target)

  // Remove book from Store
  Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);

  // Show success message
  UI.showAlert('Book Removed', 'success');
});

let allBooks = JSON.parse(localStorage.getItem('books'));

let booksTerror = [];
let booksRomance = [];
for (let livro of allBooks) {
  console.log(livro);

  let categoryOfBook = livro.category;

  if (categoryOfBook === 'Terror') {
    booksTerror.push(livro)
  } else if (categoryOfBook === 'Romance') {
    booksRomance.push(livro)
  }
}
console.log(`Total de livros de Terror: ${booksTerror.length}`)
console.log(`Total de livros de Romance: ${booksRomance.length}`)