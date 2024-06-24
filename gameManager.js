

// Die Klasse verwaltet die Spielobjekte und das Inventar
// Sie ermöglicht das Aufheben, Verwenden und Animieren von Objekten im Spiel
export class GameManager {
    constructor(gameObjects) {
        this.gameObjects = gameObjects;
        this.inventory = [];
    }

    // Fügt ein Objekt dem Inventar hinzu
    addToInventory(item) {
        this.inventory.push(item);
        document.getElementById("item_" + item.id).style.display = "block";
        console.log(this.inventory);
        console.log("INVENTORY: ", this.inventory.map(item => item.name));
    }
    
    // Entfernt ein Objekt aus dem Inventar
    removeFromInventory(item) {
        const index = this.inventory.indexOf(item);
        if (index > -1) {
            this.inventory.splice(index, 1);
        }
        console.log(this.inventory);
    }

    // Überprüft, ob ein bestimmtes Objekt im Inventar ist
    inventoryContains(itemName) {
        return this.inventory.some(inventoryItem => inventoryItem.name === itemName);
    }

    // Überprüft ggf., ob ein bestimmtes Objekt im Inventar ist und gibt zurück, ob es benutzbar ist 
    tryToUseItem(item) {
        if (!item.needsItem) {
            return true;
        }
        if (this.inventoryContains(item.needsItem)) {
            this.removeFromInventory(item);
            return true;
        } else {
            return false;
        }
    }

    // Gibt das Inventar zurück
    getInventory() {
        return this.inventory;
    }

    // Kümmert sich um das Verhalten, wenn ein Object aufgehoben wird
    handlePickedObject(pickedObj) {
        
        if (pickedObj.pickable.type === "collectable") {
            this.addToInventory(pickedObj);
            return true;
        } else if (pickedObj.pickable.type === "useable") {
            if (this.tryToUseItem(pickedObj.pickable)) {
                if (["DrawerRightUpper", "DrawerRightLower"].includes(pickedObj.name)) {
                    this.handleDrawerAnimation(pickedObj)
                } else if (["DrawerLeft"].includes(pickedObj.name)) {
                    this.handleDrawerAnimation(pickedObj, true)
                } else if (["LaptopDisplay", "Laptop"].includes(pickedObj.name)) {
                    this.handleLaptopClick(pickedObj)
                }
            }
            return this.tryToUseItem(pickedObj.pickable);
        }
        return false;
    }

    // Kümmert sich um die Schubladen animation + ggf. Note animation
    handleDrawerAnimation(pickedObj, hasNote) {
        const startPos = pickedObj.translation;
        let endPos = startPos;
        if(pickedObj.isOpen) {
            endPos = [0, 0, 0];
            pickedObj.isOpen = false;
        } else {
            endPos = [0, 0, 3];
            pickedObj.isOpen = true;
        }
        pickedObj.animateTranslation(startPos, endPos, 500);
        
        if (hasNote) {
            let passwordObject = this.gameObjects.find(obj => obj.name === "Password")
            if (passwordObject) {
                passwordObject.animateTranslation(startPos, endPos, 500);
            }
        }
    }

    // Kümmert sich darum, was pasiert, wenn der Laptop angeklickt wird
    handleLaptopClick(pickedObj) {
        let LaptopDisplay = this.gameObjects.find(obj => obj.name === "LaptopDisplay")

        LaptopDisplay.videoSrc.play();
    }

}