using { db.schema as db } from '../db/schema';

service BPExtension {

    entity BusinessPartnerExt as projection on db.BusinessPartnerExt;
    action syncBP() returns String;
}