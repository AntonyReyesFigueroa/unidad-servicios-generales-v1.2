import Inicidencias from '@/structures/main/incidencias/incidencias';
import Header from '@/structures/header/header'

export default function Home() {
  // const variable =process.env.AUTH0_BASE_URL;
  // console.log(process.env.CLOUDINARY_NAME);


  return (
    <div className='aplication'>
      <Header />
      <Inicidencias />
    </div>
  );
}
