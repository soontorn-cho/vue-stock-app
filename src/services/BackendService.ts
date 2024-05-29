import axios from 'axios'
// อ่าน token จาก localStorage
const token = localStorage.getItem('token') || ''
const backendService = axios.create({
    baseURL: import.meta.env.VITE_APP_URL_API,
    withCredentials: false,
    headers: {
        'Authorization': 'Bearer ' + token // ใส่ token ไปด้วยก่อนส่งไปที่ backend ทุกครั้ง
    }
})

// CRUD Product -----------------------------------
// Read All Products
function getAllProducts(page: number, limit: number) {
    return backendService.get('products', {
        params: {
            page: page,
            limit: limit
        }
    })
}
// Read One Product
function getOneProduct(id: string) {
    return backendService.get('products/' + id)
}
export {
    getAllProducts,
    getOneProduct
}