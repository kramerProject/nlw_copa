
interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

import Image from 'next/image'
import appPreviewImage from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExampleImg from '../assets/users-avatar-example.png'
import iconChecks from '../assets/icon-check.svg'
import { api } from '../lib/axios';
import { FormEvent, useState } from 'react';


export default function Home(props) {
  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event: FormEvent) {
    event.preventDefault()

    try {
      const res = await api.post("/pools", {
        title: poolTitle
      })
      const { code } = res.data

      await navigator.clipboard.writeText(code)

      alert('Bolão criado com sucessp')

    } catch (error) {
      console.log(error)
      alert('Falha')
    }

  }





  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="NLW copa"/>

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos</h1>
        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarExampleImg} alt="2 cels" />
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.userCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input
          className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
          type="text"
          required
          placeholder='Qual o nome do seu Bolão?'
          onChange={event => setPoolTitle(event.target.value)}
          value={poolTitle}
        />
          <button className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700" type='submit'>CRIAR MEU BOLÂO</button>
        </form>

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀</p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex item-center justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconChecks}/>
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600'/>

          <div className='flex items-center gap-6'>
            <Image src={iconChecks}/>
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image src={appPreviewImage} alt="2 cels" />
    </div>
  )
}

export const getServerSideProps = async () => {
  const [poolCountRes, guessCountRes, userCountRes] = await Promise.all([
    api.get("pools/count"),
    api.get("guesses/count"),
    api.get("users/count")
  ])

  return {
    props: {
      poolCount:  poolCountRes.data.count,
      guessCount: guessCountRes.data.count,
      userCount: userCountRes.data.count
    }
  }
}
