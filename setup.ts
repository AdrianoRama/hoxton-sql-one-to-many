import Database from 'better-sqlite3'

const db = new Database('./data.db', {
    verbose: console.log
})

const museums = [
    {
        name: "Smithsonian Institution",
        city: "Washington, D.C"
    },
    {
        name: "Le Louvre",
        city: "Paris"
    },
    {
        name: "The Acropolis Museum",
        city: "Athens"
    },
    {
        name: "State Hermitage",
        city: "St. Petersburg"
    },
    {
        name: "The British Museum",
        city: "London"
    }
]

const works = [
    {
        name: "Benjamin West: Helen Brought to Paris",
        image: "https://cdn.britannica.com/08/136408-050-847BC55E/Paris-oil-Helen-canvas-Benjamin-West-Washington-1776.jpg",
        museumId: 1
    },
    {
        name: "Edmonia Lewis: Hagar",
        image: "https://cdn.britannica.com/93/2093-004-21AB275C/Hagar-marble-sculpture-Edmonia-Lewis-Washington-DC-1875.jpg",
        museumId: 1
    },
    {
        name: "Mona Lisa",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/1200px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
        museumId: 2
    },
    {
        name: "The Wedding Feast at Cana",
        image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Paolo_Veronese_008.jpg",
        museumId: 2
    },
    {
        name: "Woman with a Mirror",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Portrait_d%27une_Femme_%C3%A0_sa_Toilette%2C_by_Titian%2C_from_C2RMF_retouched.jpg/1200px-Portrait_d%27une_Femme_%C3%A0_sa_Toilette%2C_by_Titian%2C_from_C2RMF_retouched.jpg",
        museumId: 2
    },
    {
        name: "Loutrophoros",
        image: "https://www.theacropolismuseum.gr/sites/default/files/exhibits_images/8140_1.jpg",
        museumId: 3
    },
    {
        name: "Parthenon. West pediment. Kekrops and Pandrosos",
        image: "https://www.theacropolismuseum.gr/sites/default/files/2020-12/10519_1.jpg",
        museumId: 3
    },
    {
        name: "Cottages",
        image: "https://www.hermitagemuseum.org/wps/wcm/connect/810064e0-10dc-4f20-ad94-afaa996bf59a/WOA_IMAGE_1.jpg",
        museumId: 4
    },
    {
        name: "Portrait of the Actress Antonia Zarate",
        image: "https://www.hermitagemuseum.org/wps/wcm/connect/588d63f3-b147-401d-be2c-b0d135ae504f/WOA_IMAGE_1.jpg",
        museumId: 4
    },
    {
        name: "The Rosetta stone",
        image: "https://reach.ieee.org/wp-content/uploads/2016/11/The-Rosetta-Stone.jpg",
        museumId: 4
    }
]

const dropMuseums = db.prepare(`DROP TABLE IF EXISTS museums`)
const dropWorks = db.prepare(`DROP TABLE IF EXISTS works`)
dropMuseums.run()
dropWorks.run()

const createMuseums = db.prepare(`
CREATE TABLE museums (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL
);
`)

const createWorks = db.prepare(`
CREATE TABLE works (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT NOT NULL,
    museumId INTEGER NOT NULL,
    FOREIGN KEY(museumId) REFERENCES museums(id)
);
`)

createMuseums.run()
createWorks.run()

const createMuseum = db.prepare(`
INSERT INTO museums (name, city) VALUES (?, ?);
`)

const createWork = db.prepare(`
INSERT INTO works (name, image, museumId) VALUES (?, ?, ?);
`)

for (const museum of museums) {
    createMuseum.run(museum.name, museum.city)
}

for (const work of works) {
    createWork.run(work.name, work.image, work.museumId)
}