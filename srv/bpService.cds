using{BusinessPartner as bp} from './external/BusinessPartner';
service BusinessPartnerService {
    entity BusinessPartner as projection on bp.BusinessPartner{
        key ID,
        businessPartnerNumber,
        businessPartnerName1,
        businessPartnerName2,
        customerCode,
        vendorCode,
        address
    }
    entity Plant as projection on bp.Plant{
        key ID,
        plantName,
        sourceSystem
    }

}
