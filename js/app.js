import { dosageData } from './data.js';

const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand();
    tg.ready();
}

let currentMode = 'rate'; // 'rate' (Доза -> мл/год) или 'dose' (мл/год -> Доза)

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSearch();
    showPage('main-menu');
});

function initNavigation() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => showPage(item.dataset.page));
    });

    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => showPage('main-menu'));
    });
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0);

        if (pageId === 'dosage') renderDosageTable(dosageData);
        if (pageId === 'calc') initCalculator();
    }
}

function initSearch() {
    const searchInput = document.getElementById('doseSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = dosageData.filter(d => d.name.toLowerCase().includes(query));
            renderDosageTable(filtered);
        });
    }
}

function renderDosageTable(data) {
    const tbody = document.getElementById('dosage-table-body');
    if (!tbody) return;
    tbody.innerHTML = data.map(item => `
        <tr>
            <td><strong style="color:var(--accent-color)">${item.name}</strong></td>
            <td class="bolus-val">${item.bMin > 0 ? `${item.bMin}–${item.bMax} <small>${item.bUnit}</small>` : '—'}</td>
            <td>${item.iMin > 0 ? `${item.iMin}–${item.iMax} <small>${item.iUnit}</small>` : '—'}</td>
        </tr>
    `).join('');
}

// --- ЛОГИКА КАЛЬКУЛЯТОРА ---

function initCalculator() {
    const container = document.getElementById('calc-content');
    if (!container) return;

    container.innerHTML = `
        <div class="calc-mode-toggle">
            <button id="mode-rate" class="mode-btn ${currentMode === 'rate' ? 'active' : ''}">Доза → Мл/год</button>
            <button id="mode-dose" class="mode-btn ${currentMode === 'dose' ? 'active' : ''}">Мл/год → Доза</button>
        </div>
        <div class="calc-form">
            <div class="input-group">
                <label>Вага пацієнта (кг)</label>
                <input type="number" id="c-weight" value="80" inputmode="decimal">
            </div>
            <div class="input-row" style="display:flex; gap:10px;">
                <div class="input-group" style="flex:1;">
                    <label>Препарат у шприці</label>
                    <input type="number" id="c-mg" value="200" inputmode="decimal">
                </div>
                <div class="input-group" style="flex:0 0 90px;">
                    <label>Од. вим.</label>
                    <select id="c-unit">
                        <option value="mg">мг</option>
                        <option value="mcg">мкг</option>
                    </select>
                </div>
            </div>
            <div class="input-group">
                <label>Об'єм розчину (мл)</label>
                <input type="number" id="c-vol" value="50" inputmode="decimal">
            </div>
            <div class="input-group highlight" style="border-top:1px solid #333; padding-top:15px; margin-top:10px;">
                <label id="input-label">${currentMode === 'rate' ? 'Доза (мкг/кг/хв)' : 'Швидкість (мл/год)'}</label>
                <input type="number" id="c-main-input" step="0.1" placeholder="0.0" inputmode="decimal">
            </div>
            <div class="result-box" style="margin-top:20px; padding:20px; background:#0a0a0a; border:2px solid var(--card-bg); border-radius:16px; text-align:center;">
                <div id="res-label" style="font-size:13px; color:#888; margin-bottom:5px;">
                    ${currentMode === 'rate' ? 'Швидкість на перфузорі:' : 'Розрахункова доза:'}
                </div>
                <div id="res-val" style="font-size:32px; font-weight:800; color:var(--success-color);">
                    0.0 <small style="font-size:16px;">${currentMode === 'rate' ? 'мл/год' : 'мкг/кг/хв'}</small>
                </div>
            </div>
        </div>
    `;

    // Переключение режимов
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentMode = btn.id === 'mode-rate' ? 'rate' : 'dose';
            initCalculator(); // Перерисовываем форму
        });
    });

    // Слушатели на все поля ввода
    ['c-weight', 'c-mg', 'c-unit', 'c-vol', 'c-main-input'].forEach(id => {
        document.getElementById(id).addEventListener('input', runCalculation);
    });
}

function runCalculation() {
    const weight = parseFloat(document.getElementById('c-weight').value) || 0;
    const amount = parseFloat(document.getElementById('c-mg').value) || 0;
    const unit = document.getElementById('c-unit').value;
    const volume = parseFloat(document.getElementById('c-vol').value) || 0;
    const mainValue = parseFloat(document.getElementById('c-main-input').value) || 0;
    const resValDisplay = document.getElementById('res-val');

    if (weight <= 0 || amount <= 0 || volume <= 0 || mainValue <= 0) return;

    // Концентрация в мкг/мл
    const totalMcg = unit === 'mg' ? amount * 1000 : amount;
    const concentration = totalMcg / volume;

    if (currentMode === 'rate') {
        // Доза -> Скорость: (Доза * Вес * 60) / Концентрация
        const rate = (mainValue * weight * 60) / concentration;
        resValDisplay.innerHTML = `${rate.toFixed(1)} <small style="font-size:16px;">мл/год</small>`;
    } else {
        // Скорость -> Доза: (Скорость * Концентрация) / (Вес * 60)
        const dose = (mainValue * concentration) / (weight * 60);
        resValDisplay.innerHTML = `${dose.toFixed(2)} <small style="font-size:16px;">мкг/кг/хв</small>`;
    }
}
