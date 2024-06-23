export class GameManager {
    constructor() {
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
                if (["DrawerLeft", "DrawerRightUpper", "DrawerRightLower"].includes(pickedObj.name)) {
                    this.handleDrawerAnimation(pickedObj)
                } else if (["LaptopDisplay", "Laptop"].includes(pickedObj.name)) {
                    this.handleLaptopClick(pickedObj)
                }
            }
            return this.tryToUseItem(pickedObj.pickable);
        }
        return false;
    }

    handleDrawerAnimation(pickedObj) {
        const startPos = pickedObj.translation;
        let endPos = startPos;
        if(pickedObj.isOpen) {
            endPos = [startPos[0], startPos[1], startPos[2]-3];
            pickedObj.isOpen = false;
        } else {
            endPos = [startPos[0], startPos[1], startPos[2]+3];
            pickedObj.isOpen = true;
        }
        pickedObj.animateTranslation(startPos, endPos, 500);
    }

    handleLaptopClick(pickedObj) {
        alert('WOW! GEWONNEN!');
    }

}