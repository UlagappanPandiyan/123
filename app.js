// Toggle between Login and Register forms
function toggleForms(formType) {
  if (formType === 'register') {
      document.getElementById('registerForm').style.display = 'block';
      document.getElementById('loginForm').style.display = 'none';
  } else {
      document.getElementById('registerForm').style.display = 'none';
      document.getElementById('loginForm').style.display = 'block';
  }
}

// Register a user
function registerUser() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const phone_number = document.getElementById('registerPhone').value;
    const address = document.getElementById('registerAddress').value;

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone_number, address }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.message === 'User registered successfully') {
            toggleForms('login');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Log in a user
function loginUser() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token); // Store the JWT token
            alert('Login successful');
            window.location.href = '/'; // Redirect to the main page after login
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Handle clicking Login/Register Links
document.getElementById('loginLink').addEventListener('click', function(event) {
  event.preventDefault();
  toggleForms('login');
});

document.getElementById('registerLink').addEventListener('click', function(event) {
  event.preventDefault();
  toggleForms('register');
});
// Fetch and display products
function loadProducts() {
    fetch('http://localhost:3000/products')
      .then(response => response.json())
      .then(products => {
        const productsContainer = document.getElementById('products');
        productsContainer.innerHTML = ''; // Clear any existing content
  
        products.forEach(product => {
          const productElement = document.createElement('div');
          productElement.classList.add('product');
  
          productElement.innerHTML = `
            <img src="${product.image_url}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
          `;
          
          productsContainer.appendChild(productElement);
        });
      })
      .catch(error => console.error('Error fetching products:', error));
  }
  
  // Call loadProducts on page load
  document.addEventListener('DOMContentLoaded', loadProducts);
  