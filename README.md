# CG1-Project

## Gruppenmitglieder
- Sebastian Gremm
- Nele Schulze
- Ole Dierking
- Linus Parbel

## Bedienung
1. index.html im Browser öffnen (Live Server)
2. Warten (Die Modelle, Texturen und Shader brauchen etwas Zeit)
3. Mit der Maus in das Fenster klicken, jetzt kann die Kamera bewegt werden

## Demoszene
### Verwendete Techniken
- Phong Beleuchtung
- 2 Pointlights
- Verwendung mehrerer Texturen auf mehreren Objekten
- Videotextur
- Transparenz mit Tiefensortierung
- Umgebungstextur und Spiegelung auf einem Objekt
- Translation, Rotation und theoretisch Skalierung (nicht in der Demoszene, aber in der Sonnensystemszene)
- Animationen (bspw. Schubladen)
- Interaktionen mit Objekten (bspw. Schubladen)
    - Interaktion per Mausklick während das Objekt angeschaut wird
- Kamerasteuerung mit der Maus und Tastatur (WASD + Space + f)
- Szenengraph (hierarchische Struktur mit Transformationsvererbung)
    - Gruppen (können Gruppen und Objekte enthalten, geben Transformationen an ihre Kinder weiter)
    - Objekte
- Aufteilung in unterschiedliche Shaderprogramme
    - Default: einfaches Phong-Shading
    - Einfache Textur: Verwendung einzelner Textur
    - Multitextur: Verwendung von Farb-, Normalen und Roughnesstextur
    - Transparent: Phong-Shading mit Transparenz
- Nebel
- Laden von OBJ Modellen

## Quellen
- [Skybox](https://polyhaven.com/a/kloppenheim_03)
- [Video](https://pixabay.com/users/engin_akyurt-3656355/?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=91069) von Engin Akyurt bei Pixabay [Link](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=91069)