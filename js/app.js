import { dosageData } from './data.js';
import { scalesData } from './scalesData.js';

const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand();
    tg.ready();
}

let currentMode = 'rate'; // 'rate' или 'dose'

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
        if (pageId === 'scales') renderScalesList();
    }
}

// --- ЛОГИКА ДОЗИРОВОК ---
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

// --- ЛОГИКА КАЛЬКУЛЯТОРА (3 знака) ---
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
            <div class="input-group highlight">
                <label id="input-label">${currentMode === 'rate' ? 'Доза (мкг/кг/хв)' : 'Швидкість (мл/год)'}</label>
                <input type="number" id="c-main-input" step="0.001" placeholder="0.000" inputmode="decimal">
            </div>
            <div class="result-box">
                <div id="res-label" style="font-size:12px; color:#888; margin-bottom:5px;">
                    ${currentMode === 'rate' ? 'Швидкість на перфузорі:' : 'Розрахункова доза:'}
                </div>
                <div id="res-val" style="font-size:32px; font-weight:800; color:var(--success-color);">
                    0.000 <small style="font-size:16px;">${currentMode === 'rate' ? 'мл/год' : 'мкг/кг/хв'}</small>
                </div>
            </div>
        </div>
    `;

    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.onclick = () => {
            currentMode = btn.id === 'mode-rate' ? 'rate' : 'dose';
            initCalculator();
        };
    });

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

    if (weight <= 0 || amount <= 0 || volume <= 0 || mainValue <= 0) {
        resValDisplay.innerHTML = `0.000 <small style="font-size:16px;">${currentMode === 'rate' ? 'мл/год' : 'мкг/кг/хв'}</small>`;
        return;
    }

    const totalMcg = unit === 'mg' ? amount * 1000 : amount;
    const concentration = totalMcg / volume;

    if (currentMode === 'rate') {
        const rate = (mainValue * weight * 60) / concentration;
        resValDisplay.innerHTML = `${rate.toFixed(3)} <small style="font-size:16px;">мл/год</small>`;
    } else {
        const dose = (mainValue * concentration) / (weight * 60);
        resValDisplay.innerHTML = `${dose.toFixed(3)} <small style="font-size:16px;">мкг/кг/хв</small>`;
    }
}

// --- ЛОГИКА ШКАЛ ---
function renderScalesList() {
    const container = document.getElementById('scales-content');
    if (!container) return;
    container.innerHTML = `
        <div class="scales-menu">
            ${scalesData.map(scale => `
                <div class="scale-card" id="btn-${scale.id}">
                    <span>${scale.name}</span><i class="fas fa-chevron-right"></i>
                </div>
            `).join('')}
            <div class="scale-card" id="btn-burns">
                <span>Площа опіків (Rule of 9s)</span><i class="fas fa-chevron-right"></i>
            </div>
        </div>
    `;

    scalesData.forEach(scale => {
        document.getElementById(`btn-${scale.id}`).onclick = () => openScale(scale.id);
    });
    document.getElementById('btn-burns').onclick = openBurns;
}

window.openScale = function(id) {
    const scale = scalesData.find(s => s.id === id);
    const container = document.getElementById('scales-content');
    
    let html = `<button class="back-btn-small"><i class="fas fa-arrow-left"></i> Назад</button>
                <h3 style="color:var(--accent-color); margin-bottom:15px;">${scale.name}</h3>`;

    scale.groups.forEach((group, gIdx) => {
        html += `<div class="scale-group">
            <div class="group-title">${group.title}</div>
            <div class="options-list" data-group="${gIdx}">
                ${group.options.map(opt => `
                    <div class="opt-item" data-points="${opt.points}">
                        ${opt.text} <span>+${opt.points}</span>
                    </div>
                `).join('')}
            </div>
        </div>`;
    });

    html += `<div class="result-box">Бал: <span id="scale-res">0</span></div>`;
    container.innerHTML = html;

    container.querySelector('.back-btn-small').onclick = renderScalesList;

    container.querySelectorAll('.opt-item').forEach(item => {
        item.onclick = function() {
            this.parentElement.querySelectorAll('.opt-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            calculateScaleSum();
        };
    });
};

function calculateScaleSum() {
    let total = 0;
    document.querySelectorAll('.opt-item.active').forEach(item => {
        total += parseInt(item.dataset.points);
    });
    const res = document.getElementById('scale-res');
    if(res) res.innerText = total;
}

window.openBurns = function() {
    const container = document.getElementById('scales-content');
    const burnParts = [
        { name: "Голова", p: 9 }, { name: "Перед тулуба", p: 18 },
        { name: "Зад тулуба", p: 18 }, { name: "Рука (Л)", p: 9 },
        { name: "Рука (П)", p: 9 }, { name: "Нога (Л)", p: 18 },
        { name: "Нога (П)", p: 18 }, { name: "Промежина", p: 1 }
    ];

    container.innerHTML = `
        <button class="back-btn-small"><i class="fas fa-arrow-left"></i> Назад</button>
        <h3 style="color:var(--accent-color)">Площа опіків (%)</h3>
        <div class="burn-grid">
            ${burnParts.map(bp => `<div class="opt-item burn-opt" data-p="${bp.p}">${bp.name} <span>${bp.p}%</span></div>`).join('')}
        </div>
        <div class="result-box">Уражено: <span id="burn-res">0</span>%</div>
    `;

    container.querySelector('.back-btn-small').onclick = renderScalesList;

    container.querySelectorAll('.burn-opt').forEach(item => {
        item.onclick = function() {
            this.classList.toggle('active');
            let total = 0;
            document.querySelectorAll('.burn-opt.active').forEach(a => total += parseInt(a.dataset.p));
            document.getElementById('burn-res').innerText = total;
        };
    });
};
