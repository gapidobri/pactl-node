const { execSync } = require('child_process')

const info = () => {
    const output = execSync('pactl info').toString()
    const infoRaw = output.trim().split('\n')
    const info = infoRaw.map(info => info.split(': '))
    const infoObj = new Object()
    info.forEach(info => {
        let key = info[0].replaceAll(' ', '_').toLowerCase()
        let value = !isNaN(info[1]) ? parseInt(info[1]) : info[1]
        infoObj[key] = value
    })
    return infoObj
}

const listShort = (type) => {
    const output = execSync(`pactl list short ${type}`).toString()
    const raw = output.trim().split('\n')
    const modules = raw.map(sink => {
        let moduleData = sink.split('\t')
        return {
            id: Number.parseInt(moduleData[0]),
            name: moduleData[1],
            driver: moduleData[2],
            sample: moduleData[3],
            state: moduleData[4],
        }
    })
    return modules
}

const list = (type) => {
    const output = execSync(`pactl list ${type}`).toString()
    const sinksRaw = output.trim().split('\n')
    let sinkCount = 0
    let sinks = []
    let prevKey = null
    sinksRaw.forEach(line => {
        if (!line.startsWith('\t')) {
            sinkCount++
            sinks.push(new Object())
            prevKey = null
        } else {
            if (!line.includes(': ')) {
                let prevVal = sinks[sinkCount - 1][prevKey]
                sinks[sinkCount - 1][prevKey] = `${prevVal} ${line.trim()}`
                return
            }
            let prop = line.split(': ')
            if (prop.length > 1) {
                let key = prop[0].trim().replace(' ', '_').toLowerCase()
                let value = prop[1].trim()
                sinks[sinkCount - 1][key] = value
                prevKey = key
            } else {}
        }
    })
    return sinks
}

const loadModule = (moduleName, args) => {
    const output = execSync(`pactl load-module ${moduleName} ${toStringArgs(args)}`).toString()
    return parseInt(output)
}

const unloadModule = (id) => {
    execSync(`pactl unload-module ${id}`).toString()
}

const toStringArgs = (obj) => {
    let args = []
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            args.push(`${key}=${obj[key]}`)
        }
    }
    return args.join(' ')
}

module.exports = {
    info: info,
    listShort: listShort,
    list: list,
    loadModule: loadModule,
    unloadModule: unloadModule
}