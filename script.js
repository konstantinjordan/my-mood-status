document.addEventListener('DOMContentLoaded', () => {
    // Fügen Sie einen Cache-Buster hinzu, um sicherzustellen, dass immer die neueste Version von status.json geladen wird.
    // GitHub Pages kann manchmal ältere Versionen ausliefern, ohne diesen Trick.
    fetch('status.json?' + new Date().getTime())
        .then(response => {
            // Überprüfen, ob die Antwort erfolgreich war (Status 200 OK)
            if (!response.ok) {
                throw new Error(`HTTP-Fehler! Status: ${response.status}`);
            }
            return response.json(); // Antwort als JSON parsen
        })
        .then(data => {
            const statusDisplay = document.getElementById('status-display');
            statusDisplay.innerHTML = ''; // Lade-Nachricht entfernen

            // Dynamische Reihenfolge der Kategorien zur Anzeige
            const categoriesOrder = [
                'stimmung', 'energie', 'fokus', 'gesundheit',
                'stundenGeschlafen', 'ansprechen'
            ];

            categoriesOrder.forEach(categoryKey => {
                if (data.hasOwnProperty(categoryKey)) { // Prüfen, ob die Kategorie existiert
                    const categoryData = data[categoryKey];

                    const categoryDiv = document.createElement('div');
                    categoryDiv.classList.add('status-category');

                    const title = document.createElement('h2');
                    let displayName = categoryKey;
                    let emoji = ''; // Standard-Emoji
                    switch(categoryKey) {
                        case 'stimmung': displayName = 'Stimmung'; emoji = '😊'; break;
                        case 'energie': displayName = 'Energie'; emoji = '⚡'; break;
                        case 'fokus': displayName = 'Fokus'; emoji = '🎯'; break;
                        case 'gesundheit': displayName = 'Gesundheit'; emoji = '❤️‍🩹'; break;
                        case 'stundenGeschlafen': displayName = 'Stunden geschlafen'; emoji = '😴'; break;
                        case 'ansprechen': displayName = 'Ansprechen'; emoji = '💬'; break;
                        default: displayName = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
                    }
                    title.textContent = `${displayName} ${emoji}`; // Emoji zum Titel hinzufügen

                    const currentValue = document.createElement('p');
                    currentValue.classList.add('status-value');
                    let valueText = '';

                    if (categoryKey === 'stundenGeschlafen') {
                        valueText = `<strong>Aktuell:</strong> ${categoryData.wert} Stunden`;
                    } else if (categoryKey === 'ansprechen') {
                        currentValue.classList.add(`ansprechen-${categoryData.wert.toLowerCase()}`);
                        let ansprechenEmoji = (categoryData.wert.toLowerCase() === 'ja') ? '✅' : '❌';
                        valueText = `<strong>Aktuell:</strong> ${categoryData.wert} ${ansprechenEmoji}`;
                    }
                    else {
                        // Dynamisches Emoji für Stimmung/Energie/Fokus/Gesundheit basierend auf dem Wert
                        let statusEmoji = '';
                        const lowerWert = categoryData.wert.toLowerCase();
                        if (lowerWert.includes('gut') || lowerWert.includes('hoch') || lowerWert.includes('scharf') || lowerWert.includes('top')) {
                            statusEmoji = '🟢'; // Grün für positiv
                        } else if (lowerWert.includes('mittel') || lowerWert.includes('okay') || lowerWert.includes('neutral') || lowerWert.includes('angeschlagen')) {
                            statusEmoji = '🟡'; // Gelb für neutral/mittel
                        } else if (lowerWert.includes('schlecht') || lowerWert.includes('niedrig') || lowerWert.includes('zerstreut') || lowerWert.includes('krank')) {
                            statusEmoji = '🔴'; // Rot für negativ
                        }
                        currentValue.classList.add(`status-level-${lowerWert.replace(/ /g, '-')}`);
                        valueText = `<strong>Aktuell:</strong> ${categoryData.wert} ${statusEmoji}`;
                    }
                    currentValue.innerHTML = valueText;


                    categoryDiv.appendChild(title);
                    categoryDiv.appendChild(currentValue);

                    // Nur Beschreibung hinzufügen, wenn vorhanden und nicht bei "Stunden geschlafen"
                    if (categoryData.beschreibung && categoryKey !== 'stundenGeschlafen') {
                        const description = document.createElement('p');
                        description.classList.add('status-description');
                        description.textContent = categoryData.beschreibung;
                        categoryDiv.appendChild(description);
                    }
                    statusDisplay.appendChild(categoryDiv);
                }
            });

            // Letzte Aktualisierung anzeigen
            const lastUpdatedDisplay = document.getElementById('last-updated-display');
            const dateOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            const updatedDate = new Date(data.lastUpdated).toLocaleString('de-DE', dateOptions);
            lastUpdatedDisplay.textContent = `Zuletzt aktualisiert: ${updatedDate} Uhr 🕒`; // Emoji zum Zeitstempel hinzufügen

        })
        .catch(error => {
            console.error('Fehler beim Laden des Status:', error);
            document.getElementById('status-display').innerHTML = '<p class="error-message">Konnte Status nicht laden. Bitte versuche es später erneut. 😞</p>';
        });
});