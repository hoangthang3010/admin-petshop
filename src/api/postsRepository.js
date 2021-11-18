import Repository from './Repository'
const account = "/account"
// const productAll = "/productAll"
const productDetail = "/productDetail"
const rateProduct = "/rateProduct"
const commentProduct = "/commentProduct"
const orderProduct = "/orderProduct"
const race = "/race"
const slide = "/slides"
const typeProduct = "/productAll"
const warehouse = "/warehouse"
const news = "/news"
export default {
    getAccount(){
        return Repository.get(`${account}`);
    },
    getAccountId(accountId){
        return Repository.get( `${account}/${accountId}`)
    },
    createAccount(payload){
        return Repository.post(`${account}`, payload)
    },
    updateAccount(accountId, payload){
        return Repository.put(`${account}/${accountId}`, payload)
    },
    deleteAccount(accountId){
        return Repository.delete(`${account}/${accountId}`)
    },
    getProductDetail(){
        return Repository.get(`${productDetail}`);
    },
    getProductDetailId(productDetailId){
        return Repository.get( `${productDetail}/${productDetailId}`)
    },
    createProductDetail(payload){
        return Repository.post(`${productDetail}`, payload)
    },
    updateProductDetail(productDetailId, payload){
        return Repository.put(`${productDetail}/${productDetailId}`, payload)
    },
    deleteProductDetail(productDetailId){
        return Repository.delete(`${productDetail}/${productDetailId}`)
    },
    getRateProduct(){
        return Repository.get( `${rateProduct}`)
    }, 
    createRateProduct(payload){
        return Repository.post(`${rateProduct}`, payload)
    },
    updateUserRateProduct(rateId, payload){
        return Repository.put(`${rateProduct}/${rateId}`, payload)
    },
    //xoa đánh giá sanr phẩm khi sản phaamrr bị xóa
    deleteRateProduct(idRate){
        return Repository.delete(`${rateProduct}/${idRate}`)
    },
    getCommentProduct(){
        return Repository.get( `${commentProduct}`)
    }, 
    createCommentProduct(payload){
        return Repository.post( `${commentProduct}`, payload)
    },
    deleteCommentProductId(commentProductId){
        return Repository.delete(`${commentProduct}/${commentProductId}`)
    },
    updateCommentProductId(commentProductId, payload){
        return Repository.put(`${commentProduct}/${commentProductId}`, payload)
    },
    getOrder(){
        return Repository.get( `${orderProduct}`)
    }, 
    createOrder(payload){
        return Repository.post( `${orderProduct}`, payload)
    },
    deleteOrder(idOrderProduct){
        return Repository.delete(`${orderProduct}/${idOrderProduct}`)
    },
    updateOrderId(idOrderProduct, payload){
        return Repository.put(`${orderProduct}/${idOrderProduct}`, payload)
    },
    getRace(){
        return Repository.get( `${race}`)
    }, 
    createRace(payload){
        return Repository.post( `${race}`, payload)
    },
    deleteRace(idRace){
        return Repository.delete(`${race}/${idRace}`)
    },
    updateRaceId(idRace, payload){
        return Repository.put(`${race}/${idRace}`, payload)
    },
    getSlide(){
        return Repository.get( `${slide}`)
    }, 
    createSlide(payload){
        return Repository.post( `${slide}`, payload)
    },
    deleteSlide(idSlide){
        return Repository.delete(`${slide}/${idSlide}`)
    },
    updateSlideId(idSlide, payload){
        return Repository.put(`${slide}/${idSlide}`, payload)
    },
    getTypeProduct(){
        return Repository.get( `${typeProduct}`)
    }, 
    createTypeProduct(payload){
        return Repository.post( `${typeProduct}`, payload)
    },
    deleteTypeProduct(idTypeProduct){
        return Repository.delete(`${typeProduct}/${idTypeProduct}`)
    },
    updateTypeProductId(idTypeProduct, payload){
        return Repository.put(`${typeProduct}/${idTypeProduct}`, payload)
    },
    getWarehouse(){
        return Repository.get( `${warehouse}`)
    }, 
    createWarehouse(payload){
        return Repository.post( `${warehouse}`, payload)
    },
    deleteWarehouse(idTypeProduct){
        return Repository.delete(`${warehouse}/${idTypeProduct}`)
    },
    updateWarehouseId(idTypeProduct, payload){
        return Repository.put(`${warehouse}/${idTypeProduct}`, payload)
    },
    getNews(){
        return Repository.get( `${news}`)
    }, 
    createNews(payload){
        return Repository.post( `${news}`, payload)
    },
    deleteNews(idTypeProduct){
        return Repository.delete(`${news}/${idTypeProduct}`)
    },
    updateNewsId(idTypeProduct, payload){
        return Repository.put(`${news}/${idTypeProduct}`, payload)
    },

}
// const productApi = {
//   fetchProductApi: (params) => {
//     const url=`/${params}`
//     return axiosClient.get(url)
//   },
//   fetchCategoryApi: (params) => {
//     const url=`/${params}`
//     return axiosClient.get(url)
//   },
//   fetchProductApiById: (id) => {
//     const url=`/product/${id}`
//     return axiosClient.get(url)
//   },
//   fetchAccountApi: () => {
//     const url='/account'
//     return axiosClient.get(url)
//   },
// }

// export default productApi
