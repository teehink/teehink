
let id = 0

/* ------------ CHARACTERS -------------*/

class Character {
    constructor(name, level) {
        let myCharacter = {
            name, 
            level, 
            id, 
            hitpoints: level * 4, 
            maxHitpoints: level * 4, 
            inventory: []
        }
        Object.assign(this, myCharacter)
        id++

    }

    attack(target) {
        let updatedHitpoints = target.hitpoints - this.level
        target.updateHitpoints(updatedHitpoints)
    }

    pickup(item) {
        this.inventory.push(item)
    }

    drop(droppedItem) {
        let inventory = []
        for (let item of this.inventory)  {
            if (droppedItem.id != item.id) {
                inventory.push(item)
            }
        }
        this.inventory = inventory
    }

    levelUp() {
        this.level++
        this.maxHitpoints = this.level * 4
        this.hitpoints = this.maxHitpoints
        
    }

    updateHitpoints(newHitpoints) {
        this.hitpoints = newHitpoints

        let { id, hitpoints, maxHitpoints } = this

        const domHitpoints = document.getElementById(`character-${id}-hitpoints`)
        domHitpoints.innerHTML = `HP: ${hitpoints} / ${maxHitpoints}`
    }

    domElement() {
        const domElement = document.getElementById(`character-${this.id}`)
        if (domElement) {
            return domElement
        }
    }

    initializeInventory() {
        for (let item of this.inventory) {
            item.domElement().onclick = () => {
                let updatedHitpoints = this.hitpoints + item.restores
                this.updateHitpoints(updatedHitpoints)
                this.drop(item)
                let domInventory = document.getElementById(`character-${this.id}-inventory`)
                domInventory.innerHTML = this.getInventoryView()
                this.initializeInventory()
            }
        }
    }

    getInventoryView() {
        let inventoryView = ``
        
        for (let item of this.inventory) {
            inventoryView += item.view()
        }
        return inventoryView
    }

    view(details = '') {

        let { name, level, id, hitpoints, maxHitpoints} = this

        return `<div class = "character" id = "character-${id}"> 
        <div> ${name} </div>
        <div> Lvl: ${level} </div>
        <div id = "character-${id}-hitpoints">
            HP: ${hitpoints} / ${maxHitpoints}
        </div>
        <div class = "inventory" id = "character-${id}-inventory">
            ${this.getInventoryView()}
        </div>    
        <div>${details} </div>
        </div>`
    }
}

class Wizard extends Character {
    constructor(name, level) {
        super(`${name} 🧙🏽‍♀️`, level)
        this.mana = level * 4
    }

    levelUp() {
        super.levelUp()
        this.mana += 4
    }

    restore() {
        this.updateMana(this.mana + 1)
    }

    updateMana(newMana) {
        this.mana = newMana
        document.getElementById(`character-${this.id}-mana`).innerHTML = `Mana: ${this.mana}`
    }

    prepareForBattle() {
        document.getElementById(`character-${this.id}-restore`).onclick = () => {
            this.restore()
        }
    }

    attack(target) {
        let damage = Math.floor((Math.random() * (this.mana * 1.5)) + 1)
        let updatedHitpoints = target.hitpoints - damage
        console.log(damage)
        target.updateHitpoints(updatedHitpoints)
        this.updateMana(this.mana - 2)

    }

    view() {
        return super.view(`
        <div id = "character-${this.id}-mana"> Mana: ${this.mana}</div>
        <button id = "character-${this.id}-restore"> Restore </button>
        `)
    }

}

class Archer extends Character {
    constructor(name, level) {
        super(`${name} 🏹'`, level)
        this.arrows = level * 3
    }

    levelUp() {
        super.levelUp()
        this.arrows += 4
    }

    reload() {
        this.updateArrows(this.arrows + 1)
    }

    updateArrows(newArrows) {
        this.arrows = newArrows
        document.getElementById(`character-${this.id}-arrows`).innerHTML = `Arrows: ${this.arrows}`
    }

    prepareForBattle() {
        document.getElementById(`character-${this.id}-reload`).onclick = () => {
            this.reload()
        }
    }

    attack(target) {
        super.attack(target)
        this.updateArrows(this.arrows - 1)

    }

    view() {
        return super.view(`
        <div id = "character-${this.id}-arrows"> Arrows: ${this.arrows}</div>
        <button id = "character-${this.id}-reload"> Reload </button>
        `)
    }
}

class Warrior extends Character {
    constructor(name, level) {
        super(`${name} ⚔️`, level)
        this.strength = level * 2
    }

    levelUp() {
        super.levelUp()
        this.strength = this.level * 2
    }

    charge() {
        this.updateStrength(this.strength + 1)
    }

    updateStrength(newStrength) {
        this.strength = newStrength
        document.getElementById(`character-${this.id}-strength`).innerHTML =  `Strength: ${this.strength}`
    }

    prepareForBattle() {
        document.getElementById(`character-${this.id}-charge`).onclick = () => {
            this.charge()
        }
    }

    attack(target) {
        let damage = Math.floor( ( Math.random() * (this.level + this.strength) ) + 1 )
        let updatedHitpoints = target.hitpoints - damage
        console.log(damage)
        target.updateHitpoints(updatedHitpoints)
        this.updateStrength(this.strength - 1)

    }

    view() {
        return super.view(`
        <div id = "character-${this.id}-strength">Strength: ${this.strength}</div>
        <button id = "character-${this.id}-charge"> Charge </button>
        `)
    }
}



/* ------------ ENEMIES -------------*/


class Spider extends Character {
    constructor(level) {
        super(`Spider🕷`, level)
    }
    
    attack(target) {
        this.bite(target)
    }

    bite(target) {
        let updatedHitpoints = target.hitpoints - (target.maxHitpoints * 0.125)
        target.updateHitpoints(updatedHitpoints)
     }
}

class Scorpion extends Character {
    constructor(level) {
        super(`Scorpion🦂`, level)
    }

    attack(target) {
        this.sting(target)
    }
    
    sting(target) { 
        let damage = target.maxHitpoints * 0.25
        target.updateHitpoints(target.hitpoints - damage)
    }
}

class Croc extends Character {
    constructor(level) {
        super('Croc 🐊', level)
    }

    attack(target) {
        this.deathRoll(target)
    }

    deathRoll(target) {
        let damage = Math.floor(Math.random() * target.maxHitpoints)
        let updatedHitpoints = target.hitpoints - damage
        target.updateHitpoints(updatedHitpoints)
    }
}

class Dragon extends Character {
    constructor(level) {
        super(`Dragon🐉`, level)
    }
    
    attack(target) {
        this.fireBreath(target)
    }

    fireBreath(target) {
        let damage = target.maxHitpoints * 0.5
        target.updateHitpoints(target.hitpoints - damage)
    }
}


/* ---------- FOOD -------------*/

class Food {
    constructor(name, restores) {
        let myFood = { name, restores, id }
        id++
        Object.assign(this, myFood)
        //this.name = name
        //this.restores = restores
        //this.id = id++
    }

    domElement() {
        const domElement = document.getElementById(`food-${this.id}`)
        if (domElement) {
            return domElement
        }
    }

    view() {
        return `<div class="food" id="food-${this.id}"> 
        ${this.name} 
        </div>`
    }
}

//class Bacon extends Food {
  //  constructor(name, restores) {
    //    super(name, restores)
    //    this.restores = restores * 1.5
    //   this.id = id++
    //}
    //view() {
    //    return `<div class="food" id="food-${this.id}">
    //        ${this.name}
    //    </div>`
    //}
//}

/* ---------- GAMEPLAY -------------*/


const croissant = new Food("🥐", 3)
const taco = new Food("🌮", 5)
const bacon = new Food("🥓", 8)
const pizza = new Food("🍕", 10)


const heloise = new Wizard("Heloise", 2)
const jimbo = new Warrior("Jimbo", 1)
const pim = new Archer("Pim", 3)

const spider = new Spider(1)
const scorpion = new Scorpion(4)
const croc = new Croc(7) 
const dragon = new Dragon(10)



class Dungeon {
    constructor(hero, enemies) {
        let [ currentEnemy, ...remainingEnemies ] = enemies
        Object.assign(this, {hero, currentEnemy, remainingEnemies })
    }

    start() {
        this.startBattle()
    }

    next() {
        let [ currentEnemy, ...remainingEnemies ] = this.remainingEnemies
        Object.assign(this, {currentEnemy, remainingEnemies})
        if (remainingEnemies.length == 0) {
            this.hero.pickup(currentEnemy)
            this.end()
        } else {
            this.startBattle()
        }

    }

    startBattle() {
        let { hero, currentEnemy } = this
        document.body.innerHTML = `
            ${hero.view()}
            <button id = "attack-button"> Attack </button>
            ${currentEnemy.view()}
        `
        hero.initializeInventory()
        hero.prepareForBattle()
        document.getElementById("attack-button").onclick = () => {
            hero.attack(currentEnemy)
    
            if (isKnockedOut(currentEnemy)) {
                this.endBattle(hero)
            } else if (isKnockedOut(hero)) {
                this.dead(hero)
            } else {
                currentEnemy.attack(hero)
            }
        }
    }


    endBattle() {
        let { hero } = this
        if (!isKnockedOut(hero)) {
            hero.levelUp()
        }
    
        document.body.innerHTML = `
            ${hero.view()}
            <button id = "next-battle">Start Next Battle</button>
        `
        document.getElementById("next-battle").onclick = () => {
            this.next()
        }
    }

    dead() {
        document.body.innerHTML = `
        ${this.hero.view()} 
        <h2> YOU HAVE BEEN DEADED </h2>
        <button id = "start-over"> Start Over </button>
        `
        document.getElementById("start-over").onclick = () => {
            this.hero.hitpoints = 
            newDungeon.start()
        }
        
    }

    end() {
        document.body.innerHTML =  `
        ${this.hero.view()}
        <h2>You won. That's all. Go home.</h2>
        `  
    }

}



const isKnockedOut = (character) => character.hitpoints <= 0
// non-arrow function for reference

//function isKnockedOut(character) {
 //   if (character.hitpoints <= 0) {
 //       return true
 //   } else {
 //       return false
 //   }
//}



heloise.pickup(croissant)
heloise.pickup(pizza)
heloise.pickup(bacon)

jimbo.pickup(croissant)
jimbo.pickup(pizza)
jimbo.pickup(bacon)

let newDungeon = new Dungeon(jimbo,  [
    new Spider(1),
    new Spider(2),
    new Spider(2),
    new Scorpion(3),
    new Scorpion(5),
    new Croc(7),
    new Dragon(10),
    new Food("🍯", 20)
])


newDungeon.start()

//startBattle(heloise, scorpion)


