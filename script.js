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
                    // Kategorie-Namen anpassen für die Anzeige
                    let displayName = categoryKey;
                    switch(categoryKey) {
                        case 'stimmung': displayName = 'Stimmung'; break;
                        case 'energie': displayName = 'Energie'; break;
                        case 'fokus': displayName = 'Fokus'; break;
                        case 'gesundheit': displayName = 'Gesundheit'; break;
                        case 'stundenGeschlafen': displayName = 'Stunden geschlafen'; break;
                        case 'ansprechen': displayName = 'Ansprechen'; break;
                        default: displayName = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1); // Standard: Ersten Buchstaben groß
                    }
                    title.textContent = displayName;

                    const currentValue = document.createElement('p');
                    currentValue.classList.add('status-value');
                    let valueText = '';

                    if (categoryKey === 'stundenGeschlafen') {
                        valueText = `<strong>Aktuell:</strong> ${categoryData.wert} Stunden`;
                    } else if (categoryKey === 'ansprechen') {
                        // Spezielle Klasse für Ja/Nein zur möglichen Farbgebung
                        currentValue.classList.add(`ansprechen-${categoryData.wert.toLowerCase()}`);
                        valueText = `<strong>Aktuell:</strong> ${categoryData.wert}`;
                    }
                    else {
                        currentValue.classList.add(`status-level-${categoryData.wert.toLowerCase().replace(/ /g, '-')}`); // Z.B. "gut" -> "status-level-gut"
                        valueText = `<strong>Aktuell:</strong> ${categoryData.wert}`;
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
                second: '2-digit', // Auch Sekunden anzeigen für Genauigkeit
                hour12: false // 24-Stunden-Format
            };
            const updatedDate = new Date(data.lastUpdated).toLocaleString('de-DE', dateOptions);
            lastUpdatedDisplay.textContent = `Zuletzt aktualisiert: ${updatedDate} Uhr`;

        })
        .catch(error => {
            console.error('Fehler beim Laden des Status:', error);
            document.getElementById('status-display').innerHTML = '<p class="error-message">Konnte Status nicht laden. Bitte versuche es später erneut.</p>';
        });
});