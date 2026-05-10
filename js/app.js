import { dosageData } from './data.js';
import { scalesData } from './scalesData.js';
import { codingData } from './codingData.js';

const tg = window.Telegram?.WebApp;
if (tg) { tg.expand(); tg.ready(); }

let currentMode = 'rate';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSearch();
    showPage('main-menu');
});

function initNavigation() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.onclick = () => showPage(item.dataset.page);
    });
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.onclick = () => showPage('main-menu');
    });
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
        if (pageId === 'dosage') renderDosageTable(dosageData);
        if (pageId === 'calc') initCalculator();
        if (pageId === 'scales') renderScalesList();
        if (pageId === 'coding') renderCodingTable(codingData);
    }
}

function initSearch() {
    document.getElementById('doseSearch')?.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        renderDosageTable(dosageData.filter(d => d.name.toLowerCase().includes(q)));
    });
    document.getElementById('diagSearch')?.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        renderCodingTable(codingData.filter(d => 
            d.name.toLowerCase().includes(q) || d.mkx.toLowerCase().includes(q) || d.icpc.toLowerCase().includes(q)
        ));
    });
}

// --- ТАБЛИЦІ ---
function renderDosageTable(data) {
    const tbody = document.getElementById('dosage-table-body');
    if (!tbody) return;
    tbody.innerHTML = data.map(i => `
        <tr>
            <td><strong style="color:var(--accent-color)">${i.name}</strong></td>
            <td class="bolus-val">${i.bMin > 0 ? `${i.bMin}-${i.bMax} <small>${i.bUnit}</small>` : '—'}</td>
            <td>${i.iMin > 0 ? `${i.iMin}-${i.iMax} <small>${i.iUnit}</small>` : '—'}</td>
        </tr>
    `).join('');
}

function renderCodingTable(data) {
    const container = document.getElementById('coding-results');
    if (!container) return;
    container.innerHTML = `
        <div class="table-container">
            <table>
                <thead><tr><th style="width:50%">Діагноз</th><th style="width:25%">МКХ</th><th style="width:25%">ICPC</th></tr></thead>
                <tbody>
                    ${data.map(i => `
                        <tr>
                            <td style="font-size:13px">${i.name}</td>
                            <td><span class="code-badge mkx">${i.mkx}</span></td>
                            <td><span class="code-badge icpc">${i.icpc}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// --- КАЛЬКУЛЯТОР ---
function initCalculator() {
    const container = document.getElementById('calc-content');
    container.innerHTML = `
        <div class="calc-mode-toggle">
            <button id="mode-rate" class="mode-btn ${currentMode === 'rate' ? 'active' : ''}">Доза → Мл/год</button>
            <button id="mode-dose" class="mode-btn ${currentMode === 'dose' ? 'active' : ''}">Мл/год → Доза</button>
        </div>
        <div class="calc-form">
            <div class="input-group"><label>Вага (кг)</label><input type="number" id="c-weight" value="80"></div>
            <div style="display:flex; gap:10px;">
                <div class="input-group" style="flex:1;"><label>Препарат</label><input type="number" id="c-mg" value="200"></div>
                <div class="input-group" style="flex:0 0 80px;"><label>Од.</label>
                    <select id="c-unit"><option value="mg">мг</option><option value="mcg">мкг</option></select>
                </div>
            </div>
            <div class="input-group"><label>Об'єм (мл)</label><input type="number" id="c-vol" value="50"></div>
            <div class="input-group highlight">
                <label>${currentMode === 'rate' ? 'Доза (мкг/кг/хв)' : 'Швидкість (мл/год)'}</label>
                <input type="number" id="c-main-input" step="0.001" placeholder="0.000">
            </div>
            <div class="result-box"><div id="res-val">0.000</div></div>
        </div>
    `;
    document.querySelectorAll('.mode-btn').forEach(b => b.onclick = () => { currentMode = b.id === 'mode-rate' ? 'rate' : 'dose'; initCalculator(); });
    ['c-weight', 'c-mg', 'c-unit', 'c-vol', 'c-main-input'].forEach(id => document.getElementById(id).oninput = runCalc);
}

function runCalc() {
    const w = parseFloat(document.getElementById('c-weight').value) || 0;
    const m = parseFloat(document.getElementById('c-mg').value) || 0;
    const u = document.getElementById('c-unit').value;
    const v = parseFloat(document.getElementById('c-vol').value) || 0;
    const val = parseFloat(document.getElementById('c-main-input').value) || 0;
    const res = document.getElementById('res-val');
    
    if (w <= 0 || m <= 0 || v <= 0 || val <= 0) return res.innerText = "0.000";
    const conc = (u === 'mg' ? m * 1000 : m) / v;
    
    if (currentMode === 'rate') {
        res.innerHTML = `${((val * w * 60) / conc).toFixed(3)} <small>мл/год</small>`;
    } else {
        res.innerHTML = `${((val * conc) / (w * 60)).toFixed(3)} <small>мкг/кг/хв</small>`;
    }
}

// --- ШКАЛИ ---
function renderScalesList() {
    const container = document.getElementById('scales-content');
    container.innerHTML = `<div class="scales-menu">
        ${scalesData.map(s => `<div class="scale-card" onclick="window.openScale('${s.id}')"><span>${s.name}</span><i class="fas fa-chevron-right"></i></div>`).join('')}
        <div class="scale-card" onclick="window.openBurns()"><span>Площа опіків</span><i class="fas fa-chevron-right"></i></div>
    </div>`;
}

window.openScale = function(id) {
    const s = scalesData.find(x => x.id === id);
    let h = `<button class="back-btn-small" onclick="document.dispatchEvent(new Event('DOMContentLoaded'))"><i class="fas fa-arrow-left"></i> Назад</button><h3>${s.name}</h3>`;
    s.groups.forEach((g, gi) => {
        h += `<div class="group-title">${g.title}</div><div class="options-list">
            ${g.options.map(o => `<div class="opt-item" data-p="${o.points}" onclick="window.selOpt(this)">
                <div class="opt-item-text">${o.text}</div><span>+${o.points}</span>
            </div>`).join('')}
        </div>`;
    });
    h += `<div class="result-box">Бал: <span id="s-res">0</span></div>`;
    document.getElementById('scales-content').innerHTML = h;
};

window.selOpt = function(el) {
    el.parentElement.querySelectorAll('.opt-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    let total = 0;
    document.querySelectorAll('.opt-item.active').forEach(i => total += parseInt(i.dataset.p));
    document.getElementById('s-res').innerText = total;
};

window.openBurns = function() {
    const parts = [{n:"Голова",p:9},{n:"Тулуб П",p:18},{n:"Тулуб З",p:18},{n:"Рука Л",p:9},{n:"Рука П",p:9},{n:"Нога Л",p:18},{n:"Нога П",p:18},{n:"Промежина",p:1}];
    let h = `<button class="back-btn-small" onclick="document.dispatchEvent(new Event('DOMContentLoaded'))"><i class="fas fa-arrow-left"></i> Назад</button><h3>Опіки (%)</h3><div class="burn-grid">
        ${parts.map(p => `<div class="opt-item" data-p="${p.p}" onclick="this.classList.toggle('active'); window.calcBurns()">
            <div class="opt-item-text">${p.n}</div><span>${p.p}%</span>
        </div>`).join('')}
    </div><div class="result-box">Разом: <span id="b-res">0</span>%</div>`;
    document.getElementById('scales-content').innerHTML = h;
};

window.calcBurns = function() {
    let t = 0;
    document.querySelectorAll('.opt-item.active').forEach(i => t += parseInt(i.dataset.p));
    document.getElementById('b-res').innerText = t;
};
