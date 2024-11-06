import React from 'react'
import '@/style/footer/footer.css'

export default function Footer() {
  return (
    <div style={{height:'66px'}}>
      <footer className='footer'>
        <div className='footer__span'>
          <span> Copyright © 2024 </span>
          <span> Oficina de Unidad de Servicios Generales </span>
          <span>.</span>
          <span> Derechos Reservados. </span>
        </div>
        <div className='footer__version'>

          <span> Version </span>
          <span> 1.0.0 </span>

        </div>
      </footer>
    </div>
  )
}
