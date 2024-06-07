export class GameManager {
    constructor() {
        this.inventory = [];
    }

    addToInventory(item) {
        this.inventory.push(item);
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
        if (this.inventoryContains(item.needsItem)) {
            this.removeFromInventory(item);
            return true;
        }
        return false;
    }

    getInventory() {
        return this.inventory;
    }

    handlePickedObject(object) {
        if (object.pickable.type === "collectable") {
            this.addToInventory(object);
            return true;
        } else if (object.pickable.type === "useable") {
            return this.tryToUseItem(object.pickable);
        }
        return false;
    }

}