// Импорт данных и утилит
import { dosageData } from './data.js';
import { getConcentration, calculateInfusionRate } from './utils.js';

// Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand();
    tg.ready();
}

// Глобальное состояние (какой расчет сейчас активен)
let currentDrugMg = 200; 

document.addEventListener('DOMContentLoaded', () => {
    // 1. Инициализация навигации
    initNavigation();

    // 2. Инициализация поиска (для страницы дозировок)
    initSearch();

    // 3. Запуск стартовой страницы
    showPage('main-menu');
});

/**
 * Управление навигацией
 */
function initNavigation() {
    // Клик по пунктам главного меню
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.dataset.page;
            showPage(pageId);
        });
    });

    // Кнопки "Назад"
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showPage('main-menu');
        });
    });
}

/**
 * Переключение страниц
 */
function showPage(pageId) {
    // Скрываем все
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Показываем нужную
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0);

        // Инициализируем специфику страницы
        if (pageId === 'dosage') renderDosageTable(dosageData);
        if (pageId === 'calc') initCalculator();
    }
}

/**
 * Логика Дозировок (Таблица и Поиск)
 */
function initSearch() {
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
}

function renderDosageTable(data) {
    const tbody = document.getElementById('dosage-table-body');
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#888; padding: 20px;">Нічого не знайдено</td></tr>';
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

/**
 * Логика Калькулятора Перфузора
 */
function initCalculator() {
    const container = document.getElementById('calc-content');
    if (!container) return;

    // Рендерим форму калькулятора
    container.innerHTML = `
        <div class="calc-form">
            <div class="input-group" style="margin-bottom: 12px;">
                <label>Вага пацієнта (кг)</label>
                <input type="number" id="calc-weight" value="80" inputmode="decimal">
            </div>
            
            <div class="input-group" style="margin-bottom: 12px;">
                <label>Препарат</label>
                <select id="calc-drug">
                    <option value="200">Дофамін (200 мг)</option>
                    <option value="40">Дофамін (40 мг)</option>
                    <option value="10">Мезатон (10 мг)</option>
                    <option value="0.1">Адреналін (0.1 мг/мл)</option>
                </select>
            </div>

            <div class="input-group" style="margin-bottom: 12px;">
                <label>Об'єм розчину (мл)</label>
                <input type="number" id="calc-volume" value="50" inputmode="decimal">
            </div>

            <div class="input-group" style="margin-bottom: 12px;">
                <label>Доза (мкг/кг/хв)</label>
                <input type="number" id="calc-dose" step="0.1" placeholder="5.0" inputmode="decimal">
            </div>

            <div id="calc-result" style="margin-top: 20px; padding: 15px; background: #111; border-radius: 12px; text-align: center; border: 1px solid var(--card-bg);">
                <div style="font-size: 13px; color: #888; margin-bottom: 5px;">Швидкість інфузії:</div>
                <div id="result-value" style="font-size: 32px; font-weight: 800; color: var(--success-color);">0.0 <small style="font-size: 16px;">мл/год</small></div>
            </div>
        </div>
    `;

    // Слушатели событий для мгновенного пересчета
    ['calc-weight', 'calc-drug', 'calc-volume', 'calc-dose'].forEach(id => {
        document.getElementById(id).addEventListener('input', runCalculation);
    });
}

function runCalculation() {
    const weight = parseFloat(document.getElementById('calc-weight').value) || 0;
    const mg = parseFloat(document.getElementById('calc-drug').value) || 0;
    const volume = parseFloat(document.getElementById('calc-volume').value) || 0;
    const dose = parseFloat(document.getElementById('calc-dose').value) || 0;

    const resultElement = document.getElementById('result-value');

    if (weight > 0 && mg > 0 && volume > 0 && dose > 0) {
        const concentration = getConcentration(mg, volume);
        const rate = calculateInfusionRate(dose, weight, concentration);
        
        resultElement.innerHTML = `${rate.toFixed(1)} <small style="font-size: 16px;">мл/год</small>`;
    } else {
        resultElement.innerHTML = `0.0 <small style="font-size: 16px;">мл/год</small>`;
    }
}
