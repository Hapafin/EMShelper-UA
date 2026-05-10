export const scalesData = [
    {
        id: "gcs",
        name: "Шкала ком Глазго (GCS)",
        groups: [
            {
                title: "Розплющування очей",
                options: [
                    { text: "Довільне", points: 4 },
                    { text: "На мовленнєвий подразник", points: 3 },
                    { text: "На больовий подразник", points: 2 },
                    { text: "Відсутнє", points: 1 }
                ]
            },
            {
                title: "Вербальна відповідь",
                options: [
                    { text: "Орієнтований, швидка відповідь", points: 5 },
                    { text: "Дезорієнтований, сплутана мова", points: 4 },
                    { text: "Невідповідні слова", points: 3 },
                    { text: "Незрозумілі звуки", points: 2 },
                    { text: "Відсутня", points: 1 }
                ]
            },
            {
                title: "Рухова активність",
                options: [
                    { text: "Виконує команди", points: 6 },
                    { text: "Локалізує біль", points: 5 },
                    { text: "Відсмикування на біль", points: 4 },
                    { text: "Патологічне згинання", points: 3 },
                    { text: "Патологічне розгинання", points: 2 },
                    { text: "Відсутня", points: 1 }
                ]
            }
        ]
    },
    {
        id: "qsofa",
        name: "qSOFA (Сепсис)",
        groups: [
            {
                title: "Критерії (по 1 балу)",
                type: "checkbox",
                options: [
                    { text: "ЧД >= 22/хв", points: 1 },
                    { text: "Порушення свідомості (GCS < 15)", points: 1 },
                    { text: "Систолічний АТ <= 100 мм рт.ст.", points: 1 }
                ]
            }
        ]
    },
    {
        id: "apgar",
        name: "Шкала Апгар",
        groups: [
            {
                title: "Колір шкіри",
                options: [
                    { text: "Рожевий", points: 2 },
                    { text: "Акроціаноз", points: 1 },
                    { text: "Ціаноз/блідість", points: 0 }
                ]
            },
            {
                title: "ЧСС",
                options: [
                    { text: "> 100/хв", points: 2 },
                    { text: "< 100/хв", points: 1 },
                    { text: "Відсутня", points: 0 }
                ]
            },
            {
                title: "Рефлекси",
                options: [
                    { text: "Гримаса + крик", points: 2 },
                    { text: "Гримаса", points: 1 },
                    { text: "Відсутня", points: 0 }
                ]
            },
            {
                title: "М'язовий тонус",
                options: [
                    { text: "Активні рухи", points: 2 },
                    { text: "Згинання кінцівок", points: 1 },
                    { text: "Млявий", points: 0 }
                ]
            },
            {
                title: "Дихання",
                options: [
                    { text: "Гучний крик", points: 2 },
                    { text: "Слабке/нерегулярне", points: 1 },
                    { text: "Відсутнє", points: 0 }
                ]
            }
        ]
    }
];
