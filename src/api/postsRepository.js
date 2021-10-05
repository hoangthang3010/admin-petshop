import Repository from './Repository'
const account = "/account"
// const productAll = "/productAll"
const productDetail = "/productDetail"
const rateProduct = "/rateProduct"
const commentProduct = "/commentProduct"
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
    deteleAccount(accountId){
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
    deteleProductDetail(productDetailId){
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
    getCommentProduct(){
        return Repository.get( `${commentProduct}`)
    }, 
    createCommentProduct(payload){
        return Repository.post( `${commentProduct}`, payload)
    },
    deteleCommentProductId(commentProductId){
        return Repository.delete(`${commentProduct}/${commentProductId}`)
    },
    updateCommentProductId(commentProductId, payload){
        return Repository.put(`${commentProduct}/${commentProductId}`, payload)
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
