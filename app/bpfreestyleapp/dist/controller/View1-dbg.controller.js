sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (
    Controller,
    MessageBox,
    Filter,
    FilterOperator
) {
    "use strict";

    return Controller.extend(
        "bpfreestyleapp.controller.View1",
        {
            onInit: function () {
            },
            onSyncBP: async function () {
                try {
                    const response = await fetch(
                        "/odata/v4/BPExtension/syncBP",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            }
                        }
                    );

                    if (response.ok) {
                        MessageBox.success(
                            "Business Partners Synced Successfully"
                        );
                        this.getView()
                            .getModel()
                            .refresh();
                    //INSERT.into("db.schema.BusinessPartnerExt").entries(response);
                    } else {
                        MessageBox.error(
                            "Sync Failed"
                        );
                    }
                } catch (error) {
                    MessageBox.error(
                        error.message
                    );
                }
            },
            onSearch: function (oEvent) {
                var sValue =
                    oEvent.getParameter("newValue");
                var oTable =
                    this.byId("bpTable");

                var oBinding =
                    oTable.getBinding("items");

                var aFilters = [];

                if (sValue) {

                    aFilters.push(
                        new Filter({
                            filters: [
                                new Filter(
                                    "businessPartnerNumber",
                                    FilterOperator.Contains,
                                    sValue
                                ),
                                new Filter(
                                    "businessPartnerName1",
                                    FilterOperator.Contains,
                                    sValue
                                ),
                                new Filter(
                                    "region",
                                    FilterOperator.Contains,
                                    sValue
                                ),
                                new Filter(
                                    "riskCategory",
                                    FilterOperator.Contains,
                                    sValue
                                )
                            ],
                            and: false
                        })
                    );
                }

                oBinding.filter(aFilters);
            },
            onCreateBP: async function () {

                if (!this._oDialog) {

                    this._oDialog = await sap.ui.core.Fragment.load({
                        name: "bpfreestyleapp.view.CreateBP",
                        controller: this
                    });

                    this.getView().addDependent(this._oDialog);
                }

                this._oDialog.open();
            },
            onSaveBP: async function () {

                const payload = {
                    businessPartnerNumber:
                        sap.ui.getCore().byId("bpNumber").getValue(),

                    businessPartnerName1:
                        sap.ui.getCore().byId("bpName").getValue(),

                    region:
                        sap.ui.getCore().byId("region").getValue(),

                    riskCategory:
                        sap.ui.getCore().byId("riskCategory").getSelectedKey()
                };

                try {

                    const response = await fetch(
                        "/odata/v4/BPExtension/BusinessPartnerExt",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(payload)
                        }
                    );

                    if (response.ok) {

                        sap.m.MessageToast.show(
                            "Record Created"
                        );

                        this.getView().getModel().refresh();

                        this._oDialog.close();
                    }

                } catch (error) {

                    sap.m.MessageBox.error(error.message);
                }
            },
            onCloseDialog: function () {
                if (this._oDialog) {
                    this._oDialog.close();
                }
                if (this._oEditDialog) {
                    this._oEditDialog.close();
                }

            },
            getSelectedContext: function () {

                const oTable = this.byId("bpTable");

                const oItem = oTable.getSelectedItem();

                if (!oItem) {
                    sap.m.MessageToast.show("Please select a Business Partner");
                    return null;
                }

                return oItem.getBindingContext();
            },
            onEditBP: async function () {

                const oContext = this.getSelectedContext();

                if (!oContext) {
                    return;
                }

                if (!this._oEditDialog) {

                    this._oEditDialog = await sap.ui.core.Fragment.load({
                        name: "bpfreestyleapp.view.EditBP",
                        controller: this
                    });

                    this.getView().addDependent(this._oEditDialog);
                }

                this._oEditDialog.setBindingContext(oContext);

                this._oEditDialog.open();
            },
            onSaveEdit: async function () {

                try {

                    const oContext = this._oEditDialog.getBindingContext();

                    await oContext.getModel().submitBatch("$auto");

                    sap.m.MessageToast.show("BP Updated");

                    this._oEditDialog.close();

                } catch (error) {

                    sap.m.MessageToast.show("Update Failed");
                }
            },
            onDeleteBP: async function (oEvent) {
                const oLine = this.getSelectedContext();
                if(!oLine){
                    return;
                }
                const oTable = this.byId("bpTable");
                const oItem = oTable.getSelectedItem();
                try {

                    //const oContext = oEvent.getSource().getBindingContext();
                    const oContext = oItem.getBindingContext();
                    await oContext.delete();

                    sap.m.MessageToast.show("Deleted Successfully");

                } catch (error) {

                    sap.m.MessageToast.show("Delete Failed");
                }
            }

        }
    );
});