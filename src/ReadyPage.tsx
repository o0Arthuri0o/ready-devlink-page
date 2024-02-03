import  { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import './ReadyPage.scss'
import { FaArrowRightLong } from "react-icons/fa6";

type Link = {
    id: string,
    user_email: string,
    title: string,
    link: string,
    color: string,
    text_color: string
}

type userDataType = {
    links: Link[],
    profileInfo: {
        id: string,
        user_email: string,
        name: string,
        surname: string,
        new_email: string
    }
}
const initialValue = {
    links: [{id: '', user_email: '', title: '', link:'', color:'', text_color:''}],
    profileInfo: {
        id:'', 
        user_email: 'string',
        name: 'string',
        surname: 'string',
        new_email: 'string'
    }
}

const ReadyPage = () => {

    const [userData, setUserData] = useState<userDataType>(initialValue);
    const [userImg, setUserImg] = useState('');
    const {id} = useParams()

    useEffect(() => {
        fetch(`${process.env.SERVER_URL}/ready/${id}`)
            .then(response => response.json())
            .then(data => setUserData(data))
            .catch(error => console.error(error));
        fetch(`${process.env.SERVER_URL}/readyimg/${id}`)
            .then(response => {
                if(response.url) setUserImg(response.url)
            })
            // .then(data => console.log(data))
            .catch(error => console.error(error));
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
          <p>{userData.profileInfo.name +' ' + userData.profileInfo.surname}</p>
          :<div className='skeleton-name'></div>
        }
        {
          userData.profileInfo.new_email ? 
          <p>{userData.profileInfo.new_email}</p>
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