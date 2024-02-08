import  { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import './ReadyPage.scss'
import { FaArrowRightLong } from "react-icons/fa6";
import { createClient } from '@supabase/supabase-js';

type Link = {
    id: string,
    user_id: string,
    title: string,
    link: string,
    color: string,
    text_color: string
}

type userDataType = {
    links: Link[],
    profileInfo: {
        id: string,
        user_id: string,
        name: string,
        surname: string,
        email: string
    }
}
const initialValue = {
    links: [{id: '', user_id: '', title: '', link:'', color:'', text_color:''}],
    profileInfo: {
        id:'', 
        user_id: '',
        name: '',
        surname: '',
        email: ''
    }
}

const ReadyPage = () => {

    const [userData, setUserData] = useState<userDataType>(initialValue);
    
    const {id} = useParams()
    const userKey= id?.split('.')[0]
    const imgKey= id?.split('.')[1]
    const userImg = `https://mtfhvhspnkvkdohoydvq.supabase.co/storage/v1/object/public/avatar/${userKey}/${imgKey}`

    const supabase = createClient(`${process.env.SUPABASE_URL}`, `${process.env.API_KEY}`)

    useEffect(() => {
      const fetchData = async() => {
        const linksRes = await supabase.from('link_card').select('*').eq("user_id", userKey)
        if(linksRes.error) {
          console.log(linksRes.error)
          alert('Ошибка получения ссылок')
          return
        }
        const profileRes = await supabase.from('profile').select('*').eq("user_id", userKey).single()
        if(profileRes.error) {
          console.log(profileRes.error)
          alert('Ошибка получения информации')
          return
        }
        setUserData({
          links: linksRes.data,
          profileInfo: profileRes.data
        })

      }
      
      fetchData()
        
    }, []);

    if (!userData || !userImg) {
        return <div>Loading...</div>;
    }

    return (

      <div className='live-preview'>

        {userImg ? 
          <img src={userImg} alt="Аватар" />
          : <div className='skeleton-avatar'></div>
        }
        {userData.profileInfo.name || userData.profileInfo.surname ? 
          <p>{userData.profileInfo.name + ' ' + userData.profileInfo.surname}</p>
          :<div className='skeleton-name'></div>
        }
        {
          userData.profileInfo.email ? 
          <p>{userData.profileInfo.email}</p>
          :<div className='skeleton-email'></div>
        }

        <div className='link-preview-wrapper'>
          {userData.links.map(link => 
              <a key={link.id} 
                href={link.link} 
                target="_blank"
                style={{background:link.color, color: link.text_color, display: link.title ? "flex" : "none"}}
                className='link-preview'>
                  {link.title}
                  <FaArrowRightLong/>
              </a>
          )}
        </div>

      </div>

    );
}

export default ReadyPage