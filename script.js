const searchInput = document.getElementById('diagSearch');
const resultsContainer = document.getElementById('results');

// Функція для відображення карток
function displayCodes(codes) {
    resultsContainer.innerHTML = ''; // Очищуємо попередні результати

    if (codes.length === 0) {
        resultsContainer.innerHTML = '<p>Нічого не знайдено</p>';
        return;
    }

    codes.forEach(item => {
        const card = document.createElement('div');
        card.className = 'diag-card';
        card.innerHTML = `
            <div class="icd-header">
                <strong>${item.icd10}</strong>: ${item.icd10Name}
            </div>
            <div class="icpc-body">
                <span>ICPC-2: <b>${item.icpc}</b></span> — 
                <small>${item.icpcName}</small>
            </div>
        `;
        resultsContainer.appendChild(card);
    });
}

// Слухач подій для пошуку
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    
    const filtered = emsCodes.filter(item => 
        item.icd10.toLowerCase().includes(query) || 
        item.icd10Name.toLowerCase().includes(query) ||
        item.icpc.toLowerCase().includes(query)
    );

    displayCodes(filtered);
});

// Показуємо всі коди при завантаженні (опціонально)
displayCodes(emsCodes);
