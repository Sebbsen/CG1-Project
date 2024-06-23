

export class GameManager {
    constructor(gameObjects) {
        this.gameObjects = gameObjects;
        this.inventory = [];
    }

    addToInventory(item) {
        this.inventory.push(item);
        document.getElementById("item_" + item.id).style.display = "block";
        console.log(this.inventory);
        console.log("INVENTORY: ", this.inventory.map(item => item.name));
    }
    
    removeFromInventory(item) {
        const index = this.inventory.indexOf(item);
        if (index > -1) {
            this.inventory.splice(index, 1);
        }
        console.log(this.inventory);
    }

    inventoryContains(itemName) {
        return this.inventory.some(inventoryItem => inventoryItem.name === itemName);
    }

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

    getInventory() {
        return this.inventory;
    }

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

    handleLaptopClick(pickedObj) {
        let LaptopDisplay = this.gameObjects.find(obj => obj.name === "LaptopDisplay")

        LaptopDisplay.videoSrc.play();
    }

}