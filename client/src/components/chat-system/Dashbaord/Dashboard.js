import React, { useEffect, useState } from 'react'
import Input from '../../commons/Input';
import { useDispatch, useSelector } from 'react-redux';
import { retrieveConversations, retrieveMesssagesByConversation, sendMesssagesByConversation, getAllUsers } from '../../../redux/slices/Conversation';
import SkeltonLoader from '../../commons/SkeltonLoader';
import {io} from 'socket.io-client';
const Dashboard = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user:detail")));
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState();
  const [logginuser, setLogginUser] = useState(user.id);
  const [users, setUsers] = useState([]);
  const [messageloader, setMessageLoader] = useState(false);
  const [convloader, setConvLoader] = useState(false);
  const [socket , setSocket] =useState(null);
console.log(messages);
  useEffect(() => {
setSocket(io('http://localhost:8000'))
  },[])


  useEffect(() => {
    socket?.emit('addUser',user?.id);
    socket?.on('getUsers',users => {
      console.log("users =>",users)
    })
    socket?.on('getMessage', data => {
			setMessages(prev => ({
				...prev,
				messages: [...prev.messages, { user: data.user, message: data.message }]
			}))
		})
  },[socket])
  const getConversations = async () => {
    setMessageLoader(false);
    try {
      await dispatch(retrieveConversations({ url: `api/conversations/${user.id}`, method: "get", data: {}, query: '' })).then((res) => {
        const resData = res.payload;
        setConversations(resData)
        setMessageLoader(true);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const fetchMessages = async (conversationId, receiveruser) => {

    const data = {
      receiverId: receiveruser?.receiverId,
      senderId: user.id
    }
    await dispatch(retrieveMesssagesByConversation({ url: `api/message/${conversationId}`, method: "get", data: {}, query: '', params: data })).then((res) => {
      const resData = res.payload;
      console.log("sdsds", resData);
      setMessages({ messages: resData, receiver: receiveruser, conversationId })

    });
  }

  const sendMessage = async (e) => {
    socket?.emit('sendMessage',{
      senderId : user?.id,
      receiverId : messages?.receiver?.receiverId,
      message,
      conversationId: messages?.conversationId
    })
    console.log("sentmessage=>", message, messages?.conversationId, user?.id, messages?.receiver?.receiverId);
    const data = {
      conversationId: messages?.conversationId,
      senderId: user?.id,
      message,
      receiverId: messages?.receiver?.receiverId
    }
    await dispatch(sendMesssagesByConversation({ url: `api/message/`, method: "post", data, query: '' })).then((res) => {
      setMessage('');
    });
  }
  const getUsers = async () => {
    setConvLoader(false);
    try {
      const data = {
        current_user: user.id,
      }
      await dispatch(getAllUsers({ url: `api/users/${user.id}`, method: "get", data: {}, query: '', params: data })).then((res) => {
        const resData = res.payload;
        setUsers(resData)
        setConvLoader(true);
      });
      // Code to execute after getAllUsers completes successfully
    } catch (error) {
      console.error('Error fetching users:', error);
    }

  }
  useEffect(() => {
    const timer = setTimeout(() => {
      getConversations();
      getUsers();
    }, 2000); // Simulate 2-second loading delay

    // Clear the timeout on component unmount to avoid memory leaks
    return () => clearTimeout(timer);
  }, [])
  // useEffect(()=> {
  //   getAllUsers();
  // },[users])
  return (
    <div className='w-screen flex'>
      <div className='w-[25%] h-screen bg-secondary overflow-scroll'>
        <div className='flex justify-center items-center my-10 mx-14'>
          <div className='border border-primary p-[2px] rounded-full'>
            <img src="../../Avatar.svg" width={75} height={75} />
          </div>
          <div className='ml-8'>
            <h4 className='text-2xl'>{user.fullname}</h4>
            <p className='text-lg font-light'>My Account</p>
          </div>
        </div>
        <hr />
        <div className='mx-14 mt-10'>
          <div className='text-primary text-lg'> Messages</div>
          <div>
            {
              messageloader ?
                conversations.length > 0 ?
                  conversations.map(({ conversationId, user }) => {
                    return (
                      <div className='flex  items-center py-8 border-b border-b-gray-300'>
                        <div className='cursor-pointer flex items-center' onClick={() =>
                          fetchMessages(conversationId, user)}>
                          <div className=''>
                            <img src="../../Avatar.svg" width={60} height={60} />
                          </div>
                          <div className='ml-6'>
                            <h4 className='text-lg font-semibold'>{user?.fullname}</h4>
                            <p className='text-sm font-light text-gray-600'>{user?.email}</p>
                          </div>
                        </div>
                      </div>
                    )
                  }) : <div className='text-center text-lg font-semibold mt-24'>No Messages </div> : <SkeltonLoader />
            }
          </div>
        </div>
      </div>
      <div className='w-[50%] h-screen flex flex-col items-center'>
        {
          messages?.receiver?.fullname &&
          <div className='w-[75%] bg-secondary h-[80px] my-14 rounded-full flex items-center px-10 py-2'>
            <div><img src="../../Avatar.svg" height={60} width={60} /></div>
            <div className='ml-6 mr-auto'>
              <div className='text-lg'>{messages?.receiver?.fullname}</div>
              <p className='text-sm font-light text-gray-600'>{messages?.receiver?.email}</p>
            </div>
            <div className='cursor-pointer'><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-phone-plus" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
              <path d="M15 6h6m-3 -3v6" />
            </svg></div>
          </div>
        }
        <div className='h-[75%] w-full overflow-scroll border-b shadow-sm'>
          <div className='p-14'>


            {
              messages?.messages?.length > 0 ?
                messages.messages.map(({ message, user: { userId } = {} }) => {
                  if (user?.id === userId) {
                    return (
                      <div className={`max-w-[40%] rounded-b-xl p-4 mb-6 ${userId === user?.id ? 'bg-primary text-white rounded-tl-xl ml-auto' : 'bg-secondary rounded-tr-xl'} `}>{message}</div>


                    )
                  }
                  else {
                    return (
                      <div className='max-w-[40%] bg-secondary rounded-b-xl rounded-lf-xl p-4 mb-6' data-id={userId}>
                        {message}
                      </div>
                    )
                  }

                }) : <div className='text-lg text-center font-semibold mt-24'>No Messages or no Conversation Selected</div>
            }
          </div>
        </div>
        <div className='p-12 w-full flex'>

          <Input placeholder='type a message...' value={message} onChange={(e) => setMessage(e.target.value)} className='w-full' inputClassName='p-4 border-0 shadow-md rounded-full bg-light focus:ring-0 focus:border-0 outline-none' />
          <div className={`ml-4 p-2 cursor-pointer bg-light rounded-full ${!message && 'pointer-events-none'}`} onClick={() => sendMessage()}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-send" width="35" height="35" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 14l11 -11" />
              <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
            </svg>
          </div>
          <div className='ml-2 p-2 cursor-pointer bg-light rounded-full'>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-plus" width="35" height="35" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
              <path d="M9 12h6" />
              <path d="M12 9v6" />
            </svg>
          </div>
        </div>
      </div>
      <div className='w-[25%] h-screen bg-secondary  px-8 py-16 overflow-scroll'>
        <div className='text-lg text-primary'>Peopple</div>
        <div>
          {
            convloader ?
              users.length > 0 ?
                users.map(({ userId, user }) => {
                  if (logginuser != user.receiverId) {
                    return (
                      <div className='flex  items-center py-8 border-b border-b-gray-300'>
                        <div className='cursor-pointer flex items-center' onClick={() =>
                          fetchMessages('new', user)}>
                          <div className=''>
                            <img src="../../Avatar.svg" width={60} height={60} />
                          </div>
                          <div className='ml-6'>
                            <h4 className='text-lg font-semibold'>{user?.fullname}</h4>
                            <p className='text-sm font-light text-gray-600'>{user?.email}</p>
                          </div>
                        </div>
                      </div>
                    )
                  }
                }) : <div className='text-center text-lg font-semibold mt-24'>No Conversations </div> : <SkeltonLoader />
          }
        </div>
      </div>
    </div>
  )
}

export default Dashboard


