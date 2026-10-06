const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {

    const bpAPI = await cds.connect.to('BusinessPartner');
    const db = await cds.connect.to('db');
    console.log("DB Kind =", db.kind);
    const { BusinessPartner: BpEntity } = bpAPI.entities;
    const { BusinessPartnerExt } = cds.entities('db.schema');
    this.on('syncBP', async req => {
        const tx = cds.transaction(req);

        let bpData = await bpAPI.run(
            SELECT.from(BpEntity)
                .columns(
                    'ID',
                    'businessPartnerNumber',
                    'vendorCode',
                    'customerCode',
                    'businessPartnerName1'
                )
                .limit(50)
        );
        //console.log('array',bpData);
        const bpArray = bpData.value || bpData || [];
        let records = bpArray.map(bp => ({
            ID: bp.ID,
            businessPartnerNumber: bp.businessPartnerNumber,
            vendorCode: bp.vendorCode,
            customerCode: bp.customerCode,
            businessPartnerName1: bp.businessPartnerName1,

            // Custom logic
            region: 'East India',
            riskCategory: bp.customerCode == null ? 'High' : 'Low'
        }));

        await db.run(
            UPSERT.into('BusinessPartnerExt')
                .entries(records)
        );

        return {
            db: db.kind,
            status: 'Success',
            records: records.length,
            results: records
        };
    });
});