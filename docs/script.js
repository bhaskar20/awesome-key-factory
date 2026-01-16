// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.getElementById('sidebar');

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768) {
    if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  }
});

// Smooth scroll for navigation links
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const headerOffset = 80;
      const elementPosition = targetSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Close mobile menu if open
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
      }

      // Update active nav link
      updateActiveNavLink(targetId);
    }
  });
});

// Update active nav link based on scroll position
function updateActiveNavLink(activeId) {
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === activeId) {
      link.classList.add('active');
    }
  });
}

// Intersection Observer for active nav link highlighting
const sections = document.querySelectorAll('.section');
const observerOptions = {
  root: null,
  rootMargin: '-20% 0px -70% 0px',
  threshold: 0
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = `#${entry.target.id}`;
      updateActiveNavLink(id);
    }
  });
}, observerOptions);

sections.forEach(section => {
  observer.observe(section);
});

// Code tab switching
const codeTabs = document.querySelectorAll('.code-tab');

codeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabGroup = tab.parentElement;
    const tabs = tabGroup.querySelectorAll('.code-tab');
    const codeBlocks = tabGroup.parentElement.querySelectorAll('.code-block');
    
    // Remove active class from all tabs
    tabs.forEach(t => t.classList.remove('active'));
    
    // Add active class to clicked tab
    tab.classList.add('active');
    
    // Hide all code blocks
    codeBlocks.forEach(block => block.classList.add('hidden'));
    
    // Show corresponding code block
    const tabName = tab.getAttribute('data-tab');
    const targetBlock = document.getElementById(`${tabName}-code`);
    if (targetBlock) {
      targetBlock.classList.remove('hidden');
    }
  });
});

// Copy to clipboard functionality for code blocks
const codeBlocks = document.querySelectorAll('.code-block');

codeBlocks.forEach(block => {
  block.style.position = 'relative';
  block.style.cursor = 'pointer';
  
  // Add copy button
  const copyButton = document.createElement('button');
  copyButton.textContent = 'Copy';
  copyButton.className = 'copy-button';
  copyButton.style.cssText = `
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #e2e8f0;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.75rem;
    font-family: inherit;
    transition: all 0.2s ease;
  `;
  
  copyButton.addEventListener('mouseenter', () => {
    copyButton.style.background = 'rgba(255, 255, 255, 0.2)';
  });
  
  copyButton.addEventListener('mouseleave', () => {
    copyButton.style.background = 'rgba(255, 255, 255, 0.1)';
  });
  
  copyButton.addEventListener('click', async (e) => {
    e.stopPropagation();
    const code = block.textContent;
    
    try {
      await navigator.clipboard.writeText(code);
      copyButton.textContent = 'Copied!';
      copyButton.style.background = 'rgba(34, 197, 94, 0.2)';
      copyButton.style.borderColor = 'rgba(34, 197, 94, 0.4)';
      
      setTimeout(() => {
        copyButton.textContent = 'Copy';
        copyButton.style.background = 'rgba(255, 255, 255, 0.1)';
        copyButton.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      copyButton.textContent = 'Error';
      setTimeout(() => {
        copyButton.textContent = 'Copy';
      }, 2000);
    }
  });
  
  block.appendChild(copyButton);
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth > 768) {
      sidebar.classList.remove('open');
    }
  }, 250);
});

// Set initial active nav link
window.addEventListener('load', () => {
  const hash = window.location.hash;
  if (hash) {
    updateActiveNavLink(hash);
    const targetSection = document.querySelector(hash);
    if (targetSection) {
      setTimeout(() => {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  } else {
    updateActiveNavLink('#introduction');
  }
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
  const hash = window.location.hash;
  if (hash) {
    updateActiveNavLink(hash);
  }
});
