const cds = require('@sap/cds');
//const { SELECT, INSERT } = require('@sap/cds/lib/ql/cds-ql');

module.exports = cds.service.impl(async function () {
    const bpSrv = await cds.connect.to('BusinessPartner');
    this.on('READ','BusinessPartner',async (req)=> {
        return bpSrv.run(req.query);
    })
})
