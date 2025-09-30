/****************************************
 * SHOP PAGE FUNCTIONALITY
 ****************************************/

// Add to Cart Button Function
document.querySelectorAll(".shop-card button").forEach(button => {
  button.addEventListener("click", function () {
    const card = this.parentElement;
    const product = {
      name: card.querySelector('h3').innerText,
      price: parseFloat(card.querySelector('.price').innerText.replace('$', '')),
    };

    // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));

    // Button click animation
    this.classList.add("clicked");
    setTimeout(() => this.classList.remove("clicked"), 300);

    alert(`🛒 ${product.name} added to cart!`);

  });
});




/****************************************
 * CART PAGE FUNCTIONALITY
 ****************************************/

// Check if we are on the cart page
if (document.getElementById('cart-items')) {

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  // Display all items in cart
  function displayCart() {
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
      cartContainer.innerHTML = '<p style="text-align:center; width:100%;">Your cart is empty!</p>';
      if (cartTotal) cartTotal.innerText = 'Total: $0';
      updateCartCount();
      return;
    }

    let total = 0;

    cart.forEach((item, index) => {
      total += item.price;

      const card = document.createElement('div');
      card.classList.add('cart-card');
      card.innerHTML = `
        <h3>${item.name}</h3>
        <p class="price">$${item.price}</p>
        <button onclick="removeItem(${index})">Remove</button>
      `;
      cartContainer.appendChild(card);
    });

    if (cartTotal) cartTotal.innerText = `Total: $${total.toFixed(2)}`;
    updateCartCount();
  }

  // Remove an item
  window.removeItem = function(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
  }

  // Checkout button functionality
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
      alert(`Thank you for your purchase! Total: $${totalAmount.toFixed(2)}`);

      cart = [];
      localStorage.setItem('cart', JSON.stringify(cart));
      displayCart();
    });
  }

  // Display cart on page load
  displayCart();
}
/***** Smooth infinite carousel for multiple tracks *****/

/* Helper: wait until all images inside an element are loaded (then call cb) */
function imagesLoaded(el, cb) {
  const imgs = Array.from(el.querySelectorAll('img'));
  if (imgs.length === 0) return cb();
  let loaded = 0;
  imgs.forEach(img => {
    if (img.complete) {
      loaded++;
      if (loaded === imgs.length) cb();
    } else {
      img.addEventListener('load', () => {
        loaded++;
        if (loaded === imgs.length) cb();
      });
      img.addEventListener('error', () => {
        // treat error as loaded so it does not block
        loaded++;
        if (loaded === imgs.length) cb();
      });
    }
  });
}

/* Main: find all tracks and initialize each independently */
document.querySelectorAll('.carousel-track').forEach(track => {
  // avoid initializing same track twice
  if (track.dataset._carouselInit === '1') return;
  track.dataset._carouselInit = '1';

  // duplicate content so the track can loop seamlessly
  track.innerHTML += track.innerHTML;
  // ensure the element is visible/has widths after images load
  imagesLoaded(track, () => {
    // variables
    let x = 0; // current translateX (px)
    const speed = parseFloat(track.dataset.speed) || 0.5; // px per frame (adjust)
    let paused = false;

    // pause on hover of the carousel container (use closest .product-carousel or parent)
    const container = track.closest('.product-carousel') || track.parentElement;
    if (container) {
      container.addEventListener('mouseenter', () => { paused = true; });
      container.addEventListener('mouseleave', () => { paused = false; });
    }

    // animation loop
    function step() {
      if (!paused) {
        x -= speed;
        const half = track.scrollWidth / 2; // width of original set (since we've duplicated)
        if (Math.abs(x) >= half) {
          // reset to 0 — because content is duplicated, this jump is invisible
          x = 0;
        }
        // apply transform
        track.style.transform = `translateX(${x}px)`;
      }
      requestAnimationFrame(step);
    }

    // use will-change for smoother GPU acceleration (optional)
    track.style.willChange = 'transform';

    // start animation
    requestAnimationFrame(step);

    // Recalculate on window resize (helps avoid glitches if layout changes)
    window.addEventListener('resize', () => {
      // small timeout to let layout settle
      setTimeout(() => {
        // nothing to do to restart — step uses track.scrollWidth dynamically
      }, 100);
    });
  });
});
