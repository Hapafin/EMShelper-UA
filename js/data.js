export const dosageData = [
    { name: "Рокуроній",     bMin: 0.6,  bMax: 1.2, bUnit: "мг/кг",    iMin: 0,    iMax: 0,    iUnit: "" },
    { name: "Адреналін",     bMin: 0,    bMax: 0,   bUnit: "",         iMin: 0.01, iMax: 0.5,  iUnit: "мкг/кг/хв" },
    { name: "Пропофол",      bMin: 1.5,  bMax: 2.5, bUnit: "мг/кг",    iMin: 0.3,  iMax: 6.0,  iUnit: "мг/кг/год" },
    { name: "Кетамін",       bMin: 1,    bMax: 2,   bUnit: "мг/кг",    iMin: 0.1,  iMax: 0.3,  iUnit: "мг/кг/год" },
    { name: "Тіопентал",     bMin: 3,    bMax: 7,   bUnit: "мг/кг",    iMin: 0.5,  iMax: 7.0,  iUnit: "мг/кг/год" },
    { name: "Норадреналін",  bMin: 0,    bMax: 0,   bUnit: "",         iMin: 0.05, iMax: 1.0,  iUnit: "мкг/кг/хв" },
    { name: "Фентаніл",      bMin: 1,    bMax: 3,   bUnit: "мкг/кг",   iMin: 1.0,  iMax: 5.0,  iUnit: "мкг/кг/год" },
    { name: "Морфін",        bMin: 0.05, bMax: 0.1, bUnit: "мг/кг",    iMin: 0,    iMax: 0,    iUnit: "" },
    { name: "Мідазолам",     bMin: 0.02, bMax: 0.1, bUnit: "мг/кг",    iMin: 0.02, iMax: 0.1,  iUnit: "мг/кг/год" },
    { name: "Дофамін",       bMin: 0,    bMax: 0,   bUnit: "",         iMin: 2.0,  iMax: 20,   iUnit: "мкг/кг/хв" },
    { name: "Добутамін",     bMin: 0,    bMax: 0,   bUnit: "",         iMin: 2.0,  iMax: 20,   iUnit: "мкг/кг/хв" },
    { name: "Дексдор",       bMin: 0,    bMax: 0,   bUnit: "",         iMin: 0.2,  iMax: 1.4,  iUnit: "мкг/кг/год" },
    { name: "ГОМК",          bMin: 50,   bMax: 100, bUnit: "мг/кг",    iMin: 10,   iMax: 30,   iUnit: "мг/кг/год" },
    // НОВІ ПРЕПАРАТИ
    { name: "Урапідил",      bMin: 10,   bMax: 50,  bUnit: "мг",       iMin: 5,    iMax: 40,   iUnit: "мг/год" },
    { name: "Нітрогліцерин", bMin: 0,    bMax: 0,   bUnit: "",         iMin: 10,   iMax: 200,  iUnit: "мкг/хв" },
    { name: "Метопролол",    bMin: 2.5,  bMax: 5.0, bUnit: "мг",       iMin: 0,    iMax: 0,    iUnit: "" }
];

export const emsCodes = [
    { icd10: "A04", icd10Name: "Інші бактеріальні кишкові інфекції", icpc: "D70", icpcName: "Шлунково-кишкова інфекція" },
    { icd10: "А05", icd10Name: "Інші бактеріальні харчові отруєння", icpc: "D70", icpcName: "Шлунково-кишкова інфекція" },
    { icd10: "А05.1", icd10Name: "БОТУЛІЗМ", icpc: "D70", icpcName: "Шлунково-кишкова інфекція" },
    { icd10: "А09", icd10Name: "Діарея і гастроентерит інфекційного походження", icpc: "D70", icpcName: "Шлунково-кишкова інфекція" },
    { icd10: "А15", icd10Name: "ТУБЕРКУЛЬОЗ", icpc: "R99/R24", icpcName: "Інші захворювання дихальної системи/ кровохаркання" },
    { icd10: "E10.0", icd10Name: "Цукровий діабет 1 тип з комою", icpc: "А07 Т87/А91", icpcName: "Кома, Гіпоглікемія / Гіперглікемія" },
    { icd10: "І24.1", icd10Name: "ГКС з елевацією сегмента ST", icpc: "К75.1", icpcName: "ГКС з елевацією сегмента ST" },
    { icd10: "І63", icd10Name: "Інфаркт головного мозку", icpc: "К90", icpcName: "Підозра на гострий мозковий інсульт" }
    // ... остальные коды
];
