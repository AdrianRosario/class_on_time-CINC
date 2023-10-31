import React, {Fragment, useState} from 'react'
import Menu from './Menu'
const ResetPassword = () => {
    const [email, setEmail] = useState("")

    const handlesubmin = (e) => {
        e.preventDefault();
        console.log(handlesubmin)
    }


  return (
    <Fragment>
        <Menu/>
        <div className='reset'>
            <form onSubmit={handlesubmin} className='form-reset'>
                <div className='con-reset'>
                    <header className='head-reset'>
                        <h2>Reset Password</h2>
                    </header>
                    <div className='field-reset'>
                        <input className='form-input' id='txt-gmail' type='text' placeholder='@Email' onChange={(e) => setEmail(e.target.value)} value={email} required/>
                        <br/>
                        <button className="log-in"> Enviar </button>
                    </div>
                </div>
            </form>
        </div>
    </Fragment>
  )
}

export default ResetPassword
