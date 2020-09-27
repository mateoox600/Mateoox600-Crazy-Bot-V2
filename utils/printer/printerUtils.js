
const printerNames = {
    base: {
        name: 'Basic Printer',
        storage: {
            min: 10000,
            max: 17500
        },
        gain: {
            min: 10,
            max: 35
        }
    },
    advanced: {
        name: 'Advanced Printer',
        storage: {
            min: 17500,
            max: 25000
        },
        gain: {
            min: 35,
            max: 75
        }
    }
}

function getPrinterName(storage, gain){
    var result = 'NONE';
    Object.values(printerNames).forEach(printerName => {
        if((storage >= printerName.storage.min && storage < printerName.storage.max) && (gain >= printerName.gain.min && gain < printerName.gain.max)) {
            result = printerName.name;
            return;
        }
    });
    return (result);
}

module.exports = {
    
    createPrinter: (casing, printer) => {
        const printerName = getPrinterName(casing.storage, printer.gain);
        return  {
            "name": printerName,
            "maxStorage": casing.storage,
            "money": 0,
            "gain": printer.gain,
            "level": 1
        };
    }

}