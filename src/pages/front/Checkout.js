import { useForm } from "react-hook-form";
import { Link, useOutletContext } from "react-router-dom";
import { Input, } from "../../components/FormElements";
import axios from "axios";
function Checkout() {
    const {cartData} = useOutletContext()
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({
        mode: 'onTouched',
    });

    const onSubmit = async(data) => {
      const { name, email, tel, address } = data
      const form ={
        data: {
          user: {
            name,
            email,
            tel,
            address,
          }
        }
      }
        console.log(errors);
        console.log(data);
        const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/order`, form)
        console.log(res)
    }
return (
    <div className='bg-light pt-5 pb-7'>
    <div className='container'>
      <div className='row justify-content-center flex-md-row flex-column-reverse'>
        <form className='col-md-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='bg-white p-4'>
            <h4 className='fw-bold'>購買資訊</h4>
            <div className='mb-2'>
            <Input
              id='email'
              type='email'
              errors={errors}
              labelText='Email'
              register={register}
              rules={{
                required: 'Email 為必填',
                pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Email 格式不正確'
                },
              }}
              >
              </Input>
            </div>
            <div className='mb-2'>
              <Input
              id='name'
              type='text'
              errors={errors}
              labelText='使用者名稱'
              register={register}
              rules={{
                required: '使用者名稱為必填',
                maxLength: {
                    value: 10,
                    message: '使用者長度不超過10'
                },
              }}
              >
              </Input>
            </div>
            <div className='mb-2'>
            <Input
              id='tel'
              type='tel'
              errors={errors}
              labelText='電話'
              register={register}
              rules={{
                required: '電話為必填',
                maxLength: {
                    value: 12,
                    message: '電話長度不超過12碼'
                },
              }}
              >
              </Input>
            </div>
            <div className='mb-2'>
            <Input
              id='address'
              type='address'
              errors={errors}
              labelText='地址'
              register={register}
              rules={{
                required: '地址為必填',
              
              }}
              >
              </Input>
            </div>
          </div>
          <div className='d-flex flex-column-reverse flex-md-row mt-4 justify-content-between align-items-md-center align-items-end w-100'>
            <Link className='text-dark mt-md-0 mt-3' to='/cart'>
              <i className='bi bi-chevron-left me-2'></i> 上一步
            </Link>
            <button
              type='submit'
              className='btn btn-dark py-3 px-7 rounded-0'
            >
              確定購買
            </button>
          </div>
        </form>
        <div className='col-md-4'>
          <div className='border p-4 mb-4'>
            <h4 className='mb-4'>購買內容</h4>
            {cartData?.carts?.map((item) => {
              return (
                <div className='d-flex' key="item.id">
                  <img
                    src={item.product.imageUrl}
                    alt=''
                    className='me-2'
                    style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                  />
                  <div className='w-100'>
                    <div className='d-flex justify-content-between fw-bold'>
                      <p className='mb-0'>{item.product.title}</p>
                      <p className='mb-0'>x{item.qty}</p>
                    </div>
                    <div className='d-flex justify-content-between'>
                      <p className='text-muted mb-0'>
                        <small>NT$ {item.product.price}</small>
                      </p>
                      <p className='mb-0'>NT$ {item.final_total}</p>
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="d-flex justify-content-between mt-4">
              <p className='mb-0 h4 fw-bold'>折扣</p>
              <p className='mb-0 h4 fw-bold'>-  NT$</p>
            </div>
            <div className='d-flex justify-content-between mt-4'>
              <p className='mb-0 h4 fw-bold'>總計</p>
              <p className='mb-0 h4 fw-bold'>NT$ {cartData.final_total}</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
)

}

export default Checkout;