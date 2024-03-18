import React from 'react'
import {useNavigate,useParams} from "react-router-dom"
import{
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
}from "../../redux/api/productApiSlice"
import {useFetchCategoriesQuery} from "../../redux/api/categoryApiSlice"
import {toast} from 'react-toastify'

const ProductUpdate = () => {
  const params=useParams()
  const{data:productData}=useGetProductByIdQuery
  const [image,setImage]=useState(productData?.image||" ")
  const [name,setName]=useState(productData?.name||" ")
  const [description,setDescription]=useState(productData?.description||" ")
  const [price,setPrice]=useState(productData?.price||" ")
  const[quantity,setQuantity]=useState(productData?.quantity||" ")
  const [category,setCategory]=useState(productData?.brand||" ")
  const [brand,setBrand]=useState(productData?.brand||" ")
  const [stock,setStock]=useState(productData?.stock||" ")

  const navigate=useNavigate()

  const {data:categories=[]}=useFetchCategoriesQuery()
  const[uploadProductImage]=useUploadProductImageMutation()
  const[updateProduct]=useUpdateProductMutation()
  const[deleteProduct]=useDeleteProductMutation()

  useEffect(()=>{
    if(productData && productData._id){
      setName(productData.name)
      setDescription(productData.description)
      setPrice(productData.price)
      setCategory(productData.categories?._id)
      setQuantity(productData.setQuantity)
      setBrand(productData.brand)
      setImage(productData.image)

    }
  },[productData])
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
        const productData=new FormData()
        formData.append('image',image)
        formData.append('name',name)
        formData.append('description',description)
        formData.append('price',price)
        formData.append('category',category)
        formData.append('quantity',quantity)
        formData.append('brand',brand)
        formData.append('countInStock',stock)

        const {data}=await updateProduct({productId: params._id,formData})
        if(data.error){
            toast.error(data.error)
        }else{
            toast.success(`Product successfully updated`)

            navigate("/admin/allproductslist")
        }

    }catch(error){
        console.error(error)
        toast.error("Product update failed.Try again!") 
      }
    }      
const handleDelete=async()=>{
  try{
    let answer =window.confirm('Are you sure you want to delete this product?')
    if(!answer) return;
    const{data}=await deleteProduct(params._id)
    toast.success(`${data.name} is deleted`)
    navigate('/admin/allproductslist')
    
  }catch(error){
    console.log(error)
    toast.error("Delete failed.Try again")
  }
}
  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu/>
        <div className="md:w-3/4 p-3">
          <div className="h-12">Create Product</div>
          {image && (
            <div className="text-center">
              <img
              src={image}
              alt="product"
              className="block mx-auto max-h-[200px]" 
              />
              </div>
          )}
          <div className="mb-3">
            <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
              {image ? image.name :"Upload Image"}
              <input
                type="file"
                name=''
                accept=''
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductUpdate
