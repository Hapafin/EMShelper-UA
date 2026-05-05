const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Імпортуємо дані
import { dosageData } from './data.js';

let currentPage = 'main-menu';

// Навигація
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const pageId = item.dataset.page;
        showPage(pageId);
    });
});

document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => showPage('main-menu'));
});

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    if (pageId === 'main-menu') {
        document.getElementById('main-menu').classList.add('active');
    } else {
        const page = document.getElementById(pageId);
        if (page) page.classList.add('active');
        
        if (pageId === 'calc') initCalculator();
        if (pageId === 'dosage') renderDosageTable();
    }
}

// === Калькулятор ===
function initCalculator() {
    // Тут буде повна форма калькулятора (я можу зробити її ще красивішою)
    // Поки що залишимо логіку, яку ти мав
}

// === Таблиця доз ===
function renderDosageTable(filteredData = dosageData) {
    const tbody = document.getElementById('dosage-table-body');
    tbody.innerHTML = filteredData.map(item => `
        <tr>
            <td><strong style="color:var(--accent-color)">${item.name}</strong></td>
            <td class="bolus-val">${item.bMin > 0 ? `${item.bMin}–${item.bMax} ${item.bUnit}` : '—'}</td>
            <td>${item.iMin > 0 ? `${item.iMin}–${item.iMax} <small>${item.iUnit}</small>` : '—'}</td>
        </tr>
    `).join('');
}

// Пошук
document.getElementById('doseSearch').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = dosageData.filter(d => d.name.toLowerCase().includes(query));
    renderDosageTable(filtered);
});

// Ініціалізація
showPage('main-menu');
