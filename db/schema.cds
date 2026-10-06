namespace db.schema;

entity BusinessPartnerExt{
        key  ID: UUID;
        businessPartnerNumber:String;
        vendorCode:String;
        customerCode:String;
        businessPartnerName1:String;

        region : String;
        riskCategory:String;
}