/// <reference path="./../../typings/tsd.d.ts" />
module backApp {

    interface IModalController{
        addSelected(product:any):void;
    }

    class ModalController implements IModalController{
        public selectedItems = [];

        public prodCheckbox = [];

        constructor(public scope,public products, public selectedProducts ,close){

            if(selectedProducts){
                this.selectedItems = selectedProducts;
                for(var i = 0;i<selectedProducts.length;i++){
                    this.prodCheckbox[selectedProducts[i].id] = true;
                }
            }
        }

        public addSelected(product){

            var prodObj = {
                id: product.id,
                name: product.name,
                price: 0,
                quantity: 0
            };

            var index = this.checkById(product.id);
            if(index>-1){
                this.selectedItems.splice(index, 1);
            }else{
                this.selectedItems.push(prodObj);
            }

        }

        public checkById(id):number{
            var index = -1;
            for(var i = 0;i<this.selectedItems.length;i++){
                if(this.selectedItems[i].id == id){
                    index = i;
                    break;
                }
            }
            return index;
        }
    }

    interface IStorageController{
        addProducts():void;
    }

    class StorageController implements IStorageController{
        public _formData : any = {
            products : []
        };

        public selectedItems = [];

        constructor(private scope, private modalService,private moment,private http, private window,private storageService,private storage,private storages,public products){
            this.init();
        }

        private initBasic(){
            for(var i = 0;i<this.products.length; i++){
                var prodObj = {
                    id: this.products[i].id,
                    name: this.products[i].name,
                    price: 0,
                    quantity: 0
                };
                var isIn = false;
                for(var y = 0;y<this._formData.products.length;y++){
                    if(prodObj.id == this._formData.products[y].id){
                        isIn = true;
                    }
                }
                if(!isIn){
                    this._formData.products.push(prodObj);
                }
            }
        }

        public initProducts(type){

            if(type == 'basic'){
                this.initBasic();
            } else {
                this._formData.products = [];
            }
        }

        private init(){
            if(this.storage){
                if(typeof this.storage.dateTo === 'number'){
                    this.storage.dateTo = this.moment.unix(this.storage.dateTo).format('YYYY-MM-DD');
                }
                if(typeof this.storage.dateFrom === 'number'){
                    this.storage.dateFrom = this.moment.unix(this.storage.dateFrom).format('YYYY-MM-DD');
                }
                this._formData = this.storage;
                if(this._formData.type == 'basic') {
                    this.initBasic();
                }
            }
            if(!this.storageService.storages){
                for(var i = 0;i<this.storages.length;i++){
                    this.storages[i].dateTo = this.storages[i].dateTo?this.storages[i].dateTo:"";
                    this.storages[i].dateFrom = this.storages[i].dateFrom?this.storages[i].dateFrom:"";
                    if(typeof this.storages[i].dateTo === 'number'){
                        this.storages[i].dateTo = this.moment.unix(this.storages[i].dateTo).format('YYYY-MM-DD');
                    }
                    if(typeof this.storages[i].dateFrom === 'number'){
                        this.storages[i].dateFrom = this.moment.unix(this.storages[i].dateFrom).format('YYYY-MM-DD');
                    }
                }
                this.storageService.storages = this.storages;
            }
        }

        public save(back:boolean):void{
            var self = this;
            var data = angular.toJson(this._formData);
            this.http.post('/admin/storage/save',data).then(function (response) {
                var id = angular.fromJson(response.data);
                if(back){
                    self.window.open('/admin/storage', '_self');
                }else{
                    self.window.open('/admin/storage/edit/'+id, '_self');
                }
            },function (response) {

            });
        }

        public addProducts(){
            var self = this;
            this.modalService.showModal({
                templateUrl: "/modules/Admin/views/directives/modals/add-products.html",
                controller: 'ModalController',
                controllerAs : "ctrl",
                inputs:{
                    'products' : self.products,
                    'selectedProducts' : self._formData.products
                }
            }).then(function(modal) {

                modal.element.modal();

                self._formData.products = modal.controller.selectedItems;
            });
        }
    }

    var backApp = angular.module('backApp');
    backApp.controller('ModalController',['$scope','products','selectedProducts','close',ModalController]);
    backApp.controller('StorageController', ['$scope','ModalService','moment', '$http','$window','StorageService','storage','storages','products', StorageController]);
}