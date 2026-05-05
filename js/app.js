import { dosageData } from './data.js';

// Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand();
    tg.ready();
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Навигация
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.dataset.page;
            showPage(pageId);
        });
    });

    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => showPage('main-menu'));
    });

    // 2. Поиск препаратов
    const searchInput = document.getElementById('doseSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = dosageData.filter(d => 
                d.name.toLowerCase().includes(query)
            );
            renderDosageTable(filtered);
        });
    }

    // 3. Запуск главной страницы
    showPage('main-menu');
});

function showPage(pageId) {
    // Скрываем все страницы
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Показываем нужную
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Специальная логика для страниц
        if (pageId === 'dosage') {
            renderDosageTable(dosageData);
        }
        if (pageId === 'calc') {
            initCalculator();
        }
    }
}

function renderDosageTable(data) {
    const tbody = document.getElementById('dosage-table-body');
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#888;">Нічого не знайдено</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(item => `
        <tr>
            <td><strong style="color:var(--accent-color)">${item.name}</strong></td>
            <td class="bolus-val">${item.bMin > 0 ? `${item.bMin}–${item.bMax} <small>${item.bUnit}</small>` : '—'}</td>
            <td>${item.iMin > 0 ? `${item.iMin}–${item.iMax} <small>${item.iUnit}</small>` : '—'}</td>
        </tr>
    `).join('');
}

function initCalculator() {
    const container = document.getElementById('calc-content');
    if (container && container.innerHTML === "") {
        container.innerHTML = `
            <div class="calc-form">
                <p style="color: #888; font-size: 14px;">Тут буде калькулятор дофаміну/мезатону...</p>
            </div>
        `;
    }
}
