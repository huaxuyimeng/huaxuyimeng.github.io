import request from '@/utils/http'

// 获取商品列表
export function getProducts(params = {}) {
    return request({
        url: '/products',
        method: 'get',
        params
    })
}

// 获取单个商品详情
export function getProduct(id) {
    return request({
        url: `/products/${id}`,
        method: 'get'
    })
}

// 创建商品
export function createProduct(data) {
    return request({
        url: '/products',
        method: 'post',
        data
    })
}

// 更新商品
export function updateProduct(id, data) {
    return request({
        url: `/products/${id}`,
        method: 'put',
        data
    })
}

// 删除商品
export function deleteProduct(id) {
    return request({
        url: `/products/${id}`,
        method: 'delete'
    })
}

// 批量删除商品
export function batchDeleteProducts(ids) {
    return request({
        url: '/products/batch-delete',
        method: 'post',
        data: { ids }
    })
}

// 获取商品分类
export function getProductCategories() {
    return request({
        url: '/products/categories',
        method: 'get'
    })
}

// 创建商品分类
export function createProductCategory(data) {
    return request({
        url: '/products/categories',
        method: 'post',
        data
    })
}

// 更新商品分类
export function updateProductCategory(id, data) {
    return request({
        url: `/products/categories/${id}`,
        method: 'put',
        data
    })
}

// 删除商品分类
export function deleteProductCategory(id) {
    return request({
        url: `/products/categories/${id}`,
        method: 'delete'
    })
}

// 上传商品图片
export function uploadProductImage(file) {
    const formData = new FormData()
    formData.append('image', file)

    return request({
        url: '/products/upload-image',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 批量上传商品图片
export function batchUploadProductImages(files) {
    const formData = new FormData()
    files.forEach((file, index) => {
        formData.append(`images[${index}]`, file)
    })

    return request({
        url: '/products/batch-upload-images',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 获取商品统计信息
export function getProductStats(params = {}) {
    return request({
        url: '/products/stats',
        method: 'get',
        params
    })
}

// 获取商品销售排行
export function getProductSalesRanking(params = {}) {
    return request({
        url: '/products/sales-ranking',
        method: 'get',
        params
    })
}

// 获取商品库存预警
export function getProductStockWarning(params = {}) {
    return request({
        url: '/products/stock-warning',
        method: 'get',
        params
    })
}

// 更新商品库存
export function updateProductStock(id, stock) {
    return request({
        url: `/products/${id}/stock`,
        method: 'put',
        data: { stock }
    })
}

// 批量更新商品库存
export function batchUpdateProductStock(updates) {
    return request({
        url: '/products/batch-update-stock',
        method: 'put',
        data: { updates }
    })
}

// 获取商品价格历史
export function getProductPriceHistory(id, params = {}) {
    return request({
        url: `/products/${id}/price-history`,
        method: 'get',
        params
    })
}

// 设置商品价格
export function setProductPrice(id, price) {
    return request({
        url: `/products/${id}/price`,
        method: 'put',
        data: { price }
    })
}

// 批量设置商品价格
export function batchSetProductPrice(updates) {
    return request({
        url: '/products/batch-set-price',
        method: 'put',
        data: { updates }
    })
}

// 商品搜索
export function searchProducts(query, params = {}) {
    return request({
        url: '/products/search',
        method: 'get',
        params: { query, ...params }
    })
}

// 高级商品搜索
export function advancedProductSearch(criteria) {
    return request({
        url: '/api/products/advanced-search',
        method: 'post',
        data: criteria
    })
}

// 获取商品推荐
export function getProductRecommendations(params = {}) {
    return request({
        url: '/api/products/recommendations',
        method: 'get',
        params
    })
}

// 标记商品为推荐
export function markProductAsRecommended(id, recommended) {
    return request({
        url: `/api/products/${id}/recommended`,
        method: 'put',
        data: { recommended }
    })
}

// 获取商品评论
export function getProductReviews(id, params = {}) {
    return request({
        url: `/api/products/${id}/reviews`,
        method: 'get',
        params
    })
}

// 添加商品评论
export function addProductReview(id, data) {
    return request({
        url: `/api/products/${id}/reviews`,
        method: 'post',
        data
    })
}

// 删除商品评论
export function deleteProductReview(productId, reviewId) {
    return request({
        url: `/api/products/${productId}/reviews/${reviewId}`,
        method: 'delete'
    })
}

// 获取商品标签
export function getProductTags() {
    return request({
        url: '/api/products/tags',
        method: 'get'
    })
}

// 为商品添加标签
export function addProductTags(id, tags) {
    return request({
        url: `/api/products/${id}/tags`,
        method: 'post',
        data: { tags }
    })
}

// 移除商品标签
export function removeProductTags(id, tags) {
    return request({
        url: `/api/products/${id}/tags`,
        method: 'delete',
        data: { tags }
    })
}

// 导出商品数据
export function exportProducts(format = 'excel', params = {}) {
    return request({
        url: '/api/products/export',
        method: 'get',
        params: { format, ...params },
        responseType: 'blob'
    })
}

// 导入商品数据
export function importProducts(file, options = {}) {
    const formData = new FormData()
    formData.append('file', file)

    if (options.updateExisting) {
        formData.append('updateExisting', 'true')
    }

    return request({
        url: '/api/products/import',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 获取商品导入模板
export function getProductImportTemplate() {
    return request({
        url: '/api/products/import-template',
        method: 'get',
        responseType: 'blob'
    })
}

// 验证商品数据
export function validateProductData(data) {
    return request({
        url: '/api/products/validate',
        method: 'post',
        data
    })
}

// 获取商品操作日志
export function getProductLogs(id, params = {}) {
    return request({
        url: `/api/products/${id}/logs`,
        method: 'get',
        params
    })
}

// 获取商品版本历史
export function getProductVersionHistory(id) {
    return request({
        url: `/api/products/${id}/versions`,
        method: 'get'
    })
}

// 恢复商品版本
export function restoreProductVersion(id, versionId) {
    return request({
        url: `/api/products/${id}/versions/${versionId}/restore`,
        method: 'post'
    })
}

// 商品复制
export function duplicateProduct(id, data = {}) {
    return request({
        url: `/api/products/${id}/duplicate`,
        method: 'post',
        data
    })
}

// 商品归档
export function archiveProduct(id, archived = true) {
    return request({
        url: `/api/products/${id}/archive`,
        method: 'put',
        data: { archived }
    })
}

// 获取归档商品
export function getArchivedProducts(params = {}) {
    return request({
        url: '/api/products/archived',
        method: 'get',
        params
    })
}

// 商品批量操作
export function batchProductOperation(operation, productIds, data = {}) {
    return request({
        url: '/api/products/batch-operation',
        method: 'post',
        data: {
            operation,
            productIds,
            ...data
        }
    })
}

// 获取商品分析报告
export function getProductAnalytics(params = {}) {
    return request({
        url: '/api/products/analytics',
        method: 'get',
        params
    })
}

// 获取商品趋势分析
export function getProductTrends(params = {}) {
    return request({
        url: '/api/products/trends',
        method: 'get',
        params
    })
}

// 获取商品比较数据
export function getProductComparison(productIds) {
    return request({
        url: '/api/products/comparison',
        method: 'get',
        params: { productIds: productIds.join(',') }
    })
}

// 设置商品SEO信息
export function setProductSEO(id, seoData) {
    return request({
        url: `/api/products/${id}/seo`,
        method: 'put',
        data: seoData
    })
}

// 获取商品SEO信息
export function getProductSEO(id) {
    return request({
        url: `/api/products/${id}/seo`,
        method: 'get'
    })
}

// 商品预览
export function previewProduct(id) {
    return request({
        url: `/api/products/${id}/preview`,
        method: 'get'
    })
}

// 发布商品
export function publishProduct(id, published = true) {
    return request({
        url: `/api/products/${id}/publish`,
        method: 'put',
        data: { published }
    })
}

// 获取商品发布状态
export function getProductPublishStatus(id) {
    return request({
        url: `/api/products/${id}/publish-status`,
        method: 'get'
    })
}

export default {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    batchDeleteProducts,
    getProductCategories,
    createProductCategory,
    updateProductCategory,
    deleteProductCategory,
    uploadProductImage,
    batchUploadProductImages,
    getProductStats,
    getProductSalesRanking,
    getProductStockWarning,
    updateProductStock,
    batchUpdateProductStock,
    getProductPriceHistory,
    setProductPrice,
    batchSetProductPrice,
    searchProducts,
    advancedProductSearch,
    getProductRecommendations,
    markProductAsRecommended,
    getProductReviews,
    addProductReview,
    deleteProductReview,
    getProductTags,
    addProductTags,
    removeProductTags,
    exportProducts,
    importProducts,
    getProductImportTemplate,
    validateProductData,
    getProductLogs,
    getProductVersionHistory,
    restoreProductVersion,
    duplicateProduct,
    archiveProduct,
    getArchivedProducts,
    batchProductOperation,
    getProductAnalytics,
    getProductTrends,
    getProductComparison,
    setProductSEO,
    getProductSEO,
    previewProduct,
    publishProduct,
    getProductPublishStatus
} 