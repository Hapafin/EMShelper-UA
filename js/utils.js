/**
 * Розрахунок концентрації (мкг в 1 мл)
 * @param {number} mg - Кількість міліграм препарату
 * @param {number} ml - Об'єм розчинника
 */
export function getConcentration(mg, ml) {
    if (!ml || ml === 0) return 0;
    return (mg * 1000) / ml;
}

/**
 * Розрахунок швидкості інфузії (мл/год)
 * @param {number} dose - Доза (мкг/кг/хв)
 * @param {number} weight - Вага пацієнта (кг)
 * @param {number} concentration - Концентрація (мкг/мл)
 */
export function calculateInfusionRate(dose, weight, concentration) {
    if (!concentration || concentration === 0) return 0;
    return (dose * weight * 60) / concentration;
}
