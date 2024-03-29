const fs = require('fs-extra');
const readSync = require('readline-sync');
const path = require('path');
const uuid = require('uuid');

const MainEnvironment = "."
const uuidRP = uuid.v4()
const uuidBP = uuid.v4()

const arg = process.argv.slice(2)

// console.log(arg)

var name = arg[0]
var author = arg[1]
var description = arg[2]

let items = fs.readdirSync(MainEnvironment)
let copys = items.reduce((i, element) => (element.startsWith(name) ? i + 1 : i), 0)
name = name + (copys > 0 ? ` (${copys})` : "")


// var name = readSync.question(`name ("New Addon"): `)
// name = name === "" ? "New Addon" : name

// let items = fs.readdirSync(MainEnvironment)
// let copys = items.reduce((i, element) => (element.startsWith(name) ? i + 1 : i), 0)
// name = name + (copys > 0 ? ` (${copys})` : "")

// var author = readSync.question(`author ("${name} Author"): `)
// author = author === "" ? `${name} Author` : author

// var description = readSync.question(`description: `)


var addon = {
    RP: {
            format_version: 2,
            metadata: {
                authors: [author],
                generated_with: { ChOnpiler: ["1.0.0", "https://github.com/kkericm/ChOnpiler"] }
            },
            header: {
                name: name,
                description: description,
                min_engine_version: [ 1, 20, 0 ],
                uuid: uuidRP,
                version: [ 1, 0, 0 ]
            },
            modules: [
                {
                type: 'resources',
                uuid: uuid.v4(),
                version: [1, 0, 0]
                }
            ],
            dependencies: [
                { uuid: uuidBP, version: [1, 0, 0] }
            ]
    },
    BP: {
            format_version: 2,
            metadata: {
                authors: [author],
                generated_with: { ChOnpiler: ["1.0.0", "https://github.com/kkericm/ChOnpiler"] }
            },
            header: {
                name: name,
                description: description,
                min_engine_version: [ 1, 20, 0 ],
                uuid: uuidBP,
                version: [ 1, 0, 0 ]
            },
            modules: [
                {
                    type: 'data',
                    uuid: uuid.v4(),
                    version: [1, 0, 0]
                },
                {
                    type: 'script',
                    language: 'javascript',
                    uuid: uuid.v4(),
                    entry: 'scripts/entry.js',
                    version: [1, 0, 0]
                }
            ],
            dependencies: [
                { uuid: uuidRP, version: [1, 0, 0] },
                { module_name: '@minecraft/server', version: '1.7.0' }
            ]
    }
}
fs.mkdirSync(name)

fs.copy('../compiler/c/compiler.exe', path.join(name, "update.exe"))

fs.mkdirSync(path.join(name, "dist"))

fs.mkdirSync(path.join(name, "BP"))
fs.writeFileSync(path.join(name, 'BP', "manifest.json"), JSON.stringify(addon.BP, undefined, 4), { encoding: "utf-8" })
fs.mkdirSync(path.join(name, "BP", "scripts"))
fs.writeFileSync(path.join(name, 'BP', "scripts", "entry.js"), "")

fs.mkdirSync(path.join(name, "RP"))
fs.writeFileSync(path.join(name, 'RP', "manifest.json"), JSON.stringify(addon.RP, undefined, 4), { encoding: "utf-8" })
fs.mkdirSync(path.join(name, "RP", "texts"))
fs.writeFileSync(path.join(name, 'RP', "texts", "en_US.lang"), "")
fs.writeFileSync(path.join(name, 'RP', "texts", "languages.json"), `["en_US"]`)

const config = {
    name: name,
    tsConfig: {
        compilerOptions: {
            target: "es2016",
            module: "ES2022",
            esModuleInterop: true,
            forceConsistentCasingInFileNames: true,
            strict: true,
            skipLibCheck: true
        },
        include: [
            "./scripts/**/*.ts"
        ],
        exclude: []
    }
}

fs.writeFileSync(path.join(name, "config.json"), JSON.stringify(config, undefined, 4))