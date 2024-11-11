document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initFloatingCards();
    initCardNavigation();
    loadContent();
    initFilters();
    initModal();
    initAutocomplete();
});

function initSidebar() {
    const menuToggle = document.querySelector('.menu-toggle');
    const closeSidebar = document.querySelector('.close-sidebar');
    const sidebar = document.querySelector('.sidebar');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.add('active');
    });

    closeSidebar.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
}

function initFloatingCards() {
    const floatingContainer = document.querySelector('.floating-cards');
    const featuredPoints = Object.values(turisticPoints)
        .flat()
        .filter(point => point.destaque);
    
    // Criar wrapper para animação infinita
    const wrapper = document.createElement('div');
    wrapper.className = 'floating-cards-wrapper';
    
    // Duplicar pontos para criar efeito infinito
    const allPoints = [...featuredPoints, ...featuredPoints];
    
    allPoints.forEach(point => {
        const card = document.createElement('div');
        card.className = 'floating-card';
        card.innerHTML = `
            <img src="${point.imagem}" alt="${point.nome}" onerror="this.src='https://via.placeholder.com/300x200?text=${point.nome}'">
            <div class="floating-card-content">
                <h3>${point.nome}</h3>
                <p>${point.cidade}</p>
            </div>
        `;
        
        card.addEventListener('click', () => showDetails(point));
        wrapper.appendChild(card);
    });
    
    floatingContainer.appendChild(wrapper);

    // Clone dos cards para criar um loop perfeito
    const clone = wrapper.cloneNode(true);
    floatingContainer.appendChild(clone);
}

function loadContent() {
    Object.entries(turisticPoints).forEach(([category, points]) => {
        const container = document.querySelector(`#${category} .cards-grid`);
        if (container) {
            points.forEach(point => {
                const card = document.createElement('div');
                card.className = 'card';
                card.dataset.category = category;
                card.dataset.city = point.cidade.toLowerCase();
                
                card.innerHTML = `
                    <img src="${point.imagem}" alt="${point.nome}" loading="lazy">
                    <div class="card-content">
                        <h3>${point.nome}</h3>
                        <p>${point.cidade}</p>
                        <p class="card-description">${point.descricao}</p>
                    </div>
                `;
                
                card.addEventListener('click', () => showDetails(point));
                container.appendChild(card);
            });
        }
    });
}

function initFilters() {
    const menuItems = document.querySelectorAll('.menu-item');
    const searchInput = document.getElementById('searchInput');
    
    function filterContent(category, searchTerm = '') {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const cardCategory = card.dataset.category;
            const cardText = card.textContent.toLowerCase();
            const matchesCategory = category === 'todos' || cardCategory === category;
            const matchesSearch = cardText.includes(searchTerm.toLowerCase());
            
            card.style.display = matchesCategory && matchesSearch ? 'block' : 'none';
        });
    }

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            filterContent(item.dataset.category, searchInput.value);
        });
    });

    searchInput.addEventListener('input', (e) => {
        const activeCategory = document.querySelector('.menu-item.active').dataset.category;
        filterContent(activeCategory, e.target.value);
    });
}

function showDetails(point) {
    const modal = document.getElementById('detailsModal');
    const modalBody = modal.querySelector('.modal-body');

    modalBody.innerHTML = `
        <img src="${point.imagem}" alt="${point.nome}" style="width: 100%; border-radius: 10px; margin-bottom: 1rem;">
        <h2>${point.nome}</h2>
        <p class="location"><i class="fas fa-map-marker-alt"></i> ${point.cidade}</p>
        <div class="description">
            <h3>Sobre</h3>
            <p>${point.descricao}</p>
        </div>
        ${point.historia ? `
            <div class="history">
                <h3>História</h3>
                <p>${point.historia}</p>
            </div>
        ` : ''}
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

function initAutocomplete() {
    const searchInput = document.getElementById('searchInput');
    const searchBox = document.querySelector('.search-box');
    
    // Criar elemento para sugestões
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'search-suggestions';
    searchBox.appendChild(suggestionsDiv);

    searchInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        suggestionsDiv.innerHTML = '';

        if (value.length > 0) {
            const matches = cidadesAlagoas.filter(cidade => 
                cidade.toLowerCase().includes(value)
            );

            matches.forEach(cidade => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.textContent = cidade;
                div.addEventListener('click', () => {
                    searchInput.value = cidade;
                    suggestionsDiv.innerHTML = '';
                    filterCards();
                });
                suggestionsDiv.appendChild(div);
            });
        }
    });

    // Fechar sugestões ao clicar fora
    document.addEventListener('click', (e) => {
        if (!searchBox.contains(e.target)) {
            suggestionsDiv.innerHTML = '';
        }
    });
}

function initCardNavigation() {
    const container = document.querySelector('.floating-cards');
    const prevBtn = document.querySelector('.nav-arrow.prev');
    const nextBtn = document.querySelector('.nav-arrow.next');
    const scrollAmount = 300; // Ajuste conforme necessário

    prevBtn.addEventListener('click', () => {
        container.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    nextBtn.addEventListener('click', () => {
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Reiniciar animação quando chegar ao final
    container.addEventListener('scroll', () => {
        if (container.scrollLeft === 0) {
            container.scrollLeft = container.scrollWidth / 2;
        } else if (container.scrollLeft >= container.scrollWidth / 2) {
            container.scrollLeft = 0;
        }
    });
}